from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timezone
from bson import ObjectId
from app.database import users_collection
from app.models.user import UserCreate, UserLogin, UserResponse, UserUpdate, Token
from app.auth import verify_password, get_password_hash, create_access_token, get_current_user
from fastapi import Depends

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    """Register a new user account."""
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user_dict = {
        "name": user.name,
        "email": user.email,
        "password": get_password_hash(user.password),
        "phone": user.phone,
        "address": user.address,
        "is_admin": False,
        "created_at": datetime.now(timezone.utc),
    }

    result = await users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)

    access_token = create_access_token(data={"sub": user_id})

    return Token(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            name=user.name,
            email=user.email,
            phone=user.phone,
            address=user.address,
            is_admin=False,
            created_at=user_dict["created_at"],
        )
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login with email and password."""
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})

    return Token(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            name=user["name"],
            email=user["email"],
            phone=user.get("phone"),
            address=user.get("address"),
            is_admin=user.get("is_admin", False),
            created_at=user["created_at"],
        )
    )


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get the current user's profile."""
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        phone=current_user.get("phone"),
        address=current_user.get("address"),
        is_admin=current_user.get("is_admin", False),
        created_at=current_user["created_at"],
    )


@router.put("/me", response_model=UserResponse)
async def update_profile(update: UserUpdate, current_user: dict = Depends(get_current_user)):
    """Update the current user's profile."""
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if update_data:
        await users_collection.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": update_data}
        )
    user = await users_collection.find_one({"_id": ObjectId(current_user["id"])})
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        phone=user.get("phone"),
        address=user.get("address"),
        is_admin=user.get("is_admin", False),
        created_at=user["created_at"],
    )
