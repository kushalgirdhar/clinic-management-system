from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user, require_role
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role
    }

@router.get("/admin-only")
def admin_dashboard(current_user: User = Depends(require_role("admin"))):
    return {"message": f"Welcome admin {current_user.full_name}!"}

@router.get("/doctor-only")
def doctor_dashboard(current_user: User = Depends(require_role("doctor"))):
    return {"message": f"Welcome doctor {current_user.full_name}!"}