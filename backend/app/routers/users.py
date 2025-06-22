from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import Optional
# import models, schemas, hashing, database
from schemas import UserPublic, UserUpdate
from database import SessionDep
from models import User
from hashing import get_password_hash
from datetime import date

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[UserPublic])
def get_users(session: SessionDep):
    users = session.exec(select(User)).all()
    return users


@router.get("/{id}", response_model=UserPublic)
def get_user_by_id(id: int, session: SessionDep):
    user = session.get('models'.User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{id}", response_model=UserUpdate)
def update_user(
    user_id: int,
    member_update: UserUpdate,
    session: SessionDep,
    # current_user: dict = Depends(get_current_user)
):
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in member_update.dict().items():
        setattr(db_user, key, value)
    
    db_user.updated_at = date.today()
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(id: int, session:SessionDep):
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
