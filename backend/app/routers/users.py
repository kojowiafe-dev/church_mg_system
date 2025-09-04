from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import Optional
# import models, schemas, hashing, database
from schemas import UserPublic, UserUpdate
from database import SessionDep
from models.model import User
from hashing import get_password_hash
from datetime import datetime

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[UserPublic])
def get_users(session: SessionDep):
    users = session.exec(select(User)).all()
    return users


@router.get("/{id}", response_model=UserPublic)
def get_user_by_id(id: int, session: SessionDep):
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{id}", response_model=UserUpdate)
def update_user(
    id: int,
    member_update: UserUpdate,
    session: SessionDep
):
    db_user = session.get(User, id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in member_update.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    
    db_user.updated_at = datetime.today()
    session.commit()
    session.refresh(db_user)
    return db_user

# @router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_user(id: int, session:SessionDep):
#     user = session.get(User, id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     session.delete(user)
#     session.commit()
