# from fastapi import APIRouter, status, HTTPException
# import database, schemas, hashing, models
# from sqlmodel import select


# router = APIRouter(
#     tags=["Pastor"],
#     prefix="/pastor"
# )

# # -------------------  PASTOR DATABASE MODEL -------------------- #

# # get pastors
# @router.get('/', response_model=list[schemas.PastorPublic], status_code=status.HTTP_200_OK)
# def get_pastors(session: database.SessionDep):
#     pastors = session.exec(select(models.Pastor)).all()
#     return pastors


# # create pastor
# @router.post('/', response_model=schemas.PastorPublic, status_code=status.HTTP_201_CREATED)
# def create_pastor(request: schemas.PastorRegister, session: database.SessionDep):
#     existing_pastor = session.exec(select(models.Pastor).where(models.Pastor.name == request.name)).first()
#     if existing_pastor:
#         raise HTTPException(status_code=400, detail="Name already registered")
    
#     hashed_password = hashing.get_password_hash(request.password)
#     pastor_data = request.dict()
#     pastor_data['password'] = hashed_password
#     pastor = models.Pastor(**pastor_data)
#     session.add(pastor)
#     session.commit()
#     session.refresh(pastor)
#     return pastor


# # get pastor by id
# @router.get('/{id}', response_model=schemas.PastorPublic, status_code=status.HTTP_200_OK)
# def get_pastor(id: int, session: database.SessionDep):
#     pastor = session.get(models.Pastor, id)
#     if not pastor:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pastor not found")
#     return pastor


# # delete an pastor
# @router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
# def delete_pastor(id: int, session: database.SessionDep):
#     pastor = session.get(models.Pastor, id)
#     if not pastor:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pastor not found")
#     session.delete(pastor)
#     session.commit()
#     return None