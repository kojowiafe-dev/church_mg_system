from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime, date

from database import get_session, SessionDep
from models import Member, Family, FamilyMember, Attendance
from schemas import (
    MemberCreate, Member as MemberSchema,
    FamilyCreate, Family as FamilySchema,
    FamilyMemberCreate, FamilyMember as FamilyMemberSchema,
    AttendanceCreate, Attendance as AttendanceSchema
)
from dependencies import get_current_user

router = APIRouter(
    prefix="/members",
    tags=["members"]
)

# Member endpoints
@router.post("/", response_model=MemberSchema)
def create_member(
    member: MemberCreate,
    session: SessionDep,
    # current_user: dict = Depends(get_current_user)
):
    db_member = Member(**member.dict())
    session.add(db_member)
    session.commit()
    session.refresh(db_member)
    return db_member

@router.get("/", response_model=List[MemberSchema])
def get_members(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    # current_user: dict = Depends(get_current_user)
):
    members = session.exec(select(Member).offset(skip).limit(limit)).all()
    return members

@router.get("/{member_id}", response_model=MemberSchema)
def get_member(
    member_id: int,
    session: SessionDep,
    # current_user: dict = Depends(get_current_user)
):
    member = session.get(Member, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

@router.put("/{member_id}", response_model=MemberSchema)
def update_member(
    member_id: int,
    member_update: MemberCreate,
    session: SessionDep,
    # current_user: dict = Depends(get_current_user)
):
    db_member = session.get(Member, member_id)
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    for key, value in member_update.dict().items():
        setattr(db_member, key, value)
    
    db_member.updated_at = date.today()
    session.add(db_member)
    session.commit()
    session.refresh(db_member)
    return db_member

@router.delete("/{member_id}")
def delete_member(
    member_id: int,
    session: SessionDep,
    # current_user: dict = Depends(get_current_user)
):
    member = session.get(Member, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    session.delete(member)
    session.commit()
    return {"message": "Member deleted successfully"}

# Family endpoints
@router.post("/families/", response_model=FamilySchema)
def create_family(
    family: FamilyCreate,
    session: SessionDep,
    # current_user: dict = Depends(get_current_user)
):
    db_family = Family(**family.dict())
    session.add(db_family)
    session.commit()
    session.refresh(db_family)
    return db_family

@router.get("/families/", response_model=List[FamilySchema])
def get_families(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100
    # current_user: dict = Depends(get_current_user)
):
    families = session.exec(select(Family).offset(skip).limit(limit)).all()
    return families

@router.post("/families/{family_id}/members", response_model=FamilyMemberSchema)
def add_family_member(
    family_id: int,
    family_member: FamilyMemberCreate,
    session: SessionDep,
    # current_user: dict = Depends(get_current_user)
):
    # Verify family exists
    family = session.get(Family, family_id)
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    
    # Verify member exists
    member = session.get(Member, family_member.member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    db_family_member = FamilyMember(**family_member.dict())
    session.add(db_family_member)
    session.commit()
    session.refresh(db_family_member)
    return db_family_member

# Attendance endpoints
@router.post("/attendance", response_model=AttendanceSchema)
def create_attendance(
    attendance: AttendanceCreate,
    session: SessionDep,
    # current_user: dict = Depends(get_current_user)
):
    # Verify member exists
    member = session.get(Member, attendance.member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    db_attendance = Attendance(**attendance.dict())
    session.add(db_attendance)
    session.commit()
    session.refresh(db_attendance)
    return db_attendance

@router.get("/attendance/{member_id}", response_model=List[AttendanceSchema])
def get_member_attendance(
    session: SessionDep,
    member_id: int,
    skip: int = 0,
    limit: int = 100
    # current_user: dict = Depends(get_current_user)
):
    # Verify member exists
    member = session.get(Member, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    attendance = session.exec(
        select(Attendance)
        .where(Attendance.member_id == member_id)
        .offset(skip)
        .limit(limit)
    ).all()
    return attendance 