from fastapi import FastAPI
from app.core.database import engine, Base
from sqlalchemy import text
from app.models import user, doctor, patient, appointment
from app.api import auth

app = FastAPI(
    title="Clinic Management System",
    description="Real-time clinic management API",
    version="1.0.0"
)

app.include_router(auth.router)

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine, checkfirst=True)
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("✅ Database connected and tables created!")

@app.get("/")
async def root():
    return {"message": "Clinic Management System API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}