from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from app.database import wishlist_collection, products_collection
from app.models.product import ProductResponse
from app.auth import get_current_user
from datetime import datetime, timezone

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])


@router.get("", response_model=List[ProductResponse])
async def get_wishlist(current_user: dict = Depends(get_current_user)):
    """Get the current user's wishlist."""
    wishlist = await wishlist_collection.find_one({"user_id": current_user["id"]})
    if not wishlist or not wishlist.get("product_ids"):
        return []

    products = []
    for pid in wishlist["product_ids"]:
        product = await products_collection.find_one({"_id": ObjectId(pid)})
        if product:
            products.append(ProductResponse(
                id=str(product["_id"]),
                name=product["name"],
                price=product["price"],
                category=product["category"],
                description=product["description"],
                image_url=product["image_url"],
                stock=product.get("stock", 0),
                brand=product.get("brand"),
                material=product.get("material"),
                featured=product.get("featured", False),
                avg_rating=product.get("avg_rating", 0.0),
                num_reviews=product.get("num_reviews", 0),
                created_at=product.get("created_at", datetime.now(timezone.utc)),
            ))
    return products


@router.post("/{product_id}")
async def add_to_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    """Add a product to the wishlist."""
    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    user_id = current_user["id"]
    wishlist = await wishlist_collection.find_one({"user_id": user_id})

    if wishlist:
        if product_id in wishlist.get("product_ids", []):
            return {"message": "Product already in wishlist"}
        await wishlist_collection.update_one(
            {"user_id": user_id},
            {"$push": {"product_ids": product_id}}
        )
    else:
        await wishlist_collection.insert_one({
            "user_id": user_id,
            "product_ids": [product_id]
        })

    return {"message": "Product added to wishlist"}


@router.delete("/{product_id}")
async def remove_from_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    """Remove a product from the wishlist."""
    user_id = current_user["id"]
    await wishlist_collection.update_one(
        {"user_id": user_id},
        {"$pull": {"product_ids": product_id}}
    )
    return {"message": "Product removed from wishlist"}
