from typing import Any, Dict, List

from sqlalchemy import Float, Numeric, text
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlmodel import Session, func, select

from timescaledb.hyperfunctions import time_bucket, time_bucket_gapfill


def time_bucket_query(
    session: Session,
    model: Any,
    interval: str = "1 hour",
    time_field: str = "time",
    metric_field: str = "metric",
    decimal_places: int = 4,
    round_to_nearest: bool = True,
    annotations: Dict = None,
    filters: List = None,
) -> List[Dict]:
    """
    SQLModel implementation of TimescaleDB time_bucket function.

    Args:
        session: SQLModel session
        model: The SQLModel class to query
        interval: Time interval (e.g., '1 hour', '1 day')
        time_field: The timestamp field to bucket (defaults to 'time')
        metric_field: The metric field to aggregate (defaults to 'metric')
        decimal_places: Number of decimal places to round to
        round_to_nearest: Whether to round the average
        annotations: Additional annotations to add to the query
        filters: List of filter conditions to apply to the query
    """
    if isinstance(time_field, InstrumentedAttribute):
        time_field = time_field.key
    if isinstance(metric_field, InstrumentedAttribute):
        metric_field = metric_field.key

    try:
        model_timescale_field_value = getattr(model, time_field)
        metric_field_value = getattr(model, metric_field)
    except AttributeError as e:
        raise ValueError(
            f"Column {str(e).split()[-1]} not found in model {model.__name__}"
        )

    bucket = time_bucket(interval, model_timescale_field_value)
    avg_func = func.avg(metric_field_value)
    if round_to_nearest:
        avg_func = func.cast(
            func.round(func.cast(avg_func, Numeric), decimal_places),
            Float,
        )
    query = (
        select(
            bucket.label("bucket"),
            avg_func.label("avg"),
        )
        .group_by(bucket)
        .order_by(bucket.desc())
    )

    # Apply filters if provided
    if filters:
        for filter_condition in filters:
            query = query.where(filter_condition)

    result = session.exec(query)
    result = result.mappings().all()
    return list(result)


def time_bucket_gapfill_query(
    session: Session,
    model: Any,
    interval: str = "1 hour",
    time_field: str = "time",
    metric_field: str = "metric",
    start: Any = None,
    finish: Any = None,
    use_interpolate: bool = False,
    use_locf: bool = False,
    bucket_label: str = "bucket",
    value_label: str = "avg",
    filters: List = None,
) -> List[Dict]:
    """
    SQLModel implementation of TimescaleDB time_bucket_gapfill function.

    Args:
        session: SQLModel session
        model: The SQLModel class to query
        interval: Time interval (e.g., '1 hour', '1 day')
        time_field: The timestamp field to bucket
        metric_field: The metric field to aggregate
        start: Start time for gap filling
        finish: End time for gap filling
        use_interpolate: Use interpolation for gap filling
        use_locf: Use last observation carried forward for gap filling
        bucket_label: Label for the bucket column
        value_label: Label for the value column
        filters: List of filter conditions to apply to the query
    """
    if isinstance(time_field, InstrumentedAttribute):
        time_field = time_field.key
    if isinstance(metric_field, InstrumentedAttribute):
        metric_field = metric_field.key

    try:
        model_timescale_field_value = getattr(model, time_field)
        metric_field_value = getattr(model, metric_field)
    except AttributeError as e:
        raise ValueError(
            f"Column {str(e).split()[-1]} not found in model {model.__name__}"
        )

    if start and finish and finish <= start:
        raise ValueError("Finish time must be after start time")

    # Remove any timezone info from start/finish if present
    if start and start.tzinfo:
        start = start.replace(tzinfo=None)
    if finish and finish.tzinfo:
        finish = finish.replace(tzinfo=None)

    # Create the gapfill bucket
    bucket = time_bucket_gapfill(
        interval,
        model_timescale_field_value,
        start=start,
        finish=finish,
    )

    # Build the query with window functions for gapfilling
    avg_func = func.avg(metric_field_value)

    # Apply gapfilling strategy
    if use_locf:
        data_func = func.locf(avg_func)
    elif use_interpolate:
        data_func = func.interpolate(avg_func)
    else:
        data_func = avg_func

    query = (
        select(
            bucket.label(bucket_label),
            data_func.label(value_label),
        )
        .group_by(bucket)
        .order_by(text(f"{bucket_label} ASC"))
    )

    # Apply time range filters
    if start:
        query = query.filter(model_timescale_field_value >= start)
    if finish:
        query = query.filter(model_timescale_field_value <= finish)

    # Apply additional filters if provided
    if filters:
        for filter_condition in filters:
            query = query.where(filter_condition)

    result = session.exec(query)
    result = result.mappings().all()
    return list(result)
