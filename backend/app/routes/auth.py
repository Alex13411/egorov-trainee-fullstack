from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from starlette.requests import Request

from app.config import get_settings
from app.oauth import oauth, oauth_configured

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


@router.get("/status")
async def auth_status() -> dict[str, bool | str]:
    return {
        "configured": oauth_configured(settings.google_client_id, settings.google_client_secret),
        "redirect_uri": settings.google_redirect_uri,
        "frontend_url": settings.frontend_url,
    }


@router.get("/google/login")
async def google_login(request: Request):
    if not oauth_configured(settings.google_client_id, settings.google_client_secret):
        raise HTTPException(
            status_code=503,
            detail="Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
        )

    return await oauth.google.authorize_redirect(request, settings.google_redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as exc:  # noqa: BLE001
        query = urlencode({"auth": "error", "message": str(exc)})
        return RedirectResponse(url=f"{settings.frontend_url}/?{query}")

    userinfo = token.get("userinfo")
    if not userinfo:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://openidconnect.googleapis.com/v1/userinfo",
                headers={"Authorization": f"Bearer {token['access_token']}"},
            )
            response.raise_for_status()
            userinfo = response.json()

    query = urlencode(
        {
            "auth": "success",
            "name": userinfo.get("name", ""),
            "email": userinfo.get("email", ""),
            "picture": userinfo.get("picture", ""),
        }
    )
    return RedirectResponse(url=f"{settings.frontend_url}/?{query}")
