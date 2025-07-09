import sqlalchemy
from sqlmodel import Session


def activate_timescaledb_extension(session: Session) -> None:
    session.execute(sqlalchemy.text("CREATE EXTENSION IF NOT EXISTS timescaledb;"))
    session.commit()
