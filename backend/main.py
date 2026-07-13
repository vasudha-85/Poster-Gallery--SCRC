import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import auth, posters, sections

app = FastAPI(title="QR-Play Backend")
import os
from fastapi.staticfiles import StaticFiles

UPLOAD_DIR = os.getenv(
    "UPLOAD_DIR",
    os.path.join(os.path.dirname(__file__), "..", "uploads")
)

os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads"
)

allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
allowed_origins = [origin.strip() for origin in allowed_origins if origin.strip()]

# Ensure upload directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.join(UPLOAD_DIR, "posters"), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_DIR, "audio"), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_DIR, "qrcodes"), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_DIR, "thumbnails"), exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = request.headers.get("origin") or allowed_origins[0] if allowed_origins else "*"
    response.headers.setdefault("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.setdefault("Access-Control-Allow-Headers", "*")
    return response



app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(posters.router, prefix="/api/posters", tags=["posters"])
app.include_router(sections.router, prefix="/api/sections", tags=["sections"])

@app.get("/health")
async def health():
    return {"status": "ok"}