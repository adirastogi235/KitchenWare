from fastapi import APIRouter, HTTPException, status, Depends, Query
from datetime import datetime, timezone
from typing import Optional, List
from bson import ObjectId
from app.database import products_collection, reviews_collection
from app.models.product import ProductCreate, ProductUpdate, ProductResponse, ReviewCreate, ReviewResponse
from app.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/api/products", tags=["Products"])


def product_to_response(product: dict) -> ProductResponse:
    return ProductResponse(
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
    )


@router.get("", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    featured: Optional[bool] = None,
    sort_by: Optional[str] = Query(None, regex="^(price_asc|price_desc|name|rating|newest)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    """Get products with optional filtering, search, and sorting."""
    query = {}

    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    if min_price is not None:
        query.setdefault("price", {})["$gte"] = min_price
    if max_price is not None:
        query.setdefault("price", {})["$lte"] = max_price
    if featured is not None:
        query["featured"] = featured

    sort_field = [("created_at", -1)]
    if sort_by == "price_asc":
        sort_field = [("price", 1)]
    elif sort_by == "price_desc":
        sort_field = [("price", -1)]
    elif sort_by == "name":
        sort_field = [("name", 1)]
    elif sort_by == "rating":
        sort_field = [("avg_rating", -1)]
    elif sort_by == "newest":
        sort_field = [("created_at", -1)]

    cursor = products_collection.find(query).sort(sort_field).skip(skip).limit(limit)
    products = await cursor.to_list(length=limit)
    return [product_to_response(p) for p in products]


@router.get("/categories")
async def get_categories():
    """Get all unique product categories."""
    categories = await products_collection.distinct("category")
    return {"categories": categories}


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Get a single product by ID."""
    try:
        product = await products_collection.find_one({"_id": ObjectId(product_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID")

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_to_response(product)


@router.post("", response_model=ProductResponse, status_code=201)
async def create_product(product: ProductCreate, admin: dict = Depends(get_current_admin)):
    """Create a new product (admin only)."""
    product_dict = product.dict()
    product_dict["created_at"] = datetime.now(timezone.utc)
    product_dict["avg_rating"] = 0.0
    product_dict["num_reviews"] = 0

    result = await products_collection.insert_one(product_dict)
    created = await products_collection.find_one({"_id": result.inserted_id})
    return product_to_response(created)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, update: ProductUpdate, admin: dict = Depends(get_current_admin)):
    """Update an existing product (admin only)."""
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    return product_to_response(product)


@router.delete("/{product_id}")
async def delete_product(product_id: str, admin: dict = Depends(get_current_admin)):
    """Delete a product (admin only)."""
    result = await products_collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}


# --- Reviews ---

@router.get("/{product_id}/reviews", response_model=List[ReviewResponse])
async def get_reviews(product_id: str):
    """Get all reviews for a product."""
    cursor = reviews_collection.find({"product_id": product_id}).sort("created_at", -1)
    reviews = await cursor.to_list(length=50)
    return [
        ReviewResponse(
            id=str(r["_id"]),
            product_id=r["product_id"],
            user_id=r["user_id"],
            user_name=r["user_name"],
            rating=r["rating"],
            comment=r.get("comment"),
            created_at=r["created_at"],
        )
        for r in reviews
    ]


@router.post("/{product_id}/reviews", response_model=ReviewResponse, status_code=201)
async def create_review(product_id: str, review: ReviewCreate, current_user: dict = Depends(get_current_user)):
    """Add a review for a product."""
    # Verify product exists
    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    review_dict = {
        "product_id": product_id,
        "user_id": current_user["id"],
        "user_name": current_user["name"],
        "rating": review.rating,
        "comment": review.comment,
        "created_at": datetime.now(timezone.utc),
    }

    result = await reviews_collection.insert_one(review_dict)

    # Update product average rating
    pipeline = [
        {"$match": {"product_id": product_id}},
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}},
    ]
    stats = await reviews_collection.aggregate(pipeline).to_list(1)
    if stats:
        await products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": {"avg_rating": round(stats[0]["avg"], 1), "num_reviews": stats[0]["count"]}}
        )

    review_dict["id"] = str(result.inserted_id)
    return ReviewResponse(**review_dict)
