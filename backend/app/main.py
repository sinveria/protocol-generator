from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import Base, engine
from .routers import sessions, upload, documents

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GEK Documents Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(upload.router)
app.include_router(documents.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}