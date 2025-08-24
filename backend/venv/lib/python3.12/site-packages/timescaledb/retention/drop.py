import sqlalchemy
from sqlmodel import Session

from timescaledb.retention import sql


def drop_retention_policy(
    session: Session,
    table_name: str,
) -> None:
    """
    Drop a retention policy for a hypertable

    Args:
        session: SQLAlchemy session
        table_name: Name of the table to drop retention policy for
    """
    session.execute(
        sqlalchemy.text(sql.get_drop_retention_policy_sql_query(table_name))
    )
