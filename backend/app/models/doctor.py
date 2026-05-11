from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    specialization = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    available = Column(String(10), default="yes")

    user = relationship("User")
    appointments = relationship("Appointment", back_populates="doctor")