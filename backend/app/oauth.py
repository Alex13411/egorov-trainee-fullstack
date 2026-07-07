from authlib.integrations.starlette_client import OAuth

from app.config import get_settings

settings = get_settings()

oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

PLACEHOLDER_CREDENTIALS = {
    "",
    "your-google-client-id.apps.googleusercontent.com",
    "your-google-client-secret",
}


def oauth_configured(client_id: str, client_secret: str) -> bool:
    return bool(
        client_id
        and client_secret
        and client_id not in PLACEHOLDER_CREDENTIALS
        and client_secret not in PLACEHOLDER_CREDENTIALS
    )
