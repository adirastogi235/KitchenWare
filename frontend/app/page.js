"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSpinner";
import { productsApi } from "@/lib/api";

const CATEGORIES = [
  { name: "Cookware", icon: "🍳", href: "/products?category=Cookware" },
  { name: "Cutlery", icon: "🔪", href: "/products?category=Cutlery" },
  { name: "Storage", icon: "🫙", href: "/products?category=Storage" },
  { name: "Appliances", icon: "⚡", href: "/products?category=Appliances" },
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
    <div className="bg-[var(--color-bg)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold text-[var(--color-primary)] tracking-widest uppercase mb-3">
                  Welcome to रसोई घर
                </p>
                <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text)] leading-tight mb-2">
                  परंपरा से
                  <br />
                  <span className="text-[var(--color-primary)]">आधुनिकता तक</span>
                </h1>
                <p className="text-lg text-[var(--color-text-muted)] italic mb-6">
                  "आपकी रसोई, हमारी ज़िम्मेदारी"
                </p>
              </div>
              
              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed max-w-md">
                Discover our curated collection of premium kitchenware. From traditional cookware to modern appliances—everything you need to create magic in your kitchen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-primary)] text-[#1a1410] font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-white transition-colors duration-300 shadow-lg shadow-yellow-400/30"
                >
                  Shop Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold rounded-lg hover:bg-[var(--color-primary)]/5 transition-colors duration-300"
                >
                  Explore Collection
                </Link>
              </div>

              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-[var(--color-text)]">500+</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Premium Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-text)]">10K+</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Happy Customers</p>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--color-surface-2)]">
                <img
                  src="https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop"
                  alt="Premium Kitchenware"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-[var(--color-primary)] tracking-widest uppercase mb-2">
              Shop by Category
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              Find What You Need
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative overflow-hidden rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-8 hover:border-[var(--color-primary)] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-[var(--color-primary)]/5 group-hover:bg-[var(--color-primary)]/10 transition-colors duration-300"></div>
                <div className="relative flex flex-col items-center text-center gap-4">
                  <span className="text-4xl">{cat.icon}</span>
                  <h3 className="font-semibold text-[var(--color-text)]">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-[var(--color-primary)] tracking-widest uppercase mb-2">
              Our Picks
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              Featured Products
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            ) : featured.length > 0 ? (
              featured.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full py-12 text-center text-[var(--color-text-muted)]">
                No products available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl bg-[var(--color-primary)] p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2740%27 height=%2740%27 viewBox=%270 0 40 40%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%271a1410%27%3E%3Cpath d=%270 0h2v2H0zm5 5h2v2H5zm5 5h2v2h-2zm5 5h2v2h-2zm5 5h2v2h-2zM0 20h2v2H0zm5 5h2v2H5zm5 5h2v2h-2zm5 5h2v2h-2zm5 5h2v2h-2zM0 40h2v2H0zm5-5h2v2H5zm5-5h2v2h-2zm5-5h2v2h-2zm5-5h2v2h-2z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
            }}></div>
            <div className="relative text-center max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1410]">
                Ready to Transform Your Kitchen?
              </h3>
              <p className="text-lg mb-8 text-[#1a1410]/80">
                Join thousands of happy customers who've upgraded their cooking experience with our premium kitchenware.
              </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--color-primary)] font-semibold rounded-lg hover:bg-[var(--color-surface-2)] transition-colors duration-300 border-2 border-[var(--color-primary)]"
            >
              Start Shopping
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
