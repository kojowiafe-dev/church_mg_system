from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
import random
import string
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from ...core.config import settings
from ...db.session import get_db
from ...models.user import User
from ...schemas.auth import Token, TokenData, UserCreate, UserResponse
from ...core.security import (
    create_access_token,
    verify_password,
    get_password_hash,
    verify_token
)

router = APIRouter()

# ... existing code ...

@router.post("/forgot-password")
async def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Generate 6-digit verification code
    verification_code = ''.join(random.choices(string.digits, k=6))
    user.verification_code = verification_code
    user.verification_code_expires = datetime.utcnow() + timedelta(minutes=15)
    db.commit()

    # Send verification code via email
    try:
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_USERNAME
        msg['To'] = email
        msg['Subject'] = "Password Reset Verification Code"

        body = f"""
        Hello,

        You have requested to reset your password. Please use the following verification code:

        {verification_code}

        This code will expire in 15 minutes.

        If you did not request this password reset, please ignore this email.

        Best regards,
        Your Church Management System
        """

        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)

        return {"message": "Verification code sent successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification code"
        )

@router.post("/verify-code")
async def verify_code(email: str, code: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not user.verification_code or not user.verification_code_expires:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No verification code requested"
        )

    if datetime.utcnow() > user.verification_code_expires:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code has expired"
        )

    if user.verification_code != code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )

    # Clear verification code after successful verification
    user.verification_code = None
    user.verification_code_expires = None
    db.commit()

    return {"message": "Code verified successfully"}

@router.post("/reset-password")
async def reset_password(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update password
    user.hashed_password = get_password_hash(password)
    db.commit()

    return {"message": "Password reset successful"} 