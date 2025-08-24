from typing import Type

import sqlalchemy
from sqlmodel import Session, SQLModel

from timescaledb.compression import extractors, sql


def enable_table_compression(
    session: Session,
    model: Type[SQLModel] = None,
    table_name: str = None,
    commit: bool = True,
    compress_orderby=None,
    compress_segmentby=None,
) -> None:
    """
    Enable compression for a hypertable

    Args:
        session: SQLAlchemy session
        model: SQLModel class to enable compression for
        table_name: Name of the table to enable compression for (alternative to model)
        commit: Whether to commit the transaction
        compress_orderby: Column(s) to order by for compression
        compress_segmentby: Column(s) to segment by for compression

    Note:
        This function only enables compression. To add an automatic compression policy,
        use the add_compression_policy function after enabling compression.
    """
    if model is None and table_name is None:
        raise ValueError("model or table_name is required to enable compression")

    table_name_to_use = table_name

    if model is not None:
        compression_params = extractors.extract_model_compression_params(model)
        if compression_params is None:
            return

        enable_compression = compression_params.get("compress_enabled", False)
        if not enable_compression:
            return

        table_name_to_use = model.__tablename__

        # Use model parameters if not explicitly provided
        if compress_orderby is None:
            compress_orderby = compression_params.get("compress_orderby", None)
        if compress_segmentby is None:
            compress_segmentby = compression_params.get("compress_segmentby", None)

    # Enable compression on the table
    with_orderby = compress_orderby is not None
    with_segmentby = compress_segmentby is not None
    sql_template = sql.format_alter_compression_policy_sql(
        table_name_to_use,
        with_orderby=with_orderby,
        with_segmentby=with_segmentby,
    )

    params = {}
    if with_orderby:
        params["compress_orderby"] = compress_orderby
    if with_segmentby:
        params["compress_segmentby"] = compress_segmentby
    query = sqlalchemy.text(sql_template).bindparams(**params)
    compiled_query = str(query.compile(compile_kwargs={"literal_binds": True}))
    session.execute(sqlalchemy.text(compiled_query))

    if commit:
        session.commit()
