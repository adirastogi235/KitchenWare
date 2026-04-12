from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timezone
from bson import ObjectId
from app.database import users_collection
from app.models.user import (
    SendOTPRequest, VerifyOTPRequest, UserResponse, UserUpdate, Token, SendOTPResponse,
)
from app.auth import create_access_token, get_current_user
from app.sms import generate_and_send_otp, verify_stored_otp

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def _user_response(user: dict) -> UserResponse:
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        phone=user["phone"],
        address=user.get("address"),
        is_admin=user.get("is_admin", False),
        created_at=user["created_at"],
    )


@router.post("/send-otp", response_model=SendOTPResponse)
async def send_otp_endpoint(req: SendOTPRequest):
    existing = await users_collection.find_one({"phone": req.phone})
    try:
        await generate_and_send_otp(req.phone)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))
    return SendOTPResponse(message="OTP sent successfully", is_new_user=existing is None)


@router.post("/verify-otp", response_model=Token)
async def verify_otp_endpoint(req: VerifyOTPRequest):
    valid = await verify_stored_otp(req.phone, req.otp)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP",
        )

    user = await users_collection.find_one({"phone": req.phone})

    if user is None:
        if not req.name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Name is required for new users",
            )
        user_dict = {
            "name": req.name,
            "phone": req.phone,
            "address": None,
            "is_admin": False,
            "created_at": datetime.now(timezone.utc),
        }
        result = await users_collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        user = user_dict

    access_token = create_access_token(data={"sub": str(user["_id"])})
    return Token(access_token=access_token, user=_user_response(user))


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return _user_response(current_user)


@router.put("/me", response_model=UserResponse)
async def update_profile(update: UserUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if update_data:
        await users_collection.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": update_data},
        )
    user = await users_collection.find_one({"_id": ObjectId(current_user["id"])})
    return _user_response(user)
