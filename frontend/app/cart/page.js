"use client";
import { useApp } from "@/lib/context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { user, cart, updateCartItem, removeFromCart } = useApp();
  const router = useRouter();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🛒</span>
        <h1 className="text-2xl font-bold mb-2">Please sign in to view your cart</h1>
        <p className="text-[var(--color-text-muted)] mb-6">You need to be logged in to manage your cart.</p>
        <Link
          href="/auth"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🛒</span>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-[var(--color-text-muted)] mb-6">
          Looks like you haven&apos;t added anything yet!
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Shopping <span className="text-gradient">Cart</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product_id}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 flex gap-4 hover:shadow-md transition-shadow duration-300"
            >
              <Link href={`/products/${item.product_id}`} className="shrink-0">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/products/${item.product_id}`}
                    className="font-semibold hover:text-[var(--color-primary)] transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-lg font-bold text-gradient mt-1">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center rounded-lg border border-[var(--color-border)] overflow-hidden">
                    <button
                      onClick={() => updateCartItem(item.product_id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1.5 hover:bg-[var(--color-surface-2)] transition-colors text-sm font-medium"
                    >
                      −
                    </button>
                    <span className="px-3 py-1.5 font-semibold text-sm min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItem(item.product_id, item.quantity + 1)}
                      className="px-3 py-1.5 hover:bg-[var(--color-surface-2)] transition-colors text-sm font-medium"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">
                      ₹{item.subtotal.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Items ({cart.item_count})</span>
                <span>₹{cart.total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Shipping</span>
                <span className={cart.total >= 999 ? "text-green-600" : ""}>
                  {cart.total >= 999 ? "FREE" : "₹99"}
                </span>
              </div>
              {cart.total < 999 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Add ₹{(999 - cart.total).toLocaleString("en-IN")} more for free shipping!
                </p>
              )}
              <hr className="border-[var(--color-border)]" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-gradient">
                  ₹{(cart.total + (cart.total >= 999 ? 0 : 99)).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/products"
              className="block text-center mt-4 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
