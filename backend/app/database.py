from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlmodel import SQLModel, Session
from typing import Annotated
from fastapi import Depends
# import os


sqlite_file_name = 'church.db'
SQLALCHEMY_DATABASE_URL = f"sqlite:///{sqlite_file_name}"

# Remove existing database file if it exists
# if os.path.exists(sqlite_file_name):
#     os.remove(sqlite_file_name)

# setup the engine for the database
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True, connect_args={"check_same_thread": False})

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

def create_db_and_tables():
    # SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

# Create tables on startup
create_db_and_tables()

@event.listens_for(Engine, "connect")
def enable_sqlite_foreign_keys(dpapi_connection, connection_record):
    cursor = dpapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()