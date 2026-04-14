"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSpinner";
import { productsApi } from "@/lib/api";

const CATEGORIES = [
  { name: "Cookware", icon: "🍳", desc: "Kadhai, Tawa, Pots & Pans", color: "from-rose-500 to-pink-500" },
  { name: "Cutlery", icon: "🔪", desc: "Knives, Spoons & Ladles", color: "from-sky-500 to-indigo-500" },
  { name: "Storage", icon: "🫙", desc: "Containers, Jars & Bottles", color: "from-emerald-500 to-teal-500" },
  { name: "Appliances", icon: "⚡", desc: "Mixer, Kettle & Cooktop", color: "from-violet-500 to-purple-500" },
];

const STATS = [
  { label: "Products", value: "500+" },
  { label: "Happy Customers", value: "10K+" },
  { label: "Categories", value: "4" },
  { label: "Brands", value: "50+" },
];

const BADGES = [
  { icon: "🚚", title: "Free Delivery", desc: "On orders above ₹999" },
  { icon: "🔄", title: "Easy Returns", desc: "7-day return policy" },
  { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
  { icon: "💬", title: "24/7 Support", desc: "Dedicated help center" },
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0b1121]">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 lg:py-44">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-emerald-300">
                Free shipping on orders above ₹999
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 leading-[1.05] tracking-tight">
              परंपरा से
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                आधुनिकता तक
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-300/80 font-medium mb-6 italic">
              &ldquo;आपकी रसोई, हमारी ज़िम्मेदारी&rdquo;
            </p>

            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Premium kitchenware curated for the modern Indian home. From traditional
              cookware to cutting-edge appliances.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 hover:-translate-y-0.5"
              >
                Explore Collection
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-slate-700 text-white font-semibold text-lg hover:bg-white/5 hover:border-slate-500 transition-all duration-300"
              >
                View Bestsellers
              </Link>
            </div>

            <div className="mt-20 inline-flex flex-wrap justify-center">
              <div className="inline-flex items-center bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.08] divide-x divide-white/[0.08]">
                {STATS.map((stat) => (
                  <div key={stat.label} className="px-6 md:px-10 py-5 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#0b1121] to-transparent"></div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold tracking-widest uppercase text-emerald-600">Categories</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 tracking-tight">Shop by Category</h2>
          <p className="text-[var(--color-text-muted)] mt-3 text-lg">Find exactly what your kitchen needs</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="group relative overflow-hidden rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-7 md:p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/[0.06] hover:border-emerald-200 dark:hover:border-emerald-800"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`}
              ></div>
              <div className="relative">
                <span className="text-5xl md:text-6xl block mb-4 group-hover:scale-110 transition-transform duration-500">
                  {cat.icon}
                </span>
                <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[var(--color-surface-2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm font-semibold tracking-widest uppercase text-emerald-600">Curated</span>
              <h2 className="text-3xl md:text-5xl font-bold mt-3 tracking-tight">Featured Products</h2>
              <p className="text-[var(--color-text-muted)] mt-3">Our best-selling kitchenware picks</p>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] font-medium text-sm hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="text-center mt-10 md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] font-medium text-sm"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-10 md:p-16">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/[0.06] rounded-full"></div>
          <div className="relative max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-5">
              Limited Offer
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
              Transform Your Kitchen Today
            </h2>
            <p className="text-lg text-emerald-50/80 mb-8 leading-relaxed">
              Get up to 30% off on your first order. Use code{" "}
              <span className="font-bold bg-white/20 px-2.5 py-0.5 rounded-lg">RASOI30</span> at checkout.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-full hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Shopping
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {BADGES.map((badge) => (
            <div
              key={badge.title}
              className="group text-center p-6 md:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                {badge.icon}
              </div>
              <h3 className="font-semibold mb-1">{badge.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
