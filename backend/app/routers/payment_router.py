import hmac
import hashlib
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from bson import ObjectId
import razorpay
from razorpay.errors import BadRequestError

from app.config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
from app.database import orders_collection
from app.auth import get_current_user

router = APIRouter(prefix="/api/payments", tags=["Payments"])

_razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


class CreatePaymentRequest(BaseModel):
    order_id: str


class CreatePaymentResponse(BaseModel):
    key_id: str
    razorpay_order_id: str
    amount: int
    currency: str
    order_id: str


class VerifyPaymentRequest(BaseModel):
    order_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


async def _load_user_order(order_id: str, user_id: str) -> dict:
    try:
        order = await orders_collection.find_one({"_id": ObjectId(order_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return order


@router.post("/create", response_model=CreatePaymentResponse)
async def create_payment(payload: CreatePaymentRequest, current_user: dict = Depends(get_current_user)):
    """Create a Razorpay order for an existing KitchenWare order."""
    order = await _load_user_order(payload.order_id, current_user["id"])

    if order.get("payment_method") == "cod":
        raise HTTPException(status_code=400, detail="COD orders do not require online payment")
    if order.get("payment_status") == "paid":
        raise HTTPException(status_code=400, detail="Order is already paid")

    amount_paise = int(round(order["total"] * 100))
    try:
        rzp_order = _razorpay_client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": str(order["_id"]),
            "notes": {"kw_order_id": str(order["_id"]), "user_id": current_user["id"]},
            "payment_capture": 1,
        })
    except BadRequestError as e:
        raise HTTPException(status_code=502, detail=f"Razorpay error: {e}")

    await orders_collection.update_one(
        {"_id": order["_id"]},
        {"$set": {"razorpay_order_id": rzp_order["id"]}},
    )

    return CreatePaymentResponse(
        key_id=RAZORPAY_KEY_ID,
        razorpay_order_id=rzp_order["id"],
        amount=amount_paise,
        currency="INR",
        order_id=str(order["_id"]),
    )


@router.post("/verify")
async def verify_payment(payload: VerifyPaymentRequest, current_user: dict = Depends(get_current_user)):
    """Verify the Razorpay payment signature and mark the order as paid."""
    order = await _load_user_order(payload.order_id, current_user["id"])

    if order.get("razorpay_order_id") != payload.razorpay_order_id:
        raise HTTPException(status_code=400, detail="Razorpay order ID mismatch")

    expected = hmac.new(
        RAZORPAY_KEY_SECRET.encode("utf-8"),
        f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    if not hmac.compare_digest(expected, payload.razorpay_signature):
        await orders_collection.update_one(
            {"_id": order["_id"]},
            {"$set": {"payment_status": "failed"}},
        )
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    await orders_collection.update_one(
        {"_id": order["_id"]},
        {"$set": {
            "payment_status": "paid",
            "razorpay_payment_id": payload.razorpay_payment_id,
            "status": "confirmed",
        }},
    )
    return {"message": "Payment verified", "order_id": str(order["_id"])}


@router.post("/{order_id}/failed")
async def mark_payment_failed(order_id: str, current_user: dict = Depends(get_current_user)):
    """Mark a payment as failed (called when the Razorpay modal is dismissed or errors out)."""
    order = await _load_user_order(order_id, current_user["id"])
    if order.get("payment_status") == "paid":
        return {"message": "Already paid, ignored"}
    await orders_collection.update_one(
        {"_id": order["_id"]},
        {"$set": {"payment_status": "failed"}},
    )
    return {"message": "Payment marked as failed"}
