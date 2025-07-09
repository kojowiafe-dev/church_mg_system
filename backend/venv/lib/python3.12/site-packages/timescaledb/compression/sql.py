from datetime import timedelta

import sqlalchemy
from sqlalchemy.sql import quoted_name

from timescaledb import cleaners

COMPRESS_AFTER_SQL_VIA_INTERVAL = """
SELECT add_compression_policy(:hypertable_name, compress_after => INTERVAL :compress_after);
"""

COMPRESS_AFTER_SQL_VIA_INTEGER = """
SELECT add_compression_policy(:hypertable_name, compress_after => INTEGER :compress_after);
"""

COMPRESS_CREATED_BEFORE_SQL_VIA_INTERVAL = """
SELECT add_compression_policy(:hypertable_name, compress_created_before => INTERVAL :compress_created_before);
"""


COMPRESSION_POLICY_SQL_TEMPLATE_MAPPING = {
    "AFTER_INTEGER": COMPRESS_AFTER_SQL_VIA_INTEGER,
    "AFTER_INTERVAL": COMPRESS_AFTER_SQL_VIA_INTERVAL,
    "BEFORE_INTERVAL": COMPRESS_CREATED_BEFORE_SQL_VIA_INTERVAL,
}


def format_compression_policy_sql_query(
    table_name: str,
    compress_after: str | int | timedelta | None = None,
    compress_created_before: timedelta | None = None,
) -> str:
    """
    Format the SQL query based on the table's compression policy
    """
    if compress_after is not None:
        after_interval, after_type = cleaners.clean_interval(compress_after)
        mapping_key = "AFTER_INTERVAL" if after_type == "INTERVAL" else "AFTER_INTEGER"
        sql_template = COMPRESSION_POLICY_SQL_TEMPLATE_MAPPING.get(mapping_key, None)
        if sql_template is None:
            raise ValueError("Invalid interval type")

        params = {
            "hypertable_name": table_name,
            "compress_after": after_interval,
        }
        query = sqlalchemy.text(sql_template).bindparams(**params)
        return str(query.compile(compile_kwargs={"literal_binds": True}))
    if compress_created_before is not None:
        before_interval, before_type = cleaners.clean_interval(compress_created_before)
        if before_type != "INTERVAL":
            raise ValueError(
                "You must use a timedelta for compress_created_before such as `compress_created_before=timedelta(days=7)`"
            )
        mapping_key = "BEFORE_INTERVAL"
        sql_template = COMPRESSION_POLICY_SQL_TEMPLATE_MAPPING.get(mapping_key, None)
        if sql_template is None:
            raise ValueError("Invalid interval type")
        params = {
            "hypertable_name": table_name,
            "compress_created_before": before_interval,
        }
        query = sqlalchemy.text(sql_template).bindparams(**params)
        return str(query.compile(compile_kwargs={"literal_binds": True}))


def format_alter_compression_policy_sql(
    table_name: str, with_orderby: bool = True, with_segmentby: bool = True
):
    safe_table_name = quoted_name(table_name, True)

    clauses = []
    if with_orderby:
        clauses.append("timescaledb.compress_orderby = :compress_orderby")
    if with_segmentby:
        clauses.append("timescaledb.compress_segmentby = :compress_segmentby")

    compress_clause = "timescaledb.compress"
    if len(clauses) > 0:
        compress_clause = "timescaledb.compress,"
    # Create the SQL with the safely quoted table name
    sql = f"""
    ALTER TABLE {safe_table_name} SET (
        {compress_clause}
        {", ".join(clauses)}
    );
    """
    return sql
