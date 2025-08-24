from typing import Optional

import sqlalchemy
from sqlmodel import Session

from timescaledb.retention import sql


def list_retention_policies(
    session: Session,
) -> Optional[dict]:
    """
    Get the retention policy for a hypertable
    """
    sql_query = sql.list_retention_policies_sql_query()
    results = session.execute(sqlalchemy.text(sql_query)).fetchall()

    if results is None:
        return None

    results = [x[0] for x in results]
    return results
