"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/context";
import { ordersApi } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

const STATUS_COLORS = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  shipped: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

function OrdersContent() {
  const { user } = useApp();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const success = searchParams.get("success");

  useEffect(() => {
    if (!user) return;
    ordersApi
      .getMy()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">📦</span>
        <h1 className="text-2xl font-bold mb-2">Please sign in</h1>
        <Link href="/auth" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner size="lg" text="Loading orders..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {success && (
        <div className="mb-8 p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
          <span className="text-4xl block mb-2">🎉</span>
          <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">Order Placed Successfully!</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Thank you for shopping with रसोई घर.</p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">
        My <span className="text-gradient">Orders</span>
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">📦</span>
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-[var(--color-text-muted)] mb-6">Start shopping to see your orders here!</p>
          <Link href="/products" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Order ID</p>
                    <p className="font-mono text-sm font-medium">{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Date</p>
                    <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Total</p>
                    <p className="text-sm font-bold text-gradient">₹{order.total.toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status] || ""}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[var(--color-surface-2)] rounded-lg p-2 pr-4">
                      <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-[150px]">{item.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" text="Loading orders..." />}>
      <OrdersContent />
    </Suspense>
  );
}
