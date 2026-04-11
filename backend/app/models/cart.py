from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CartItemAdd(BaseModel):
    product_id: str
    quantity: int = Field(default=1, ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=0)


class CartItemResponse(BaseModel):
    product_id: str
    name: str
    price: float
    image_url: str
    quantity: int
    subtotal: float


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total: float
    item_count: int
