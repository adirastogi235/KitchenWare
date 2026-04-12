from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re


class SendOTPRequest(BaseModel):
    phone: str = Field(..., description="10-digit Indian mobile number")

    @field_validator("phone")
    @classmethod
    def validate_indian_phone(cls, v):
        cleaned = re.sub(r"[\s\-]", "", v)
        if cleaned.startswith("+91"):
            cleaned = cleaned[3:]
        elif cleaned.startswith("91") and len(cleaned) == 12:
            cleaned = cleaned[2:]
        if not re.match(r"^[6-9]\d{9}$", cleaned):
            raise ValueError("Enter a valid 10-digit Indian mobile number")
        return cleaned


class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str = Field(..., min_length=4, max_length=6)
    name: Optional[str] = Field(None, min_length=2, max_length=100)

    @field_validator("phone")
    @classmethod
    def validate_indian_phone(cls, v):
        cleaned = re.sub(r"[\s\-]", "", v)
        if cleaned.startswith("+91"):
            cleaned = cleaned[3:]
        elif cleaned.startswith("91") and len(cleaned) == 12:
            cleaned = cleaned[2:]
        if not re.match(r"^[6-9]\d{9}$", cleaned):
            raise ValueError("Enter a valid 10-digit Indian mobile number")
        return cleaned


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


class SendOTPResponse(BaseModel):
    message: str
    is_new_user: bool
