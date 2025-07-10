from sqlmodel import SQLModel, Field
from datetime import datetime, date
from typing import Optional, List
from pydantic import EmailStr
from models.model import GenderEnum, MaritalStatusEnum

# -------------------------- ADMIN DATABASE MODEL -----------------#

class UserBase(SQLModel):
    username: str
    email: Optional[str] = None
    phone: str
    house_address: str
    role: str

class UserRegister(UserBase):
    password: str

class UserLogin(SQLModel):
    username: str
    password: str
    role: str

class UserPublic(UserBase):
    id: int
    member_id: int
    profile_image: Optional[str] = None
    join_date: datetime
    is_active: bool = True

class UserUpdate(SQLModel):
    username: Optional[str]
    email: Optional[str]
    password: Optional[str]
    phone: Optional[str]
    house_address: Optional[str]
    updated_at: Optional[datetime]
    profile_image: Optional[str]
    
    
class MemberBase(SQLModel):
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    gender: GenderEnum
    marital_status: MaritalStatusEnum
    occupation: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    baptism_date: Optional[date] = None
    membership_date: Optional[date] = None
    notes: Optional[str] = None

class MemberCreate(MemberBase):
    pass
    # user_id: int

class Member(MemberBase):
    id: int
    # user_id: int
    is_active: bool
    created_at: date
    updated_at: date


class EventBase(SQLModel):
    name: str
    preacher: str
    description: str
    date: datetime
    
    
class Event(EventBase):
    id: int


class EventPublic(Event):
    pass

class EventCreate(EventBase):
    pass

class EventUpdate(SQLModel):
    name: Optional[str] = None
    preacher: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    
    
class SermonBase(SQLModel):
    title: str
    preacher: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    date: datetime

class SermonCreate(SermonBase):
    pass

class Sermon(SermonBase):
    id: int
    
class SermonUpdate(SQLModel):
    title: Optional[str] = None
    preacher: Optional[str] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    video_url: Optional[str] = None


class FamilyBase(SQLModel):
    family_name: str
    head_of_family_id: int
    address: str

class FamilyCreate(FamilyBase):
    pass

class Family(FamilyBase):
    id: int
    created_at: datetime
    updated_at: datetime

class FamilyMemberBase(SQLModel):
    family_id: int
    member_id: int
    relationship: str

class FamilyMemberCreate(FamilyMemberBase):
    pass

class FamilyMember(FamilyMemberBase):
    id: int
    created_at: datetime

class AttendanceBase(SQLModel):
    member_id: int
    event_id: int
    date: datetime
    status: str
    notes: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    created_at: datetime



# Combined registration schema
class CombinedRegistration(SQLModel):
    user: UserRegister
    member: MemberBase





# ---------------------------------------------------------------#


from fastapi import Form
from typing import Annotated

class OAuth2LoginFormWithRole:
    def __init__(
        self,
        username: Annotated[str, Form()],
        password: Annotated[str, Form()],
        role: Annotated[str, Form()],
    ):
        self.username = username
        self.password = password
        self.role = role


class TokenData(SQLModel):
    username: Optional[str] = None


class Token(SQLModel):
    access_token: str
    token_type: str
    role: str

class ForgotPasswordRequest(SQLModel):
    email: EmailStr


class ResetPasswordSchema(SQLModel):
    token: str
    new_password: str


class VerifyResetCodeRequest(SQLModel):
    email: EmailStr
    code: str


class ResetPasswordRequest(SQLModel):
    email: EmailStr
    code: str
    new_password: str