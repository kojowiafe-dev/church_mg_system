# from datetime import datetime
# from typing import Optional
# from sqlmodel import SQLModel, Field

# class User(SQLModel, table=True):
#     __tablename__ = "users"

#     id: Optional[int] = Field(default=None, primary_key=True)
#     username: str = Field(unique=True, index=True)
#     email: str = Field(unique=True, index=True)
#     password: str
#     phone: Optional[str] = None
#     house_address: Optional[str] = None
#     is_active: bool = Field(default=True)
#     role: str = Field(default="member")
#     profile_image: Optional[str] = None
#     join_date: Optional[datetime] = None
#     verification_code: Optional[str] = None
#     verification_code_expires: Optional[datetime] = None
#     created_at: datetime = Field(default_factory=datetime.utcnow)

#     # Relationships
#     family = relationship("Family", back_populates="head")
#     attendance_records = relationship("Attendance", back_populates="member") 