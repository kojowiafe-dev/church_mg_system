from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status, APIRouter, Depends
from email.message import EmailMessage
import aiosmtplib
import database, models
import smtplib


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


router = APIRouter(
    prefix='/mail',
    tags=['Mail']
)

async def send_verification_email(email: str, token: str, content: str):
    message = EmailMessage()
    message["Subject"] = "Verify your email"
    message["From"] = "wiafejeremiah@gmail.com"
    message["To"] = email
    message.set_content(content)

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login("wiafejeremiah@gmail.com", "zqga oluc lyyx tkdq")
            server.send_message(message)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Email not sent')
    

@router.get('/verify-email')
def verify_email(token: str, session: database.SessionLocal):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if not email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Token")
    
        user = session.query(models.User).filter(models.User.email == email).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")
        
        if user.is_verified:
            return {"message": "Account already verified"}
    
        user.is_verified = True
        session.commit()

        return {"message": "Email verified successfully"}
    
    except JWTError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
