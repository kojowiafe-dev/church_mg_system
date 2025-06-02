# from fastapi import APIRouter, status, HTTPException
# from sqlmodel import select
# import models, database, schemas, hashing


# router = APIRouter(
#     tags=["Members"],
#     prefix='/member'
# )

# # -------------------  MEMBER DATABASE MODEL -------------------- #

# # get members
# @router.get('/', response_model=list[schemas.MemberPublic], status_code=status.HTTP_200_OK)
# def get_members(session: database.SessionDep):
#     members = session.exec(select(models.Member)).all()
#     return members


# # create member
# @router.post('/register', response_model=schemas.MemberPublic, status_code=status.HTTP_201_CREATED)
# def create_member(request: schemas.MemberRegister, session: database.SessionDep):
#     existing_member = session.exec(select(models.Member).where(models.Member.name == request.name)).first()
#     if existing_member:
#         raise HTTPException(status_code=400, detail="Name already registered")
    
#     hashed_password = hashing.get_password_hash(request.password)
#     member_data = request.dict()
#     member_data['password'] = hashed_password
#     member = models.Member(**member_data)
#     session.add(member)
#     session.commit()
#     session.refresh(member)
#     return member


# # get member by id
# @router.get('/{id}', response_model=schemas.MemberPublic, status_code=status.HTTP_200_OK)
# def get_member(id: int, session: database.SessionDep):
#     member = session.get(models.Member, id)
#     if not member:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
#     return member


# # delete a member
# @router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
# def delete_member(id: int, session: database.SessionDep):
#     member = session.get(models.Member, id)
#     if not member:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
#     session.delete(member)
#     session.commit()
#     return member
    