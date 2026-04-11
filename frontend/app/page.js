"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSpinner";
import { productsApi } from "@/lib/api";

const CATEGORIES = [
  { name: "Cookware", icon: "🍳", desc: "Kadhai, Tawa, Pots & Pans", color: "from-orange-500 to-red-500" },
  { name: "Cutlery", icon: "🔪", desc: "Knives, Spoons & Ladles", color: "from-blue-500 to-indigo-500" },
  { name: "Storage", icon: "🫙", desc: "Containers, Jars & Bottles", color: "from-emerald-500 to-teal-500" },
  { name: "Appliances", icon: "⚡", desc: "Mixer, Kettle & Cooktop", color: "from-purple-500 to-pink-500" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .getAll({ featured: true, limit: 8 })
      .then(setFeatured)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-red-950/10"></div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 animate-float">
              <span className="text-sm">🎉</span>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Free shipping on orders above ₹999
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-gradient">Rasoi Ghar</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto leading-relaxed">
              Your one-stop destination for premium kitchenware. From traditional Indian cookware to modern
              appliances — bring quality to your kitchen. 🏠
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 hover:-translate-y-1 active:scale-95"
              >
                Shop Now →
              </Link>
              <Link
                href="/products?featured=true"
                className="px-8 py-3.5 rounded-2xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-semibold text-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
              >
                View Featured
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { label: "Products", value: "500+" },
                { label: "Happy Customers", value: "10K+" },
                { label: "Categories", value: "4" },
                { label: "Brands", value: "50+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-[var(--color-text-muted)]">Find everything you need for your kitchen</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="group relative overflow-hidden rounded-2xl p-6 md:p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
              <div className="relative">
                <span className="text-4xl md:text-5xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </span>
                <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{cat.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[var(--color-surface-2)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Featured <span className="text-gradient">Products</span>
              </h2>
              <p className="text-[var(--color-text-muted)]">Our best-selling kitchenware picks</p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 text-[var(--color-primary)] font-medium hover:gap-3 transition-all duration-300"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>

          {!loading && featured.length === 0 && (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              <p className="text-lg">No featured products available yet.</p>
              <p className="text-sm mt-2">Check back soon or browse all products!</p>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] font-medium hover:border-[var(--color-primary)] transition-colors"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 md:p-16 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4"></div>
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transform Your Kitchen Today! 🌟
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Get up to 30% off on your first order. Use code <span className="font-bold bg-white/20 px-2 py-1 rounded">RASOI30</span> at checkout.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🚚", title: "Free Delivery", desc: "On orders above ₹999" },
            { icon: "🔄", title: "Easy Returns", desc: "7-day return policy" },
            { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
            { icon: "💬", title: "24/7 Support", desc: "Dedicated help center" },
          ].map((badge) => (
            <div
              key={badge.title}
              className="text-center p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-3xl block mb-3">{badge.icon}</span>
              <h3 className="font-semibold mb-1">{badge.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
