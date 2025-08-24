from typing import Type

import sqlalchemy
from sqlmodel import Session, SQLModel

from timescaledb.retention import extractors, sql


def add_retention_policy(
    session: Session,
    model: Type[SQLModel] = None,
    table_name: str = None,
    drop_after=None,
) -> None:
    """
    Add a retention policy to a hypertable
    """
    if all([model is None, table_name is None]):
        raise ValueError("model or table_name is required to add a retention policy")

    if model is not None:
        policy_params = extractors.extract_model_retention_policy_params(model)
        sql_query = sql.format_retention_policy_sql_query(
            table_name=policy_params["table_name"],
            drop_after=policy_params.get("drop_after") or drop_after,
        )
    else:
        sql_query = sql.format_retention_policy_sql_query(
            table_name=table_name,
            drop_after=drop_after,
        )

    session.execute(sqlalchemy.text(sql_query))
