import sqlalchemy
from sqlalchemy.engine import Engine


def create_engine(url: str, timezone: str = "UTC", **kwargs) -> Engine:
    """Create a SQLAlchemy engine with TimescaleDB-specific configuration.

    Args:
        url: Database URL
        timezone: Timezone to use for the database connection
        **kwargs: Additional arguments to pass to create_engine

    Returns:
        SQLAlchemy Engine instance
    """
    connect_args = kwargs.pop("connect_args", {})
    connect_args["options"] = f"-c timezone={timezone}"

    return sqlalchemy.create_engine(
        url,
        connect_args=connect_args,
        execution_options={"isolation_level": "READ COMMITTED"},
        **kwargs,
    )
