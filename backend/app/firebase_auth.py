import httpx
from jose import jwt, JWTError
from cryptography.x509 import load_pem_x509_certificate
from app.config import FIREBASE_PROJECT_ID
GOOGLE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"

_cached_certs = {}


async def _get_google_certs():
    global _cached_certs
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(GOOGLE_CERTS_URL)
        resp.raise_for_status()
        _cached_certs = resp.json()
    return _cached_certs


async def verify_firebase_token(id_token: str) -> dict:
    header = jwt.get_unverified_header(id_token)
    kid = header.get("kid")

    certs = _cached_certs or await _get_google_certs()
    cert_pem = certs.get(kid)

    if not cert_pem:
        certs = await _get_google_certs()
        cert_pem = certs.get(kid)
        if not cert_pem:
            raise ValueError("Invalid token signing key")

    cert_obj = load_pem_x509_certificate(cert_pem.encode())
    public_key = cert_obj.public_key()

    try:
        payload = jwt.decode(
            id_token,
            public_key,
            algorithms=["RS256"],
            audience=FIREBASE_PROJECT_ID,
            issuer=f"https://securetoken.google.com/{FIREBASE_PROJECT_ID}",
        )
    except JWTError as e:
        raise ValueError(f"Token verification failed: {e}")

    return payload
