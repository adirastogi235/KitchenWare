from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re


def _clean_indian_phone(v: str) -> str:
    cleaned = re.sub(r"[\s\-]", "", v)
    if cleaned.startswith("+91"):
        cleaned = cleaned[3:]
    elif cleaned.startswith("91") and len(cleaned) == 12:
        cleaned = cleaned[2:]
    if not re.match(r"^[6-9]\d{9}$", cleaned):
        raise ValueError("Enter a valid 10-digit Indian mobile number")
    return cleaned


class CheckPhoneRequest(BaseModel):
    phone: str = Field(..., description="10-digit Indian mobile number")

    @field_validator("phone")
    @classmethod
    def validate_indian_phone(cls, v):
        return _clean_indian_phone(v)


class FirebaseVerifyRequest(BaseModel):
    firebase_token: str
    name: Optional[str] = Field(None, min_length=2, max_length=100)


class UserResponse(BaseModel):
    id: str
    name: str
    phone: str
    address: Optional[str] = None
    is_admin: bool = False
    created_at: datetime


class UserUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
