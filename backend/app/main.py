from fastapi import FastAPI
from app.core.database import engine, Base
from sqlalchemy import text

app = FastAPI(
    title="Clinic Management System",
    description="Real-time clinic management API",
    version="1.0.0"
)

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("✅ Database connected successfully!")

@app.get("/")
async def root():
    return {"message": "Clinic Management System API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}