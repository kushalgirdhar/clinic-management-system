from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.security import hash_password
from app.models.user import User
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.post("/", response_model=DoctorResponse)
def add_doctor(
    doctor_data: DoctorCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin"))
):
    existing = db.query(User).filter(User.email == doctor_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        full_name=doctor_data.full_name,
        email=doctor_data.email,
        hashed_password=hash_password(doctor_data.password),
        role="doctor"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_doctor = Doctor(
        user_id=new_user.id,
        specialization=doctor_data.specialization,
        phone=doctor_data.phone
    )
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    return new_doctor

@router.get("/", response_model=List[DoctorResponse])
def get_all_doctors(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin", "doctor", "receptionist"))
):
    doctors = db.query(Doctor).all()
    result = []
    for doctor in doctors:
        result.append({
            "id": doctor.id,
            "specialization": doctor.specialization,
            "phone": doctor.phone,
            "available": doctor.available,
            "user_id": doctor.user_id,
            "full_name": doctor.user.full_name,
            "email": doctor.user.email
        })
    return result

@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin", "doctor", "receptionist"))
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {
        "id": doctor.id,
        "specialization": doctor.specialization,
        "phone": doctor.phone,
        "available": doctor.available,
        "user_id": doctor.user_id,
        "full_name": doctor.user.full_name,
        "email": doctor.user.email
    }

@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(
    doctor_id: int,
    doctor_data: DoctorUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin"))
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    for key, value in doctor_data.dict(exclude_unset=True).items():
        setattr(doctor, key, value)
    db.commit()
    db.refresh(doctor)
    return doctor

@router.delete("/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin"))
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db.delete(doctor)
    db.commit()
    return {"message": "Doctor deleted successfully"}