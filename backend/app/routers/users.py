from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import Optional
# import models, schemas, hashing, database
from schemas import UserRegister, UserPublic
from database import SessionDep
from models import User
from hashing import get_password_hash

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[UserPublic])
def get_users(session: SessionDep):
    users = session.exec(select(User)).all()
    return users

# @router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
# def register_user(user_data: UserRegister, session: SessionDep):
#     existing_user = session.exec(select(User).where(User.username == user_data.username)).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Username already exists")
    
#     hashed_pw = get_password_hash(user_data.password)
#     user_dict = user_data.dict()
#     user_dict["password"] = hashed_pw
#     user = User(**user_dict)
#     session.add(user)
#     session.commit()
#     session.refresh(user)
#     return user

@router.get("/{id}", response_model=UserPublic)
def get_user_by_id(id: int, session: SessionDep):
    user = session.get('models'.User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(id: int, session:SessionDep):
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
