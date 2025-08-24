from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from models.model import Admin, Member, Pastor
from dependencies import role_required
from fastapi import Depends
import church_mg_system.backend.app.models.model as model

router = APIRouter(
    prefix="/protected",
    tags=["Protected"]
)



@router.get("/admin/dashboard")
def get_dashboard_data(current_user: model.Admin = Depends(role_required("admin"))):    
    return {"message": f"Welcome to the admin dashboard, {current_user.username}"}

@router.get("/member/profile")
def member_profile(current_user: Annotated[Member, Depends(role_required("member"))]):
    return {"message": f"Welcome to your profile, {current_user.name}"}

@router.get("/pastor/sermons")
def pastor_view(current_user: Annotated[Pastor, Depends(role_required("pastor"))]):
    return {"message": f"Pastor {current_user.username}, here are your sermons"}
