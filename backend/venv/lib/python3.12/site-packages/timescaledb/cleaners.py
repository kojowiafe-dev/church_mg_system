from datetime import timedelta


def clean_interval(interval: str | int | timedelta) -> tuple[str | int, bool]:
    """
    Given an interval, return the interval type and a valid internal value

    Args:
        interval: The interval to extract the type and value from

    Returns:
        If valid, a tuple containing the interval type and a valid internal value
        If invalid, the original interval and the string "INVALID"
    """
    if isinstance(interval, timedelta):
        # Convert to microseconds
        cleaned_interval = int(interval.total_seconds())
        return cleaned_interval, "INTEGER"
    elif isinstance(interval, int):
        # Microseconds
        cleaned_interval = interval
        return cleaned_interval, "INTEGER"
    elif isinstance(interval, str):
        # Such as INTERVAL 1 day
        # or INTERVAL '2 weeks'
        # pop the term "INTERVAL"
        cleaned_interval = interval.replace("INTERVAL", "").strip()
        # remove any extra quotes
        cleaned_interval = cleaned_interval.replace("'", "").replace('"', "")
        return cleaned_interval, "INTERVAL"
    else:
        return interval, "INVALID"
