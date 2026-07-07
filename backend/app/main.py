import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.config import get_settings
from app.routes import auth, health

settings = get_settings()


def create_app() -> FastAPI:
    app = FastAPI(title="Kairos Auth API", version="0.1.0")

    app.add_middleware(
        SessionMiddleware,
        secret_key=os.getenv("SECRET_KEY", "dev-only-change-me"),
        same_site="lax",
        https_only=False,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, prefix="/api")
    app.include_router(auth.router, prefix="/api")

    return app


app = create_app()
