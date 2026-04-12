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
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/[0.06] hover:border-emerald-200 dark:hover:border-emerald-800">
        <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-2)]">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-500/25">
                Featured
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="px-2.5 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">
                Low Stock
              </span>
            )}
          </div>
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 transition-all duration-200 shadow-sm hover:shadow-md"
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className={`w-4.5 h-4.5 transition-colors duration-200 ${
                inWishlist ? "text-rose-500 fill-rose-500" : "text-slate-400"
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

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-xs text-[var(--color-text-muted)]">{product.brand}</span>
            )}
          </div>
          <h3 className="font-semibold text-[var(--color-text)] mb-1 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {product.name}
          </h3>

          {product.num_reviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(product.avg_rating) ? "text-amber-400" : "text-slate-200 dark:text-slate-600"
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
            <span className="text-lg font-bold text-[var(--color-text)]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {qty === 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || busy}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none active:scale-95"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            ) : (
              <div
                onClick={stopLink}
                className="flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-1 shadow-lg shadow-emerald-500/20"
              >
                <button
                  onClick={handleDecrement}
                  disabled={busy}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-lg leading-none transition-colors disabled:opacity-50 active:scale-90"
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
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-lg leading-none transition-colors disabled:opacity-50 active:scale-90"
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
