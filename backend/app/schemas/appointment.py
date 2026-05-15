from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_time: str
    notes: Optional[str] = None

    @validator("appointment_time")
    def parse_appointment_time(cls, value):
        try:
            return datetime.strptime(value, "%Y-%m-%d %H:%M")
        except ValueError:
            raise ValueError("Use format: YYYY-MM-DD HH:MM example: 2026-05-20 10:00")

class AppointmentStatusUpdate(BaseModel):
    status: str

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_time: datetime
    status: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True