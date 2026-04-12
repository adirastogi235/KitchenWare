import os
import sys
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
IS_PRODUCTION = ENVIRONMENT == "production"

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "rasoi_ghar")

_SECRET_KEY_DEFAULT = "rasoi-ghar-secret-key"
SECRET_KEY = os.getenv("SECRET_KEY", _SECRET_KEY_DEFAULT)
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "rasoi-ghar-9729e")

_RZP_KEY_DEFAULT = "rzp_test_placeholder"
_RZP_SECRET_DEFAULT = "placeholder_secret"
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", _RZP_KEY_DEFAULT)
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", _RZP_SECRET_DEFAULT)

_DEFAULT_CORS = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001"
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", _DEFAULT_CORS).split(",") if o.strip()]

if IS_PRODUCTION:
    _errors = []
    if SECRET_KEY == _SECRET_KEY_DEFAULT:
        _errors.append("SECRET_KEY must be set to a strong random value in production (use: openssl rand -hex 32)")
    if MONGODB_URL == "mongodb://localhost:27017":
        _errors.append("MONGODB_URL must point to your production database in production")
    if any("localhost" in o or "127.0.0.1" in o for o in CORS_ORIGINS):
        _errors.append("CORS_ORIGINS must be set to your production frontend origin(s) in production")
    if _errors:
        print("FATAL: production config errors:", file=sys.stderr)
        for e in _errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)
