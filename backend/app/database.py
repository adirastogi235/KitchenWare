from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME

client = AsyncIOMotorClient(MONGODB_URL)
database = client[DATABASE_NAME]

# Collections
users_collection = database["users"]
products_collection = database["products"]
orders_collection = database["orders"]
cart_collection = database["cart"]
wishlist_collection = database["wishlist"]
reviews_collection = database["reviews"]


async def create_indexes():
    """Create database indexes for performance."""
    await users_collection.create_index("email", unique=True)
    await products_collection.create_index("category")
    await products_collection.create_index("name")
    await products_collection.create_index([("name", "text"), ("description", "text")])
    await cart_collection.create_index("user_id")
    await orders_collection.create_index("user_id")
    await wishlist_collection.create_index("user_id")
    await reviews_collection.create_index("product_id")
