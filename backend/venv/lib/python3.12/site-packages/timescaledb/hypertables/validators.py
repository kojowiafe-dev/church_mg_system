from datetime import timedelta
from typing import Type

import sqlalchemy
from sqlmodel import SQLModel

from timescaledb import exceptions


def validate_time_column(model: Type[SQLModel], time_column: str = "time") -> bool:
    """
    Verify if the specified field is a valid time field (DateTime or TIMESTAMP)
    """
    # Get the column type from SQLModel
    column = model.__table__.columns.get(time_column)
    if column is None:
        raise exceptions.InvalidTimeColumn(
            f"Model {model.__name__} does not have a valid time column"
        )

    # Check if the column type is DateTime or TIMESTAMP
    column_type = type(column.type)
    is_valid = column_type in (
        sqlalchemy.DateTime,
        sqlalchemy.TIMESTAMP,
    )
    if not is_valid:
        raise exceptions.InvalidTimeColumnType(
            f"Model {model.__name__} has an invalid data type for the time column. "
            "Use sqlalchemy.DateTime or sqlalchemy.TIMESTAMP"
        )


def validate_chunk_time_interval(
    model_class: Type[SQLModel], time_column: str, interval: str
) -> None:
    """
    Validate that chunk_time_interval matches the time column type.

    Args:
        model_class: The SQLModel class containing the time column
        time_column: Name of the time column
        interval: The chunk time interval value to validate

    Raises:
        ValueError: If the interval format doesn't match the column type requirements
    """
    column = model_class.__table__.columns.get(time_column)
    if column is None:
        raise exceptions.InvalidChunkTimeInterval(
            f"{model_class.__name__}: Time column {time_column} not found"
        )

    column_type = type(column.type).__name__
    # For integer-based columns
    if column_type in ("Integer", "BigInteger", "SmallInteger"):
        try:
            int(interval)
        except (ValueError, OverflowError):
            raise exceptions.InvalidChunkTimeInterval(
                f"{model_class.__name__}: chunk_time_interval must be an integer "
                f"representing microseconds for {column_type} columns"
            )
    # For datetime-based columns (TIMESTAMP, TIMESTAMPTZ, DATE)
    elif column_type in ("DateTime", "Date"):
        time_interval_seconds = interval
        if isinstance(interval, timedelta):
            time_interval_seconds = interval.total_seconds()
            try:
                int(time_interval_seconds)
            except (ValueError, OverflowError):
                raise exceptions.InvalidChunkTimeInterval(
                    f"{model_class.__name__}: chunk_time_interval must be an integer "
                    f"representing microseconds for {column_type} columns"
                )
        elif isinstance(interval, int):
            try:
                int(interval)
            except (ValueError, OverflowError):
                raise exceptions.InvalidChunkTimeInterval(
                    f"{model_class.__name__}: chunk_time_interval must be an integer "
                    f"representing microseconds for {column_type} columns"
                )
        elif isinstance(interval, str):
            if not interval.upper().startswith("INTERVAL"):
                raise exceptions.InvalidChunkTimeInterval(
                    f"{model_class.__name__}: chunk_time_interval must be an INTERVAL "
                    f"(e.g., 'INTERVAL 1 DAY') for {column_type} columns"
                )
    else:
        raise exceptions.InvalidChunkTimeInterval(
            f"{model_class.__name__}: Unsupported time column type {column_type}"
        )
