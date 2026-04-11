"""
Seed script to populate MongoDB with sample kitchenware products and an admin user.
Run: python -m app.seed
"""
import asyncio
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from app.config import MONGODB_URL, DATABASE_NAME

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SAMPLE_PRODUCTS = [
    # Cookware
    {
        "name": "Premium Non-Stick Kadhai",
        "price": 1299.00,
        "category": "Cookware",
        "description": "Heavy-duty aluminium kadhai with premium granite non-stick coating. Perfect for deep frying and Indian cooking. PFOA free, dishwasher safe with cool-touch bakelite handles.",
        "image_url": "https://live.staticflickr.com/65535/49859595051_57d7b2fb1c_c.jpg",
        "stock": 50,
        "brand": "Prestige",
        "material": "Aluminium",
        "featured": True,
    },
    {
        "name": "Stainless Steel Pressure Cooker 5L",
        "price": 2499.00,
        "category": "Cookware",
        "description": "ISI certified 5-litre stainless steel pressure cooker with dual safety valve. Induction compatible base with precision weight valve for perfect cooking every time.",
        "image_url": "https://live.staticflickr.com/65535/53982008384_e117903907_c.jpg",
        "stock": 35,
        "brand": "Hawkins",
        "material": "Stainless Steel",
        "featured": True,
    },
    {
        "name": "Cast Iron Dosa Tawa",
        "price": 899.00,
        "category": "Cookware",
        "description": "Traditional pre-seasoned cast iron dosa tawa, 12-inch diameter. Naturally non-stick surface that improves with use. Ideal for making crispy dosas, uttapams and parathas.",
        "image_url": "https://live.staticflickr.com/65535/54527048071_f7e0b389f7_c.jpg",
        "stock": 40,
        "brand": "Lodge",
        "material": "Cast Iron",
        "featured": False,
    },
    {
        "name": "Copper Bottom Patila Set (3 Pcs)",
        "price": 1899.00,
        "category": "Cookware",
        "description": "Set of 3 stainless steel patila with copper bottom for even heat distribution. Includes 1L, 2L, and 3L sizes. Ideal for boiling, simmering and preparing curries.",
        "image_url": "https://live.staticflickr.com/65535/54210862924_e0404e6d9e_c.jpg",
        "stock": 25,
        "brand": "Vinod",
        "material": "Stainless Steel",
        "featured": False,
    },
    {
        "name": "Non-Stick Fry Pan 26cm",
        "price": 799.00,
        "category": "Cookware",
        "description": "26cm non-stick frying pan with 5-layer marble coating. Ergonomic soft-touch handle with heat-resistant silicone grip. Works on gas, electric, and ceramic cooktops.",
        "image_url": "https://live.staticflickr.com/65535/53684782776_4d7bb24e74_c.jpg",
        "stock": 60,
        "brand": "Pigeon",
        "material": "Aluminium",
        "featured": True,
    },
    # Cutlery
    {
        "name": "Premium Chef Knife Set (5 Pcs)",
        "price": 3499.00,
        "category": "Cutlery",
        "description": "Professional-grade 5-piece chef knife set with high-carbon stainless steel blades. Includes chef knife, santoku, bread knife, utility knife, and paring knife with wooden block.",
        "image_url": "https://live.staticflickr.com/65535/52846012505_ca7506d883_c.jpg",
        "stock": 20,
        "brand": "Victorinox",
        "material": "High-Carbon Steel",
        "featured": True,
    },
    {
        "name": "Stainless Steel Cutlery Set (24 Pcs)",
        "price": 1599.00,
        "category": "Cutlery",
        "description": "24-piece premium cutlery set with mirror polish finish. Includes 6 dinner spoons, 6 forks, 6 dessert spoons, and 6 teaspoons. Elegant design suitable for daily use and entertaining.",
        "image_url": "https://live.staticflickr.com/65535/53899930373_56d070a3ce_c.jpg",
        "stock": 30,
        "brand": "FNS",
        "material": "Stainless Steel",
        "featured": False,
    },
    {
        "name": "Wooden Spatula & Ladle Set",
        "price": 599.00,
        "category": "Cutlery",
        "description": "Set of 6 handcrafted neem wood cooking utensils. Includes spatula, ladle, slotted spoon, turner, serving spoon, and flat spatula. Natural antibacterial properties, safe for non-stick cookware.",
        "image_url": "https://live.staticflickr.com/65535/53684288287_159391c023_c.jpg",
        "stock": 45,
        "brand": "Homecraft",
        "material": "Neem Wood",
        "featured": False,
    },
    {
        "name": "Vegetable Peeler & Grater Combo",
        "price": 349.00,
        "category": "Cutlery",
        "description": "Stainless steel Y-peeler and 4-sided box grater combo. Sharp blades for effortless peeling. Grater includes fine, medium, coarse, and slicing surfaces with non-slip base.",
        "image_url": "https://live.staticflickr.com/65535/54579902922_679fc7ac40_c.jpg",
        "stock": 70,
        "brand": "OXO",
        "material": "Stainless Steel",
        "featured": False,
    },
    # Storage
    {
        "name": "Airtight Container Set (12 Pcs)",
        "price": 1499.00,
        "category": "Storage",
        "description": "12-piece BPA-free airtight storage container set with snap-lock lids. Various sizes from 300ml to 2000ml. Stackable design to save kitchen space. Clear containers for easy identification.",
        "image_url": "https://live.staticflickr.com/2219/32832031651_2c83d2ec34_c.jpg",
        "stock": 40,
        "brand": "Tupperware",
        "material": "BPA-Free Plastic",
        "featured": True,
    },
    {
        "name": "Stainless Steel Masala Dabba",
        "price": 699.00,
        "category": "Storage",
        "description": "Traditional Indian spice box with 7 compartments and individual lids. Stainless steel construction with see-through acrylic lid. Includes a small spoon. Essential for every Indian kitchen.",
        "image_url": "https://live.staticflickr.com/65535/52429577419_02be6ec6c9_c.jpg",
        "stock": 55,
        "brand": "Kitchen Kraft",
        "material": "Stainless Steel",
        "featured": True,
    },
    {
        "name": "Glass Storage Jar Set (4 Pcs)",
        "price": 999.00,
        "category": "Storage",
        "description": "Set of 4 borosilicate glass storage jars with bamboo lids. Sizes include 500ml, 1L, 1.5L, and 2L. Perfect for storing pulses, rice, cereals, and dry fruits.",
        "image_url": "https://live.staticflickr.com/65535/54221058959_cf241881ca_c.jpg",
        "stock": 35,
        "brand": "Borosil",
        "material": "Borosilicate Glass",
        "featured": False,
    },
    {
        "name": "Steel Water Bottle 1000ml",
        "price": 449.00,
        "category": "Storage",
        "description": "Double-wall vacuum insulated stainless steel water bottle. Keeps beverages cold for 24 hours or hot for 12 hours. Leak-proof lid with carrying loop. BPA-free and eco-friendly.",
        "image_url": "https://live.staticflickr.com/65535/54574603252_dc2971229c_c.jpg",
        "stock": 80,
        "brand": "Milton",
        "material": "Stainless Steel",
        "featured": False,
    },
    # Appliances
    {
        "name": "Mixer Grinder 750W (3 Jars)",
        "price": 4299.00,
        "category": "Appliances",
        "description": "Powerful 750W mixer grinder with 3 stainless steel jars. Features include overload protection, 3-speed control with pulse, and vacuum suction feet. Perfect for grinding, blending, and making chutneys.",
        "image_url": "https://live.staticflickr.com/2695/4287353227_f041b60af8_c.jpg",
        "stock": 25,
        "brand": "Bajaj",
        "material": "ABS Plastic + Steel",
        "featured": True,
    },
    {
        "name": "Electric Kettle 1.5L",
        "price": 1199.00,
        "category": "Appliances",
        "description": "1.5L stainless steel electric kettle with auto shut-off and boil-dry protection. 360-degree rotating base with concealed heating element. Boils water in under 5 minutes.",
        "image_url": "https://live.staticflickr.com/65535/49900821767_610223b75f_c.jpg",
        "stock": 45,
        "brand": "Philips",
        "material": "Stainless Steel",
        "featured": False,
    },
    {
        "name": "Hand Blender 400W",
        "price": 1899.00,
        "category": "Appliances",
        "description": "400W immersion hand blender with stainless steel blade and ergonomic grip. Includes chopper attachment, whisk, and measuring cup. Variable speed control for precise blending.",
        "image_url": "https://live.staticflickr.com/815/39139830760_5ef4e52aa4_c.jpg",
        "stock": 30,
        "brand": "Bosch",
        "material": "ABS Plastic + Steel",
        "featured": False,
    },
    {
        "name": "Induction Cooktop 2000W",
        "price": 2999.00,
        "category": "Appliances",
        "description": "2000W crystal glass induction cooktop with touch panel controls. Features 7 preset Indian menus, adjustable temperature from 100-240°C, and auto-timer up to 3 hours. Energy efficient cooking.",
        "image_url": "https://live.staticflickr.com/65535/54295642889_f7e3da9c8d_c.jpg",
        "stock": 20,
        "brand": "Prestige",
        "material": "Crystal Glass",
        "featured": True,
    },
    {
        "name": "Digital Kitchen Scale",
        "price": 799.00,
        "category": "Appliances",
        "description": "Precision digital kitchen scale with 5kg capacity and 1g accuracy. Tempered glass platform with LCD display. Features tare function, auto-off, and unit conversion (g/oz/lb/ml).",
        "image_url": "https://live.staticflickr.com/65535/51788214182_6489e1c5ee_c.jpg",
        "stock": 50,
        "brand": "Generic",
        "material": "Tempered Glass",
        "featured": False,
    },
    # More products for variety
    {
        "name": "Silicone Baking Mat Set (2 Pcs)",
        "price": 499.00,
        "category": "Cookware",
        "description": "Set of 2 food-grade silicone baking mats. Non-stick surface, reusable up to 2000 times. Heat resistant up to 260°C. Fits standard baking sheets. Eco-friendly alternative to parchment paper.",
        "image_url": "https://live.staticflickr.com/3647/3412381711_f1613948e7_c.jpg",
        "stock": 65,
        "brand": "Generic",
        "material": "Food-Grade Silicone",
        "featured": False,
    },
    {
        "name": "Roti/Chapati Maker Electric",
        "price": 2199.00,
        "category": "Appliances",
        "description": "Electric roti maker with non-stick coated plates. Makes perfect round rotis in minutes. Cool-touch handles with indicator lights. 900W heating element for quick cooking.",
        "image_url": "https://live.staticflickr.com/65535/52890541482_396de58c37_c.jpg",
        "stock": 15,
        "brand": "Bajaj",
        "material": "Non-Stick Coated",
        "featured": True,
    },
]

ADMIN_USER = {
    "name": "Admin",
    "email": "admin@rasoighar.com",
    "password": pwd_context.hash("admin123"),
    "phone": "+91-9876543210",
    "address": "Rasoi Ghar HQ, Delhi",
    "is_admin": True,
    "created_at": datetime.now(timezone.utc),
}

SAMPLE_USER = {
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "password": pwd_context.hash("password123"),
    "phone": "+91-9876543211",
    "address": "123 MG Road, Mumbai",
    "is_admin": False,
    "created_at": datetime.now(timezone.utc),
}


async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    # Clear existing data
    await db["products"].delete_many({})
    await db["users"].delete_many({})
    await db["cart"].delete_many({})
    await db["orders"].delete_many({})
    await db["wishlist"].delete_many({})
    await db["reviews"].delete_many({})

    print("🗑️  Cleared existing data")

    # Insert products
    for product in SAMPLE_PRODUCTS:
        product["created_at"] = datetime.now(timezone.utc)
        product["avg_rating"] = 0.0
        product["num_reviews"] = 0

    result = await db["products"].insert_many(SAMPLE_PRODUCTS)
    print(f"✅ Inserted {len(result.inserted_ids)} products")

    # Insert users
    await db["users"].insert_one(ADMIN_USER)
    await db["users"].insert_one(SAMPLE_USER)
    print("✅ Created admin user: admin@rasoighar.com / admin123")
    print("✅ Created sample user: priya@example.com / password123")

    # Create indexes
    await db["users"].create_index("email", unique=True)
    await db["products"].create_index("category")
    await db["products"].create_index("name")
    print("✅ Created database indexes")

    print("\n🎉 Database seeded successfully!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
