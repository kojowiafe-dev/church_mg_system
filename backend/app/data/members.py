from fastapi import APIRouter, Depends
from sqlmodel import Session, select
import database, models  # adjust import paths as needed

router = APIRouter(
    tags=["MembersData"],
    prefix="/count/members"
)

@router.get("/")
def get_member_count(session: database.SessionDep):    
    count = session.exec(select(models.User)).all()
    return {"total_members": len(count)}
