from fastapi import FastAPI

from routers.auth import router as auth_router
from routers.posters import router as posters_router
from routers.sections import router as sections_router


app = FastAPI(
    title="Poster Gallery API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Poster Gallery API Running"
    }


app.include_router(auth_router)
app.include_router(posters_router)
app.include_router(sections_router)