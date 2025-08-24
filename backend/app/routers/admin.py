# from fastapi import APIRouter, status, HTTPException, Depends
# import models, database, schemas, hashing, oauth2
# from sqlmodel import select


# router = APIRouter(
#     tags=["Admin"],
#     prefix="/admin"
# )

# # -------------------  MEMBER DATABASE MODEL -------------------- #

# # get admin
# @router.get('/', response_model=list[schemas.AdminPublic], status_code=status.HTTP_200_OK)
# def get_users(session: database.SessionDep):
#     admins = session.exec(select(models.Admin)).all()
#     return admins


# # create admin 
# @router.post('/register', response_model=schemas.AdminPublic, status_code=status.HTTP_201_CREATED)
# def create_admin(request: schemas.AdminRegister, session: database.SessionDep):
#     existing_username = session.exec(select(models.Admin).where(models.Admin.username == request.username)).first()
#     if existing_username:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    
#     existing_email = session.exec(select(models.Admin).where(models.Admin.email == request.email)).first()
#     if existing_email:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
#     hashed_password = hashing.get_password_hash(request.password)
#     admin_data = request.dict()
#     admin_data['password'] = hashed_password
#     admin = models.Admin(**admin_data)
#     session.add(admin)
#     session.commit()
#     session.refresh(admin)
#     return admin



# # get admin by id
# @router.get('/{id}', response_model=schemas.AdminPublic, status_code=status.HTTP_200_OK)
# def get_admin(id: int, session: database.SessionDep):
#     admin = session.get(models.Admin, id)
#     if not admin:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
#     return admin


# # delete an admin
# @router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
# def delete_admin(id: int, session: database.SessionDep):
#     admin = session.get(models.Admin, id)
#     if not admin:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
#     session.delete(admin)
#     session.commit()
#     return None


# # @router.get('/me', response_model=schemas.getAdmin, status_code=status.HTTP_200_OK)
# # def read_users_me(current_user: schemas.getAdmin = Depends(oauth2.get_current_user)):
# #     return {"username": current_user.username}


# # @router.get('/me', response_model=schemas.getAdmin)
# # def read_users_me(token: str = Depends(oauth2.oauth2_scheme)):
# #     return {"token": token}