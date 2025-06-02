from fastapi import APIRouter, status, HTTPException
import schemas, database, models
from sqlmodel import select

router = APIRouter(
    tags=['Sermon'],
    prefix='/sermon'    
)


@router.get('/', response_model=list[schemas.SermonBase], status_code=status.HTTP_200_OK)
def get_sermons(session: database.SessionDep):
    sermons = session.exec(select(models.Sermon)).all()
    return sermons


@router.get('/{id}', response_model=schemas.SermonBase, status_code=status.HTTP_200_OK)
def get_sermon(id: int, session: database.SessionDep):
    sermon = session.get(models.Sermon, id)
    if not sermon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sermon not found")
    return sermon


@router.post('/', response_model=schemas.SermonBase, status_code=status.HTTP_201_CREATED)
def create_sermon(request: schemas.SermonBase, session: database.SessionDep):
    existing_sermon = session.exec(
        select(models.Sermon).where(models.Sermon.title == request.title)
    ).first()
    if existing_sermon:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sermon already available")
    
    new_sermon = models.Sermon.model_validate(request)
    session.add(new_sermon)
    session.commit()
    session.refresh(new_sermon)
    return new_sermon


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_sermon(id: int, session: database.SessionDep):
    sermon = session.get(models.Sermon, id)
    if not sermon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sermon not found")
    session.delete(sermon)
    session.commit()
    return None


@router.patch('/{id}', response_model=schemas.SermonBase, status_code=status.HTTP_200_OK)
def update_sermon(id: int, request: schemas.SermonUpdate, session: database.SessionDep):
    sermon = session.get(models.Sermon, id)
    if not sermon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sermon not found")

    sermon_data = request.model_dump(exclude_unset=True)
    sermon.sqlmodel_update(sermon_data)

    session.add(sermon)
    session.commit()
    session.refresh(sermon)
    return sermon
