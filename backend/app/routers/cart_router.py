from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from app.database import cart_collection, products_collection
from app.models.cart import CartItemAdd, CartItemUpdate, CartResponse, CartItemResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])


async def get_cart_response(user_id: str) -> CartResponse:
    """Build the full cart response with product details."""
    cart = await cart_collection.find_one({"user_id": user_id})
    if not cart or not cart.get("items"):
        return CartResponse(items=[], total=0.0, item_count=0)

    items = []
    total = 0.0
    for item in cart["items"]:
        product = await products_collection.find_one({"_id": ObjectId(item["product_id"])})
        if product:
            subtotal = product["price"] * item["quantity"]
            total += subtotal
            items.append(CartItemResponse(
                product_id=item["product_id"],
                name=product["name"],
                price=product["price"],
                image_url=product["image_url"],
                quantity=item["quantity"],
                subtotal=round(subtotal, 2),
            ))

    return CartResponse(items=items, total=round(total, 2), item_count=len(items))


@router.get("", response_model=CartResponse)
async def get_cart(current_user: dict = Depends(get_current_user)):
    """Get the current user's cart."""
    return await get_cart_response(current_user["id"])


@router.post("/add", response_model=CartResponse)
async def add_to_cart(item: CartItemAdd, current_user: dict = Depends(get_current_user)):
    """Add an item to the cart or increase its quantity."""
    user_id = current_user["id"]

    # Verify product exists
    product = await products_collection.find_one({"_id": ObjectId(item.product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = await cart_collection.find_one({"user_id": user_id})

    if cart:
        # Check if product already in cart
        existing_item = next(
            (i for i in cart.get("items", []) if i["product_id"] == item.product_id),
            None
        )
        if existing_item:
            await cart_collection.update_one(
                {"user_id": user_id, "items.product_id": item.product_id},
                {"$inc": {"items.$.quantity": item.quantity}}
            )
        else:
            await cart_collection.update_one(
                {"user_id": user_id},
                {"$push": {"items": {"product_id": item.product_id, "quantity": item.quantity}}}
            )
    else:
        await cart_collection.insert_one({
            "user_id": user_id,
            "items": [{"product_id": item.product_id, "quantity": item.quantity}]
        })

    return await get_cart_response(user_id)


@router.put("/update/{product_id}", response_model=CartResponse)
async def update_cart_item(product_id: str, update: CartItemUpdate, current_user: dict = Depends(get_current_user)):
    """Update the quantity of a cart item. Set quantity to 0 to remove."""
    user_id = current_user["id"]

    if update.quantity == 0:
        await cart_collection.update_one(
            {"user_id": user_id},
            {"$pull": {"items": {"product_id": product_id}}}
        )
    else:
        await cart_collection.update_one(
            {"user_id": user_id, "items.product_id": product_id},
            {"$set": {"items.$.quantity": update.quantity}}
        )

    return await get_cart_response(user_id)


@router.delete("/remove/{product_id}", response_model=CartResponse)
async def remove_from_cart(product_id: str, current_user: dict = Depends(get_current_user)):
    """Remove an item from the cart."""
    user_id = current_user["id"]
    await cart_collection.update_one(
        {"user_id": user_id},
        {"$pull": {"items": {"product_id": product_id}}}
    )
    return await get_cart_response(user_id)


@router.delete("/clear", response_model=CartResponse)
async def clear_cart(current_user: dict = Depends(get_current_user)):
    """Clear all items from the cart."""
    user_id = current_user["id"]
    await cart_collection.delete_one({"user_id": user_id})
    return CartResponse(items=[], total=0.0, item_count=0)
