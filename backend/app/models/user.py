# from sqlalchemy import Boolean, Column, Integer, String, DateTime
# from sqlalchemy.orm import relationship
# from datetime import datetime

# from ..db.base_class import Base

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, index=True)
#     email = Column(String, unique=True, index=True)
#     hashed_password = Column(String)
#     phone = Column(String)
#     house_address = Column(String)
#     is_active = Column(Boolean, default=True)
#     role = Column(String, default="member")
#     verification_code = Column(String, nullable=True)
#     verification_code_expires = Column(DateTime, nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     # Relationships
#     family = relationship("Family", back_populates="head")
#     attendance_records = relationship("Attendance", back_populates="member") 