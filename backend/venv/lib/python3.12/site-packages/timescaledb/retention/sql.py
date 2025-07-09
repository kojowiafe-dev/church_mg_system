from datetime import timedelta

import sqlalchemy

from timescaledb import cleaners

RETENTION_POLICY_SQL_VIA_INTERVAL = """
SELECT add_retention_policy(:hypertable_name, drop_after => INTERVAL :drop_after);
"""

RETENTION_POLICY_SQL_VIA_INTEGER = """
SELECT add_retention_policy(:hypertable_name, drop_after => BIGINT :drop_after);
"""


RETENTION_POLICY_INTERVAL_TYPE_SQL_TEMPLATE_MAPPING = {
    "INTEGER": RETENTION_POLICY_SQL_VIA_INTEGER,
    "INTERVAL": RETENTION_POLICY_SQL_VIA_INTERVAL,
}


def format_retention_policy_sql_query(
    table_name: str,
    drop_after: str | int | timedelta | None = None,
) -> str:
    """
    Format the SQL query based on the table's retention policy
    """
    if drop_after is None:
        raise ValueError("drop_after is required to add a retention policy")
    drop_after_interval, drop_after_interval_type = cleaners.clean_interval(drop_after)
    sql_template = RETENTION_POLICY_INTERVAL_TYPE_SQL_TEMPLATE_MAPPING.get(
        drop_after_interval_type, None
    )
    if sql_template is None:
        raise ValueError("Invalid interval type")

    params = {
        "hypertable_name": table_name,
        "drop_after": drop_after_interval,
    }
    query = sqlalchemy.text(sql_template).bindparams(**params)
    return str(query.compile(compile_kwargs={"literal_binds": True}))


GET_RETENTION_POLICY_SQL = """
SELECT * FROM timescaledb_information.jobs j
  JOIN timescaledb_information.job_stats js
    ON j.job_id = js.job_id
  WHERE j.proc_name = 'policy_retention'
    AND j.hypertable_name = :hypertable_name;
"""

LIST_RETENTION_POLICIES_SQL = """
SELECT DISTINCT hypertable_name
  FROM timescaledb_information.jobs
  WHERE proc_name = 'policy_retention';
"""


def get_retention_policy_sql_query(
    table_name: str,
) -> str:
    query = sqlalchemy.text(GET_RETENTION_POLICY_SQL).bindparams(
        hypertable_name=table_name,
    )
    return str(query.compile(compile_kwargs={"literal_binds": True}))


DROP_RETENTION_POLICY_SQL = """
SELECT remove_retention_policy(:hypertable_name, if_exists => true);
"""


def get_drop_retention_policy_sql_query(
    table_name: str,
) -> str:
    query = sqlalchemy.text(DROP_RETENTION_POLICY_SQL).bindparams(
        hypertable_name=table_name,
    )
    return str(query.compile(compile_kwargs={"literal_binds": True}))


def list_retention_policies_sql_query() -> str:
    query = sqlalchemy.text(LIST_RETENTION_POLICIES_SQL)
    return str(query.compile(compile_kwargs={"literal_binds": True}))
