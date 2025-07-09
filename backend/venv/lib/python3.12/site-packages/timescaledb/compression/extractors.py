from typing import Type

from sqlmodel import SQLModel

from timescaledb.compression import validators


def extract_model_compression_policy_params(
    model: Type[SQLModel],
) -> str:
    """
    Format the SQL query based on the model's compression policy
    """
    table_name = model.__tablename__
    compress_enabled = getattr(model, "__enable_compression__", False)
    compress_enabled_bool = str(compress_enabled).lower() == "true"
    compress_after = getattr(model, "__compress_after__", None)
    compress_created_before = getattr(model, "__compress_created_before__", None)
    return {
        "table_name": table_name,
        "compress_enabled": compress_enabled_bool,
        "compress_after": compress_after,
        "compress_created_before": compress_created_before,
    }


def extract_model_compression_params(
    model: Type[SQLModel],
) -> str:
    """
    Format the SQL query based on the model's compression policy
    """

    enable_compression = getattr(model, "__enable_compression__", False)
    enable_compression_bool = str(enable_compression).lower() == "true"
    if not enable_compression_bool:
        return
    compress_orderby = getattr(model, "__compress_orderby__", None)
    valid_orderby = validators.validate_compress_orderby_field(model, compress_orderby)
    compress_segmentby = getattr(model, "__compress_segmentby__", None)
    valid_segmentby = validators.validate_compress_segmentby_field(
        model, compress_segmentby
    )
    validators.validate_unique_segmentby_and_orderby_fields(
        model, compress_segmentby, compress_orderby
    )
    params = {
        "compress_enabled": enable_compression_bool,
    }
    has_orderby = valid_orderby and compress_orderby is not None
    has_segmentby = valid_segmentby and compress_segmentby is not None
    if has_orderby:
        params["compress_orderby"] = compress_orderby
    if has_segmentby:
        params["compress_segmentby"] = compress_segmentby
    return params
