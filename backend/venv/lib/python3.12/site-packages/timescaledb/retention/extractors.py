from typing import Type

from sqlmodel import SQLModel


def extract_model_retention_policy_params(
    model: Type[SQLModel],
) -> str:
    """
    Format the SQL query based on the model's retention policy

    Returns:
        str: The formatted SQL query ready for execution
    """
    table_name = model.__tablename__
    drop_after = getattr(model, "__drop_after__", None)
    return {
        "table_name": table_name,
        "drop_after": drop_after,
    }
