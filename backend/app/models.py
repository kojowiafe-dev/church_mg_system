from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, date
from typing import Optional, List
from enum import Enum


class RoleEnum(str, Enum):
    admin = "admin"
    pastor = "pastor"
    member = "member"

class MaritalStatusEnum(str, Enum):
    single = "single"
    married = "married"
    divorced = "divorced"
    widowed = "widowed"

class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"

class User(SQLModel, table=True):
    __tablename__ = 'users'

    id: int = Field(default=None, primary_key=True, index=True)
    # member_id: int = Field(foreign_key="members.id", nullable=False)
    username: str = Field(unique=True, index=True)
    email: Optional[str] = Field(default=None, unique=True, index=True)
    password: str
    phone: str = Field(index=True)
    house_address: str
    is_active: bool = Field(default=True)
    role: str = Field(default="member", index=True)
    profile_image: Optional[str] = None
    join_date: date = Field(default_factory=date.today)
    verification_code: Optional[str] = None
    verification_code_expires: Optional[date] = None
    created_at: date = Field(default_factory=date.today)

    # Relationships
    # family: List['Family'] = Relationship(back_populates="head")
    # attendance_records: List['Attendance'] = Relationship(back_populates="member") 

class Member(SQLModel, table=True):
    __tablename__ = 'members'

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    first_name: str
    last_name: str
    date_of_birth: date
    gender: GenderEnum
    marital_status: MaritalStatusEnum
    occupation: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    baptism_date: Optional[date] = None
    membership_date: Optional[date] = None
    is_active: bool = Field(default=True)
    notes: Optional[str] = None
    created_at: date = Field(default_factory=date.today)
    updated_at: date = Field(default_factory=date.today)

class Family(SQLModel, table=True):
    __tablename__ = 'families'

    id: Optional[int] = Field(default=None, primary_key=True)
    family_name: str
    head_of_family_id: int = Field(foreign_key="members.id")
    address: str
    created_at: date = Field(default_factory=date.today)
    updated_at: date = Field(default_factory=date.today)

class FamilyMember(SQLModel, table=True):
    __tablename__ = 'family_members'

    id: Optional[int] = Field(default=None, primary_key=True)
    family_id: int = Field(foreign_key="families.id")
    member_id: int = Field(foreign_key="members.id")
    relationship: str  # e.g., "spouse", "child", "parent"
    created_at: date = Field(default_factory=date.today)

class Attendance(SQLModel, table=True):
    __tablename__ = 'attendance'

    id: Optional[int] = Field(default=None, primary_key=True)
    member_id: int = Field(foreign_key="members.id")
    event_id: int = Field(foreign_key="events.id")
    date: date
    status: str  # "present", "absent", "excused"
    notes: Optional[str] = None
    created_at: date = Field(default_factory=date.today)

class Event(SQLModel, table=True):
    __tablename__ = 'events'
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    preacher: str
    description: str
    date: date

class Sermon(SQLModel, table=True):
    __tablename__ = 'sermons'
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    preacher: str
    description: Optional[str]
    video_url: Optional[str]
    date: date
