from typing import Type

from sqlmodel import SQLModel


def extract_model_hypertable_params(
    model: Type[SQLModel],
) -> dict:
    """
    Format the SQL query based on the model's retention policy

    Returns:
        str: The formatted SQL query ready for execution
    """
    time_column = getattr(model, "__time_column__", None)
    chunk_time_interval = getattr(model, "__chunk_time_interval__", None)
    table_name = getattr(model, "__tablename__", None)
    if_not_exists = getattr(model, "__if_not_exists__", False)
    migrate_data = getattr(model, "__migrate_data__", False)
    return {
        "model": model,
        "table_name": table_name,
        "time_column": time_column,
        "chunk_time_interval": chunk_time_interval,
        "if_not_exists": if_not_exists,
        "migrate_data": migrate_data,
    }
