from datetime import datetime, timezone


def get_utc_now():
    """Get the current UTC time"""
    return datetime.now(timezone.utc).replace(tzinfo=timezone.utc)
