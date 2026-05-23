from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.schemas.appointment import AppointmentCreate, AppointmentStatusUpdate, AppointmentResponse
from app.websockets.connection_manager import manager
import json

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("/", response_model=AppointmentResponse)
async def book_appointment(
    data: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin", "receptionist"))
):
    patient = db.query(Patient).filter(Patient.id == data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    doctor = db.query(Doctor).filter(Doctor.id == data.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    appointment = Appointment(
        patient_id=data.patient_id,
        doctor_id=data.doctor_id,
        appointment_time=data.appointment_time,
        notes=data.notes,
        status="waiting"
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    await manager.broadcast(json.dumps({
        "event": "new_appointment",
        "appointment_id": appointment.id,
        "patient_name": patient.full_name,
        "doctor_id": appointment.doctor_id,
        "status": appointment.status,
        "appointment_time": str(appointment.appointment_time)
    }))

    return appointment

@router.get("/", response_model=List[AppointmentResponse])
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin", "doctor", "receptionist"))
):
    return db.query(Appointment).all()

@router.get("/doctor/{doctor_id}", response_model=List[AppointmentResponse])
def get_doctor_appointments(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin", "doctor", "receptionist"))
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return db.query(Appointment).filter(Appointment.doctor_id == doctor_id).all()

@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin", "doctor", "receptionist"))
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.put("/{appointment_id}/status", response_model=AppointmentResponse)
async def update_appointment_status(
    appointment_id: int,
    data: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin", "doctor"))
):
    valid_statuses = ["waiting", "in_progress", "done"]
    if data.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {valid_statuses}"
        )
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = data.status
    db.commit()
    db.refresh(appointment)

    await manager.broadcast(json.dumps({
        "event": "status_updated",
        "appointment_id": appointment.id,
        "status": appointment.status,
        "doctor_id": appointment.doctor_id
    }))

    return appointment