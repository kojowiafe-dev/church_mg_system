from fastapi import APIRouter, status, HTTPException
import schemas, models.model as model, database
from sqlmodel import select


router = APIRouter(
    tags=['Event'],
    prefix='/event'
)

# --------------  EVENT DATABASE MODEL ---------------- #


@router.get('/', response_model=list[schemas.EventBase], status_code=status.HTTP_200_OK)
def get_events(session: database.SessionDep):
    events = session.exec(select(model.Event)).all()
    return events


@router.get('/{event_id}', response_model=schemas.EventBase, status_code=status.HTTP_200_OK)
def get_event(event_id: int, session: database.SessionDep):
    event = session.get(model.Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event


@router.post('/', response_model=schemas.EventBase, status_code=status.HTTP_201_CREATED)
def create_event(request: schemas.EventBase, session: database.SessionDep):
    existing_event = session.exec(select(model.Event).where(model.Event.name == request.name)).first()
    if existing_event:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Event already available")
    
    new_event = model.Event.model_validate(request)
    session.add(new_event)
    session.commit()
    session.refresh(new_event)
    return new_event


@router.delete('/{event_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, session: database.SessionDep):
    event = session.get(model.Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Event not found')
    session.delete(event)
    session.commit()
    return None


@router.patch('/{event_id}', response_model=schemas.EventBase, status_code=status.HTTP_200_OK)
def update_event(event_id: int, request: schemas.EventUpdate, session: database.SessionDep):
    event = session.get(model.Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    event_data = request.model_dump(exclude_unset=True)
    event.sqlmodel_update(event_data)
    session.add(event)
    session.commit()
    session.refresh(event)
    return event