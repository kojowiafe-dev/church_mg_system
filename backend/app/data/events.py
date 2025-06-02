from fastapi import APIRouter, Depends
from sqlmodel import Session, select
import database, models  # adjust import paths as needed
from datetime import date

router = APIRouter(
    tags=["EventsData"],
    prefix="/count/events"
)

@router.get("/")
def get_all_event_count(session: database.SessionDep):
    count = session.exec(select(models.Event)).all()
    return {"total_events": len(count)}

@router.get("/upcoming")
def get_upcoming_events(session: database.SessionDep):
    upcoming_events = []
    all_events = session.exec(select(models.Event)).all()
    for events in all_events:
        if events.date >= date.today():
            upcoming_events.append(events)
        
    return  {"total_upcoming_events": len(upcoming_events)}

