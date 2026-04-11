from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone
from bson import ObjectId
from app.database import orders_collection, cart_collection, products_collection
from app.models.order import OrderCreate, OrderResponse, OrderItemResponse
from app.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def order_to_response(order: dict) -> OrderResponse:
    return OrderResponse(
        id=str(order["_id"]),
        user_id=order["user_id"],
        items=[OrderItemResponse(**item) for item in order["items"]],
        total=order["total"],
        shipping_address=order["shipping_address"],
        payment_method=order.get("payment_method", "cod"),
        status=order.get("status", "pending"),
        payment_status=order.get("payment_status", "pending"),
        razorpay_order_id=order.get("razorpay_order_id"),
        razorpay_payment_id=order.get("razorpay_payment_id"),
        created_at=order["created_at"],
    )


@router.post("", response_model=OrderResponse, status_code=201)
async def create_order(order: OrderCreate, current_user: dict = Depends(get_current_user)):
    """Create an order from the current cart contents."""
    user_id = current_user["id"]

    # Get cart
    cart = await cart_collection.find_one({"user_id": user_id})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Build order items
    order_items = []
    total = 0.0
    for item in cart["items"]:
        product = await products_collection.find_one({"_id": ObjectId(item["product_id"])})
        if not product:
            continue
        subtotal = product["price"] * item["quantity"]
        total += subtotal
        order_items.append({
            "product_id": item["product_id"],
            "name": product["name"],
            "price": product["price"],
            "quantity": item["quantity"],
            "image_url": product["image_url"],
        })

        # Decrease stock
        await products_collection.update_one(
            {"_id": ObjectId(item["product_id"])},
            {"$inc": {"stock": -item["quantity"]}}
        )

    if not order_items:
        raise HTTPException(status_code=400, detail="No valid products in cart")

    order_dict = {
        "user_id": user_id,
        "items": order_items,
        "total": round(total, 2),
        "shipping_address": order.shipping_address.dict(),
        "payment_method": order.payment_method,
        "status": "pending",
        "payment_status": "pending",
        "razorpay_order_id": None,
        "razorpay_payment_id": None,
        "created_at": datetime.now(timezone.utc),
    }

    result = await orders_collection.insert_one(order_dict)

    # Clear cart after order
    await cart_collection.delete_one({"user_id": user_id})

    order_dict["_id"] = result.inserted_id
    return order_to_response(order_dict)


@router.get("", response_model=List[OrderResponse])
async def get_my_orders(current_user: dict = Depends(get_current_user)):
    """Get the current user's order history."""
    cursor = orders_collection.find({"user_id": current_user["id"]}).sort("created_at", -1)
    orders = await cursor.to_list(length=50)
    return [order_to_response(o) for o in orders]


@router.get("/all", response_model=List[OrderResponse])
async def get_all_orders(admin: dict = Depends(get_current_admin)):
    """Get all orders (admin only)."""
    cursor = orders_collection.find().sort("created_at", -1)
    orders = await cursor.to_list(length=200)
    return [order_to_response(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific order by ID."""
    try:
        order = await orders_collection.find_one({"_id": ObjectId(order_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Only allow the owner or admin to view
    if order["user_id"] != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    return order_to_response(order)


@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status: str, admin: dict = Depends(get_current_admin)):
    """Update order status (admin only)."""
    valid_statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {valid_statuses}")

    result = await orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": f"Order status updated to {status}"}
