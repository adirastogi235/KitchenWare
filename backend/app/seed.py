"""
Seed script to populate MongoDB with sample kitchenware products and an admin user.
Run: python -m app.seed
"""
import asyncio
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME

SAMPLE_PRODUCTS = [
    # Cookware
    {
        "name": "Premium Non-Stick Kadhai",
        "price": 999.00,
        "category": "Cookware",
        "description": "Heavy-duty aluminium kadhai with premium granite non-stick coating. Perfect for deep frying and Indian cooking. PFOA free, dishwasher safe with cool-touch bakelite handles.",
        "image_url": "https://images.unsplash.com/photo-1549753799-f3bebc047040?w=600&h=600&fit=crop&q=80",
        "stock": 50,
        "brand": "Prestige",
        "material": "Aluminium",
        "featured": True,
    },
    {
        "name": "Stainless Steel Pressure Cooker 5L",
        "price": 1999.00,
        "category": "Cookware",
        "description": "ISI certified 5-litre stainless steel pressure cooker with dual safety valve. Induction compatible base with precision weight valve for perfect cooking every time.",
        "image_url": "https://images.unsplash.com/photo-1612476930934-b7ef769cbae9?w=600&h=600&fit=crop&q=80",
        "stock": 35,
        "brand": "Hawkins",
        "material": "Stainless Steel",
        "featured": True,
    },
    {
        "name": "Cast Iron Dosa Tawa",
        "price": 699.00,
        "category": "Cookware",
        "description": "Traditional pre-seasoned cast iron dosa tawa, 12-inch diameter. Naturally non-stick surface that improves with use. Ideal for making crispy dosas, uttapams and parathas.",
        "image_url": "https://images.unsplash.com/photo-1637739699971-7d4d5194e75c?w=600&h=600&fit=crop&q=80",
        "stock": 40,
        "brand": "Lodge",
        "material": "Cast Iron",
        "featured": False,
    },
    {
        "name": "Copper Bottom Patila Set (3 Pcs)",
        "price": 1499.00,
        "category": "Cookware",
        "description": "Set of 3 stainless steel patila with copper bottom for even heat distribution. Includes 1L, 2L, and 3L sizes. Ideal for boiling, simmering and preparing curries.",
        "image_url": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&h=600&fit=crop&q=80",
        "stock": 25,
        "brand": "Vinod",
        "material": "Stainless Steel",
        "featured": False,
    },
    {
        "name": "Non-Stick Fry Pan 26cm",
        "price": 649.00,
        "category": "Cookware",
        "description": "26cm non-stick frying pan with 5-layer marble coating. Ergonomic soft-touch handle with heat-resistant silicone grip. Works on gas, electric, and ceramic cooktops.",
        "image_url": "https://images.unsplash.com/photo-1590091625593-090e3d58fc78?w=600&h=600&fit=crop&q=80",
        "stock": 60,
        "brand": "Pigeon",
        "material": "Aluminium",
        "featured": True,
    },
    {
        "name": "Silicone Baking Mat Set (2 Pcs)",
        "price": 399.00,
        "category": "Cookware",
        "description": "Set of 2 food-grade silicone baking mats. Non-stick surface, reusable up to 2000 times. Heat resistant up to 260°C. Fits standard baking sheets. Eco-friendly alternative to parchment paper.",
        "image_url": "https://images.unsplash.com/photo-1598968333180-9b4f6bc2bf52?w=600&h=600&fit=crop&q=80",
        "stock": 65,
        "brand": "Generic",
        "material": "Food-Grade Silicone",
        "featured": False,
    },
    # Cutlery
    {
        "name": "Premium Chef Knife Set (5 Pcs)",
        "price": 2799.00,
        "category": "Cutlery",
        "description": "Professional-grade 5-piece chef knife set with high-carbon stainless steel blades. Includes chef knife, santoku, bread knife, utility knife, and paring knife with wooden block.",
        "image_url": "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop&q=80",
        "stock": 20,
        "brand": "Victorinox",
        "material": "High-Carbon Steel",
        "featured": True,
    },
    {
        "name": "Stainless Steel Cutlery Set (24 Pcs)",
        "price": 1299.00,
        "category": "Cutlery",
        "description": "24-piece premium cutlery set with mirror polish finish. Includes 6 dinner spoons, 6 forks, 6 dessert spoons, and 6 teaspoons. Elegant design suitable for daily use and entertaining.",
        "image_url": "https://images.unsplash.com/photo-1771830933605-ffbae3e3d1b5?w=600&h=600&fit=crop&q=80",
        "stock": 30,
        "brand": "FNS",
        "material": "Stainless Steel",
        "featured": False,
    },
    {
        "name": "Wooden Spatula & Ladle Set",
        "price": 449.00,
        "category": "Cutlery",
        "description": "Set of 6 handcrafted neem wood cooking utensils. Includes spatula, ladle, slotted spoon, turner, serving spoon, and flat spatula. Natural antibacterial properties, safe for non-stick cookware.",
        "image_url": "https://plus.unsplash.com/premium_photo-1664007654191-75992ed6627b?w=600&h=600&fit=crop&q=80",
        "stock": 45,
        "brand": "Homecraft",
        "material": "Neem Wood",
        "featured": False,
    },
    {
        "name": "Vegetable Peeler & Grater Combo",
        "price": 299.00,
        "category": "Cutlery",
        "description": "Stainless steel Y-peeler and 4-sided box grater combo. Sharp blades for effortless peeling. Grater includes fine, medium, coarse, and slicing surfaces with non-slip base.",
        "image_url": "https://images.unsplash.com/photo-1623707430647-d81f3f0b4a4b?w=600&h=600&fit=crop&q=80",
        "stock": 70,
        "brand": "OXO",
        "material": "Stainless Steel",
        "featured": False,
    },
    # Storage
    {
        "name": "Airtight Container Set (12 Pcs)",
        "price": 1199.00,
        "category": "Storage",
        "description": "12-piece BPA-free airtight storage container set with snap-lock lids. Various sizes from 300ml to 2000ml. Stackable design to save kitchen space. Clear containers for easy identification.",
        "image_url": "https://images.unsplash.com/photo-1688366150258-bee7b2d02479?w=600&h=600&fit=crop&q=80",
        "stock": 40,
        "brand": "Tupperware",
        "material": "BPA-Free Plastic",
        "featured": True,
    },
    {
        "name": "Stainless Steel Masala Dabba",
        "price": 549.00,
        "category": "Storage",
        "description": "Traditional Indian spice box with 7 compartments and individual lids. Stainless steel construction with see-through acrylic lid. Includes a small spoon. Essential for every Indian kitchen.",
        "image_url": "https://images.unsplash.com/photo-1771541897176-44a3e01dc484?w=600&h=600&fit=crop&q=80",
        "stock": 55,
        "brand": "Kitchen Kraft",
        "material": "Stainless Steel",
        "featured": True,
    },
    {
        "name": "Glass Storage Jar Set (4 Pcs)",
        "price": 799.00,
        "category": "Storage",
        "description": "Set of 4 borosilicate glass storage jars with bamboo lids. Sizes include 500ml, 1L, 1.5L, and 2L. Perfect for storing pulses, rice, cereals, and dry fruits.",
        "image_url": "https://images.unsplash.com/photo-1590616270784-3331d2efea25?w=600&h=600&fit=crop&q=80",
        "stock": 35,
        "brand": "Borosil",
        "material": "Borosilicate Glass",
        "featured": False,
    },
    {
        "name": "Steel Water Bottle 1000ml",
        "price": 349.00,
        "category": "Storage",
        "description": "Double-wall vacuum insulated stainless steel water bottle. Keeps beverages cold for 24 hours or hot for 12 hours. Leak-proof lid with carrying loop. BPA-free and eco-friendly.",
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&q=80",
        "stock": 80,
        "brand": "Milton",
        "material": "Stainless Steel",
        "featured": False,
    },
    # Appliances
    {
        "name": "Mixer Grinder 750W (3 Jars)",
        "price": 3499.00,
        "category": "Appliances",
        "description": "Powerful 750W mixer grinder with 3 stainless steel jars. Features include overload protection, 3-speed control with pulse, and vacuum suction feet. Perfect for grinding, blending, and making chutneys.",
        "image_url": "https://plus.unsplash.com/premium_photo-1718043036195-c744d30ce350?w=600&h=600&fit=crop&q=80",
        "stock": 25,
        "brand": "Bajaj",
        "material": "ABS Plastic + Steel",
        "featured": True,
    },
    {
        "name": "Electric Kettle 1.5L",
        "price": 899.00,
        "category": "Appliances",
        "description": "1.5L stainless steel electric kettle with auto shut-off and boil-dry protection. 360-degree rotating base with concealed heating element. Boils water in under 5 minutes.",
        "image_url": "https://images.unsplash.com/photo-1643114786355-ff9e52736eab?w=600&h=600&fit=crop&q=80",
        "stock": 45,
        "brand": "Philips",
        "material": "Stainless Steel",
        "featured": False,
    },
    {
        "name": "Hand Blender 400W",
        "price": 1499.00,
        "category": "Appliances",
        "description": "400W immersion hand blender with stainless steel blade and ergonomic grip. Includes chopper attachment, whisk, and measuring cup. Variable speed control for precise blending.",
        "image_url": "https://plus.unsplash.com/premium_photo-1719060015345-e401c743f89b?w=600&h=600&fit=crop&q=80",
        "stock": 30,
        "brand": "Bosch",
        "material": "ABS Plastic + Steel",
        "featured": False,
    },
    {
        "name": "Induction Cooktop 2000W",
        "price": 2399.00,
        "category": "Appliances",
        "description": "2000W crystal glass induction cooktop with touch panel controls. Features 7 preset Indian menus, adjustable temperature from 100-240°C, and auto-timer up to 3 hours. Energy efficient cooking.",
        "image_url": "https://plus.unsplash.com/premium_photo-1718735910395-94a28fbc9f6b?w=600&h=600&fit=crop&q=80",
        "stock": 20,
        "brand": "Prestige",
        "material": "Crystal Glass",
        "featured": True,
    },
    {
        "name": "Digital Kitchen Scale",
        "price": 599.00,
        "category": "Appliances",
        "description": "Precision digital kitchen scale with 5kg capacity and 1g accuracy. Tempered glass platform with LCD display. Features tare function, auto-off, and unit conversion (g/oz/lb/ml).",
        "image_url": "https://plus.unsplash.com/premium_photo-1721522922185-f665934b902b?w=600&h=600&fit=crop&q=80",
        "stock": 50,
        "brand": "Generic",
        "material": "Tempered Glass",
        "featured": False,
    },
    {
        "name": "Roti/Chapati Maker Electric",
        "price": 1799.00,
        "category": "Appliances",
        "description": "Electric roti maker with non-stick coated plates. Makes perfect round rotis in minutes. Cool-touch handles with indicator lights. 900W heating element for quick cooking.",
        "image_url": "https://images.unsplash.com/photo-1545505005-0a09f804dcf6?w=600&h=600&fit=crop&q=80",
        "stock": 15,
        "brand": "Bajaj",
        "material": "Non-Stick Coated",
        "featured": True,
    },
    # Puja (Worship Utensils)
    {
        "name": "Brass Diya Set (5 Pcs)",
        "price": 299.00,
        "category": "Puja",
        "description": "Set of 5 traditional hand-crafted brass diyas for daily puja, aarti, and festivals like Diwali. Polished golden finish with long-lasting shine. Perfect for temple at home.",
        "image_url": "https://images.unsplash.com/photo-1758691901125-a38f5e17f47e?w=600&h=600&fit=crop&q=80",
        "stock": 100,
        "brand": "Shri Handicrafts",
        "material": "Pure Brass",
        "featured": True,
    },
    {
        "name": "Brass Puja Bell (Ghanti)",
        "price": 249.00,
        "category": "Puja",
        "description": "Traditional brass puja ghanti with sweet melodious sound. Hand-carved wooden handle with intricate design. Essential for daily aarti and temple rituals. 5-inch height.",
        "image_url": "https://images.unsplash.com/photo-1763475945701-8ae7b56eb69f?w=600&h=600&fit=crop&q=80",
        "stock": 75,
        "brand": "Shri Handicrafts",
        "material": "Pure Brass",
        "featured": True,
    },
    {
        "name": "Brass Thali Plate (10 inch)",
        "price": 549.00,
        "category": "Puja",
        "description": "Traditional 10-inch brass thali with embossed border design. Ideal for prasad, bhog, aarti, and festive occasions. Food-safe polish, easy to clean. Brings authentic temple feel to your home.",
        "image_url": "https://images.unsplash.com/photo-1754277198657-c288797a30a7?w=600&h=600&fit=crop&q=80",
        "stock": 40,
        "brand": "Heritage Brass",
        "material": "Pure Brass",
        "featured": False,
    },
    {
        "name": "Hammered Copper Mug 350ml",
        "price": 329.00,
        "category": "Puja",
        "description": "Pure copper hammered mug, 350ml capacity. Ayurveda recommends drinking water stored overnight in copper for natural health benefits. Elegant hand-hammered finish. Lead-free and food-safe.",
        "image_url": "https://plus.unsplash.com/premium_photo-1664698362383-88eaae68a5d0?w=600&h=600&fit=crop&q=80",
        "stock": 90,
        "brand": "Indian Art Villa",
        "material": "Pure Copper",
        "featured": True,
    },
    {
        "name": "Complete Puja Thali Set",
        "price": 849.00,
        "category": "Puja",
        "description": "7-piece complete brass puja thali set. Includes thali, diya, agarbatti stand, kalash, bell, chandan holder, and kumkum box. Perfect for daily worship and festive occasions. Gift-ready packaging.",
        "image_url": "https://images.unsplash.com/photo-1692107112697-aca539554bc0?w=600&h=600&fit=crop&q=80",
        "stock": 30,
        "brand": "Heritage Brass",
        "material": "Pure Brass",
        "featured": True,
    },
    {
        "name": "Copper Water Bottle 1L",
        "price": 469.00,
        "category": "Puja",
        "description": "Pure copper water bottle with 1-litre capacity. Naturally purifies water when stored overnight. Ayurvedic health benefits — aids digestion and immunity. Leak-proof screw lid. Handmade in India.",
        "image_url": "https://images.unsplash.com/photo-1739484440756-03afc18ca096?w=600&h=600&fit=crop&q=80",
        "stock": 70,
        "brand": "Indian Art Villa",
        "material": "Pure Copper",
        "featured": False,
    },
    {
        "name": "Brass Kalash / Lota 500ml",
        "price": 399.00,
        "category": "Puja",
        "description": "Traditional brass kalash / lota with 500ml capacity. Essential for havan, puja, and religious ceremonies. Hand-polished with elegant rounded body. Also used as decorative showpiece.",
        "image_url": "https://images.unsplash.com/photo-1644061925268-053b6a592c2e?w=600&h=600&fit=crop&q=80",
        "stock": 50,
        "brand": "Shri Handicrafts",
        "material": "Pure Brass",
        "featured": False,
    },
]

ADMIN_USER = {
    "name": "Admin",
    "phone": "9876543210",
    "address": "Rasoi Ghar HQ, Delhi",
    "is_admin": True,
    "created_at": datetime.now(timezone.utc),
}

SAMPLE_USER = {
    "name": "Ravish Rastogi",
    "phone": "9876543211",
    "address": "123 MG Road, Mumbai",
    "is_admin": False,
    "created_at": datetime.now(timezone.utc),
}


async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    # Reset products only — preserve real users, carts, orders, wishlist, reviews
    await db["products"].delete_many({})
    print("🗑️  Cleared products")

    for product in SAMPLE_PRODUCTS:
        product["created_at"] = datetime.now(timezone.utc)
        product["avg_rating"] = 0.0
        product["num_reviews"] = 0

    result = await db["products"].insert_many(SAMPLE_PRODUCTS)
    print(f"✅ Inserted {len(result.inserted_ids)} products")

    # Upsert demo users by phone so re-running doesn't wipe real accounts
    await db["users"].update_one(
        {"phone": ADMIN_USER["phone"]},
        {"$setOnInsert": ADMIN_USER},
        upsert=True,
    )
    await db["users"].update_one(
        {"phone": SAMPLE_USER["phone"]},
        {"$setOnInsert": SAMPLE_USER},
        upsert=True,
    )
    print("✅ Upserted demo users (9876543210 admin, 9876543211 sample)")

    # Create indexes
    await db["users"].create_index("phone", unique=True)
    await db["products"].create_index("category")
    await db["products"].create_index("name")
    print("✅ Created database indexes")

    print("\n🎉 Database seeded successfully!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
