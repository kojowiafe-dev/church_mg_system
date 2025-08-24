class InvalidTimeColumn(Exception):
    """
    Exception raised when the time column is invalid
    """

    pass


class InvalidTimeColumnType(Exception):
    """
    Exception raised when the time column is of an invalid type
    """

    pass


class InvalidChunkTimeInterval(Exception):
    """
    Exception raised when the chunk time interval is invalid
    """

    pass


class TimeIntervalNotSet(Exception):
    """
    Exception raised when the time interval is not set
    """

    pass


class InvalidSegmentByField(Exception):
    """
    Exception raised when the segment by field is invalid
    """

    pass


class InvalidOrderByField(Exception):
    """
    Exception raised when the order by field is invalid
    """

    pass


class InvalidCompressionFields(Exception):
    """
    Exception raised when the compression fields are invalid
    """
