# 🍳 Rasoi Ghar - Premium Kitchenware Shop

A full-stack web application for an Indian kitchenware shop built with **Next.js**, **FastAPI**, and **MongoDB**.

## 📁 Project Structure

```
KitchenWare/
├── frontend/          # Next.js (App Router) + Tailwind CSS
│   ├── app/           # Pages (Home, Products, Cart, Checkout, Auth, Admin, Orders, Wishlist)
│   ├── components/    # Reusable components (Navbar, Footer, ProductCard, LoadingSpinner)
│   ├── lib/           # API utilities and Context provider
│   └── .env.local     # Frontend environment variables
│
├── backend/           # FastAPI (Python)
│   ├── app/
│   │   ├── routers/   # API routes (auth, products, cart, orders, wishlist)
│   │   ├── models/    # Pydantic models (user, product, cart, order)
│   │   ├── main.py    # FastAPI app entry point
│   │   ├── database.py# MongoDB connection
│   │   ├── auth.py    # JWT authentication
│   │   ├── config.py  # Configuration loader
│   │   └── seed.py    # Database seeder with sample data
│   ├── .env           # Backend environment variables
│   └── requirements.txt
│
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (running on localhost:27017)

### 1. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community
# Or run mongod directly
mongod --dbpath /path/to/data
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with sample data
python -m app.seed

# Start the API server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔑 Demo Credentials

| Role  | Email                | Password    |
|-------|---------------------|-------------|
| Admin | admin@rasoighar.com | admin123    |
| User  | priya@example.com   | password123 |

## 🎯 Features

### User Features
- 🏠 **Home Page** - Hero section, featured products, categories, promo banner
- 📦 **Product Listing** - Grid layout, search, filters (category, price), sorting
- 🔍 **Product Detail** - Images, description, ratings, reviews, add to cart
- 🛒 **Shopping Cart** - Update quantities, remove items, order summary
- 💳 **Checkout** - Shipping address, payment method, order placement
- 📋 **Order History** - Track orders with status
- ❤️ **Wishlist** - Save favorite products
- 🌓 **Dark Mode** - Toggle light/dark theme
- 🔐 **Authentication** - Register, login, profile management

### Admin Features
- 📊 **Dashboard** - Stats overview (products, orders, revenue)
- ➕ **Product Management** - Add, edit, delete products
- 📦 **Order Management** - View all orders, update status

## 🎨 Design Features
- Modern UI with Tailwind CSS
- Glassmorphism effects
- Smooth animations and micro-interactions
- Responsive design (mobile + desktop)
- Dark mode support
- Custom gradient branding
- Skeleton loading states

## 🗄️ MongoDB Collections

| Collection | Description              |
|-----------|--------------------------|
| users     | User accounts            |
| products  | Product catalog          |
| orders    | Customer orders          |
| cart      | Shopping cart per user    |
| wishlist  | User wishlists           |
| reviews   | Product reviews/ratings  |

## 📡 API Endpoints

| Method | Endpoint                      | Description           |
|--------|------------------------------|-----------------------|
| POST   | /api/auth/register           | Register new user     |
| POST   | /api/auth/login              | Login                 |
| GET    | /api/auth/me                 | Get profile           |
| GET    | /api/products                | List products         |
| GET    | /api/products/:id            | Get product           |
| POST   | /api/products                | Create product (admin)|
| PUT    | /api/products/:id            | Update product (admin)|
| DELETE | /api/products/:id            | Delete product (admin)|
| GET    | /api/cart                    | Get cart              |
| POST   | /api/cart/add                | Add to cart           |
| PUT    | /api/cart/update/:id         | Update cart item      |
| DELETE | /api/cart/remove/:id         | Remove from cart      |
| POST   | /api/orders                  | Place order           |
| GET    | /api/orders                  | My orders             |
| GET    | /api/orders/all              | All orders (admin)    |
| GET    | /api/wishlist                | Get wishlist          |
| POST   | /api/wishlist/:id            | Add to wishlist       |
| DELETE | /api/wishlist/:id            | Remove from wishlist  |
