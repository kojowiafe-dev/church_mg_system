from typing import Any, List, Optional, Type

import sqlalchemy
from pydantic import BaseModel, ConfigDict, Field, model_validator
from sqlmodel import SQLModel

from timescaledb import cleaners
from timescaledb.hypertables import sql_statements as sql
from timescaledb.hypertables import validators

HYPERTABLE_INTERVAL_TYPE_SQL = {
    "INTERVAL": sql.CREATE_HYPERTABLE_SQL_VIA_INTERVAL,
    "INTEGER": sql.CREATE_HYPERTABLE_SQL_VIA_INTEGER,
}


class HypertableCreateSchema(BaseModel):
    """Parameters for creating a TimescaleDB hypertable."""

    table_name: str
    time_column: str
    chunk_time_interval: Any = Field(default=None)
    interval_type: str = Field(default="INVALID")
    if_not_exists: bool = Field(default=False)
    migrate_data: bool = Field(default=False)

    model: Optional[Type[SQLModel]] = Field(default=None)

    model_config = ConfigDict(frozen=False)

    @model_validator(mode="after")
    def validate_hypertable_params(self) -> "HypertableCreateSchema":
        """Validate the hypertable parameters using existing validators."""
        if self.model is not None:
            validators.validate_time_column(self.model, self.time_column)
            validators.validate_chunk_time_interval(
                self.model, self.time_column, self.chunk_time_interval
            )
        chunk_time_interval, chunk_time_interval_type = cleaners.clean_interval(
            self.chunk_time_interval
        )
        self.chunk_time_interval = chunk_time_interval
        self.interval_type = chunk_time_interval_type
        return self

    def to_sql_params(self) -> dict:
        """Convert the hypertable parameters to a dictionary of SQL parameters."""
        return self.model_dump(exclude=["model", "interval_type"])

    def to_sql_query(self) -> str:
        """Convert the hypertable parameters to a SQL query."""
        sql_template = HYPERTABLE_INTERVAL_TYPE_SQL.get(self.interval_type, None)
        if sql_template is None:
            raise ValueError("Invalid interval type")
        sql_params = self.to_sql_params()
        query = sqlalchemy.text(sql_template).bindparams(**sql_params)
        compiled_query = str(query.compile(compile_kwargs={"literal_binds": True}))
        return compiled_query


class HyperTableSchema(BaseModel):
    """Base class for hypertables"""

    hypertable_schema: str
    hypertable_name: str
    owner: str
    num_dimensions: int
    num_chunks: int
    compression_enabled: bool
    tablespaces: Optional[List[str]] = None
