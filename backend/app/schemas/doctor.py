from pydantic import BaseModel, EmailStr
from typing import Optional

class DoctorCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    specialization: str
    phone: str

class DoctorUpdate(BaseModel):
    specialization: Optional[str] = None
    phone: Optional[str] = None
    available: Optional[str] = None

class DoctorResponse(BaseModel):
    id: int
    specialization: str
    phone: str
    available: str
    user_id: int
    full_name: str
    email: str

    class Config:
        from_attributes = True