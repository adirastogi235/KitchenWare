"use client";
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";

export default function ProductCard({ product }) {
  const { user, cart, addToCart, updateCartItem, removeFromCart, toggleWishlist, wishlist } = useApp();
  const inWishlist = wishlist.some((p) => p.id === product.id);
  const cartItem = cart.items.find((i) => i.product_id === product.id);
  const qty = cartItem?.quantity || 0;
  const [busy, setBusy] = useState(false);

  const stopLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAddToCart = async (e) => {
    stopLink(e);
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    setBusy(true);
    try {
      await addToCart(product.id);
    } catch (err) {
      alert(err.message);
    }
    setBusy(false);
  };

  const handleIncrement = async (e) => {
    stopLink(e);
    if (qty >= product.stock) return;
    setBusy(true);
    try {
      await updateCartItem(product.id, qty + 1);
    } catch (err) {
      alert(err.message);
    }
    setBusy(false);
  };

  const handleDecrement = async (e) => {
    stopLink(e);
    setBusy(true);
    try {
      if (qty <= 1) {
        await removeFromCart(product.id);
      } else {
        await updateCartItem(product.id, qty - 1);
      }
    } catch (err) {
      alert(err.message);
    }
    setBusy(false);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    try {
      await toggleWishlist(product.id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-500 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-2)]">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                ⭐ Featured
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                Low Stock
              </span>
            )}
          </div>
          {/* Wishlist */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm hover:bg-white dark:hover:bg-black/60 transition-all duration-200 shadow-md"
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className={`w-5 h-5 transition-colors duration-200 ${
                inWishlist ? "text-red-500 fill-red-500" : "text-gray-400"
              }`}
              fill={inWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-[var(--color-primary)] bg-amber-500/10 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-xs text-[var(--color-text-muted)]">{product.brand}</span>
            )}
          </div>
          <h3 className="font-semibold text-[var(--color-text)] mb-1 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          {product.num_reviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(product.avg_rating) ? "text-amber-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">({product.num_reviews})</span>
            </div>
          )}

          <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-gradient">₹{product.price.toLocaleString("en-IN")}</span>
            {qty === 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || busy}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none active:scale-95"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            ) : (
              <div
                onClick={stopLink}
                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 p-1 shadow-lg shadow-amber-500/25"
              >
                <button
                  onClick={handleDecrement}
                  disabled={busy}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-white/20 hover:bg-white/30 text-white font-bold text-lg leading-none transition-colors disabled:opacity-50 active:scale-90"
                >
                  −
                </button>
                <span className="min-w-[1.5rem] text-center text-white text-sm font-bold tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={busy || qty >= product.stock}
                  aria-label="Increase quantity"
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-white/20 hover:bg-white/30 text-white font-bold text-lg leading-none transition-colors disabled:opacity-50 active:scale-90"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
