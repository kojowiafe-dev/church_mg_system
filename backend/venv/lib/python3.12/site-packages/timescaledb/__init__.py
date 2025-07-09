from __future__ import annotations

__version__ = "0.0.4"

from . import metadata
from .activator import activate_timescaledb_extension
from .compression import (
    add_compression_policy,
    enable_table_compression,
    sync_compression_policies,
)
from .engine import create_engine
from .hypertables import (
    create_hypertable,
    list_hypertables,
    sync_all_hypertables,
)
from .models import TimescaleModel
from .queries import time_bucket_gapfill_query, time_bucket_query
from .retention import add_retention_policy, sync_retention_policies

__all__ = [
    "metadata",
    "TimescaleModel",
    "activate_timescaledb_extension",
    "sync_all_hypertables",
    "create_hypertable",
    "list_hypertables",
    "create_engine",
    "time_bucket_query",
    "time_bucket_gapfill_query",
    "defaults",
    "get_defaults",
    "add_retention_policy",
    "sync_retention_policies",
    "add_compression_policy",
    "enable_table_compression",
    "sync_compression_policies",
]
