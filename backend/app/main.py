from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from app.core.database import engine, Base
from sqlalchemy import text
from app.models import user, doctor, patient, appointment
from app.api import auth, users

app = FastAPI(
    title="Clinic Management System",
    description="Real-time clinic management API",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(users.router)

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

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Clinic Management System",
        version="1.0.0",
        description="Real-time clinic management API",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi