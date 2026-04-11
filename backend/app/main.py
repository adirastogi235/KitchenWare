from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.database import create_indexes
from app.routers import auth_router, product_router, cart_router, order_router, wishlist_router, payment_router

app = FastAPI(
    title="Rasoi Ghar API",
    description="Backend API for Rasoi Ghar Kitchenware Shop",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router.router)
app.include_router(product_router.router)
app.include_router(cart_router.router)
app.include_router(order_router.router)
app.include_router(wishlist_router.router)
app.include_router(payment_router.router)


@app.on_event("startup")
async def startup():
    await create_indexes()


@app.get("/")
async def root():
    return {"message": "Welcome to Rasoi Ghar API", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
