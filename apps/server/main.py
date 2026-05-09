from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth.routes import router as auth_router
from api.rewards.routes import router as rewards_router
from api.tasks.routes import router as tasks_router
from api.health.routes import router as health_router
from core.config import settings

app = FastAPI(title="Inaam API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, this should be specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(rewards_router, prefix="/api/v1")
app.include_router(tasks_router, prefix="/api/v1")
app.include_router(health_router, prefix="/api/v1")


@app.get("/")
def main():
    return {"message": f"{settings.PROJECT_NAME} API is running"}
