from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    price: float = Field(..., gt=0)
    category: str = Field(..., min_length=2)
    description: str = Field(..., min_length=10)
    image_url: str
    stock: int = Field(default=100, ge=0)
    brand: Optional[str] = None
    material: Optional[str] = None
    featured: bool = False


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None
    brand: Optional[str] = None
    material: Optional[str] = None
    featured: Optional[bool] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    price: float
    category: str
    description: str
    image_url: str
    stock: int
    brand: Optional[str] = None
    material: Optional[str] = None
    featured: bool = False
    avg_rating: float = 0.0
    num_reviews: int = 0
    created_at: datetime


class ReviewCreate(BaseModel):
    product_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: str
    product_id: str
    user_id: str
    user_name: str
    rating: int
    comment: Optional[str] = None
    created_at: datetime
