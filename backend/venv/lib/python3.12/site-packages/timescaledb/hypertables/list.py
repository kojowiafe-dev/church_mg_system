from typing import List

import sqlalchemy
from sqlmodel import Session

from timescaledb.hypertables import sql_statements as sql
from timescaledb.hypertables.schemas import HyperTableSchema


def list_hypertables(session: Session) -> List[HyperTableSchema]:
    """
    List all hypertables in the database

    Returns:
        List[HyperTableSchema]: A list of HyperTableSchema objects containing hypertable information
    """
    rows = session.execute(
        sqlalchemy.text(sql.LIST_AVAILABLE_HYPERTABLES_SQL)
    ).fetchall()
    return [HyperTableSchema(**dict(row._mapping)) for row in rows]


def is_hypertable(session: Session, table_name: str) -> bool:
    """
    Check if a specific table is a hypertable

    Args:
        session: SQLModel session
        table_name: Name of the table to check

    Returns:
        bool: True if the table is a hypertable, False otherwise
    """
    hypertables = list_hypertables(session)
    return any(h.hypertable_name == table_name for h in hypertables)
