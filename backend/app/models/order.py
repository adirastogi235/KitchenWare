from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ShippingAddress(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str


class OrderCreate(BaseModel):
    shipping_address: ShippingAddress
    payment_method: str = Field(default="cod")


class OrderItemResponse(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    image_url: str


class OrderResponse(BaseModel):
    id: str
    user_id: str
    items: List[OrderItemResponse]
    total: float
    shipping_address: ShippingAddress
    payment_method: str
    status: str = "pending"
    payment_status: str = "pending"
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: datetime
