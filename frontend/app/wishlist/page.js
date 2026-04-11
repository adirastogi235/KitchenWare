"use client";
import { useApp } from "@/lib/context";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
  const { user, wishlist } = useApp();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">❤️</span>
        <h1 className="text-2xl font-bold mb-2">Please sign in to view your wishlist</h1>
        <Link href="/auth" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold mt-4">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">
        My <span className="text-gradient">Wishlist</span>
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">❤️</span>
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-[var(--color-text-muted)] mb-6">Save items you love for later!</p>
          <Link href="/products" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
