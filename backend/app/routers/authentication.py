from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import select
from fastapi.security import OAuth2PasswordRequestForm
# import schemas, database, models, token_access, hashing, oauth2
import schemas, database, models, token_access, hashing, oauth2
from typing import Annotated
from datetime import datetime
from schemas import OAuth2LoginFormWithRole
from utils import email
import random
from utils import otp
import logging

router = APIRouter(
    tags=['Authentication'],
    prefix="/auth"
)


@router.post("/login", response_model=schemas.Token)
async def login(
    form_data: Annotated[OAuth2LoginFormWithRole, Depends()],
    session: database.SessionDep
):
    try:
        # Find user by username
        user = session.exec(
            select(models.User).where(models.User.username == form_data.username)
        ).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify password
        if not hashing.verify_password(form_data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Validate role
        if user.role != form_data.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User is not authorized as {form_data.role}",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create access token
        access_token = token_access.create_access_token(
            data={"sub": user.username, "role": user.role}
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": user.role
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during login: {str(e)}"
        )

@router.post("/register", response_model=schemas.UserPublic)
async def register(
    registration_data: schemas.CombinedRegistration,
    session: database.SessionDep
):
    try:
        # Check if username already exists
        existing_user = session.exec(
            select(models.User).where(models.User.username == registration_data.user.username)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        # Check if email already exists
        if registration_data.user.email:
            existing_email = session.exec(
                select(models.User).where(models.User.email == registration_data.user.email)
            ).first()
            
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            

        db_member = models.Member(
            first_name=registration_data.member.first_name,
            last_name=registration_data.member.last_name,
            date_of_birth=registration_data.member.date_of_birth,
            gender=registration_data.member.gender,
            marital_status=registration_data.member.marital_status,
            occupation=registration_data.member.occupation,
            emergency_contact=registration_data.member.emergency_contact,
            emergency_contact_phone=registration_data.member.emergency_contact_phone,
            baptism_date=registration_data.member.baptism_date,
            membership_date=registration_data.member.membership_date or datetime.utcnow(),
            notes=registration_data.member.notes,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        session.add(db_member)
        session.commit()
        session.refresh(db_member)

        # Create new user
        hashed_password = hashing.get_password_hash(registration_data.user.password)
        db_user = models.User(
            member_id=db_member.id,
            username=registration_data.user.username,
            email=registration_data.user.email,
            password=hashed_password,
            phone=registration_data.user.phone,
            house_address=registration_data.user.house_address,
            role=registration_data.user.role,
            join_date=datetime.utcnow()
        )

        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        # Create member profile
        db_member = models.Member(
            first_name=registration_data.member.first_name,
            last_name=registration_data.member.last_name,
            date_of_birth=registration_data.member.date_of_birth,
            gender=registration_data.member.gender,
            marital_status=registration_data.member.marital_status,
            occupation=registration_data.member.occupation,
            emergency_contact=registration_data.member.emergency_contact,
            emergency_contact_phone=registration_data.member.emergency_contact_phone,
            baptism_date=registration_data.member.baptism_date,
            membership_date=registration_data.member.membership_date or datetime.utcnow(),
            notes=registration_data.member.notes,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        

        return db_user

    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during registration: {str(e)}"
        )

@router.get("/me", response_model=schemas.UserPublic)
async def read_users_me(
    current_user: Annotated[models.User, Depends(oauth2.get_current_user)]
):
    try:
        return current_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching user data: {str(e)}"
        )


@router.post("/forgot-password")
async def forgot_password(
    request: schemas.ForgotPasswordRequest,
    session: database.SessionDep
):
    email = request.email

    # check if the user exists
    user = session.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found"
        )
    
    # Generate OTP and expiry
    try:
        code = otp.generate_otp()
        expires_at = otp.get_expiry()
    
    except Exception as e:
        logging.error(f"Error generating OTP: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating OTP: {str(e)}"
        )
        
    try:
        reset_entry = models
    
@router.post("/reset-password")
async def reset_password(
    token: str,
    new_password: str,
    session: database.SessionDep
):
    try:
        user_id = token_access.verify_reset_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        user = session.exec(
            select(models.User).where(models.User.id == user_id)
        ).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        hashed_password = hashing.get_password_hash(new_password)
        user.password = hashed_password
        session.commit()
        
        return {
            "message": "Password reset successfully"
        }   
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during password reset: {str(e)}"
        )


@router.post("/verify-code")
async def verify_code(
    code: str,
    session: database.SessionDep
):
    try:
        user = session.exec(
            select(models.User).where(models.User.verification_code == code)
        ).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "message": "Code verified successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during code verification: {str(e)}"
        )