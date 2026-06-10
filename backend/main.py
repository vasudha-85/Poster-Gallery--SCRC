from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routers import auth, posters, sections
from app.db import init_db_pool, close_db_pool, ensure_admin


app = FastAPI(title="QR-Play Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await init_db_pool(app)
    await ensure_admin(app)


@app.on_event("shutdown")
async def shutdown():
    await close_db_pool(app)


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(posters.router, prefix="/api/posters", tags=["posters"])
app.include_router(sections.router, prefix="/api/sections", tags=["sections"])


@app.get("/health")
async def health():
    return {"status": "ok"}
