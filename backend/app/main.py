from fastapi import FastAPI

app = FastAPI(
    title="Clinic Management System",
    description="Real-time clinic management API",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "Clinic Management System API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}