from datetime import datetime
from typing import Optional, Union

from sqlalchemy import func, text


def time_bucket(
    bucket_width: Union[str, int],
    ts: Union[datetime, int],
    timezone: Optional[str] = None,
    origin: Optional[Union[datetime, str]] = None,
    offset: Optional[Union[str, int]] = None,
) -> func:
    """
    SQLModel implementation of TimescaleDB's time_bucket function.

    Args:
        bucket_width: Interval string (e.g., '5 minutes') or integer for bucket width
        ts: Timestamp column or integer column to bucket
        timezone: Optional timezone for calculating bucket start/end times
        origin: Optional timestamp for bucket alignment
        offset: Optional interval or integer to offset buckets

    Returns:
        SQLAlchemy function expression for time_bucket

    Example:
        bucket = time_bucket('5 minutes', Model.timestamp)
        query = select(
            bucket,
            func.avg(Model.value)
        ).group_by(bucket)
    """
    # Format bucket_width as a string interval if it's an integer
    if isinstance(bucket_width, int):
        bucket_width = f"{bucket_width} seconds"

    # Cast the bucket_width to INTERVAL type
    bucket_width = text(f"'{bucket_width}'::interval")

    args = [bucket_width, ts]

    # Add optional parameters if provided
    if timezone is not None:
        args.append(timezone)
    if origin is not None:
        args.append(origin)
    if offset is not None:
        args.append(offset)
    # Create the time_bucket function call with the correct schema
    return func.time_bucket(*args)


def time_bucket_gapfill(
    bucket_width: Union[str, int],
    ts: Union[datetime, int],
    timezone: Optional[str] = None,
    start: Optional[Union[datetime, int]] = None,
    finish: Optional[Union[datetime, int]] = None,
) -> func:
    """
    SQLModel implementation of TimescaleDB's time_bucket_gapfill function.
    Creates time buckets and fills gaps in data with NULL values.

    Args:
        bucket_width: Interval string (e.g., '5 minutes') or integer for bucket width
        ts: Timestamp column or integer column to bucket
        timezone: Optional timezone for calculating bucket start/end times
        start: Optional start time for gapfilling range
        finish: Optional end time for gapfilling range

    Returns:
        SQLAlchemy function expression for time_bucket_gapfill

    Example:
        bucket = time_bucket_gapfill('1 day', Model.timestamp)
        query = select(
            bucket,
            func.avg(Model.value)
        ).group_by(bucket)
    """
    # Format bucket_width as a string interval if it's an integer
    if isinstance(bucket_width, int):
        bucket_width = f"{bucket_width} seconds"

    # Cast the bucket_width to INTERVAL type
    bucket_width = text(f"'{bucket_width}'::interval")

    args = [bucket_width, ts]

    # Add timezone parameter if provided
    if timezone is not None:
        args.append(text(f"'{timezone}'"))

    # Handle start and finish timestamps with timezone awareness
    if start is not None and finish is not None:
        # For time_bucket_gapfill, start and finish must be provided together
        timestamp_type = "timestamptz" if timezone is not None else "timestamp"
        args.extend(
            [
                text(f"'{start}'::{timestamp_type}"),
                text(f"'{finish}'::{timestamp_type}"),
            ]
        )

    # Create the time_bucket_gapfill function call
    return func.time_bucket_gapfill(*args)
