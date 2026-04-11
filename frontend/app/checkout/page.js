"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useApp } from "@/lib/context";
import { ordersApi, paymentsApi } from "@/lib/api";
import Link from "next/link";

export default function CheckoutPage() {
  const { user, cart, refreshCart } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.name || "",
    phone: user?.phone || "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    payment_method: "cod",
  });

  if (!user) {
    router.push("/auth");
    return null;
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">📦</span>
        <h1 className="text-2xl font-bold mb-2">No items to checkout</h1>
        <p className="text-[var(--color-text-muted)] mb-6">Add some items to your cart first.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const payOnline = async (order) => {
    if (typeof window === "undefined" || !window.Razorpay) {
      throw new Error("Payment gateway failed to load. Please refresh and try again.");
    }
    const session = await paymentsApi.create(order.id);
    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: session.key_id,
        amount: session.amount,
        currency: session.currency,
        name: "Rasoi Ghar",
        description: `Order #${order.id.slice(-6).toUpperCase()}`,
        order_id: session.razorpay_order_id,
        prefill: {
          name: form.full_name,
          contact: form.phone,
          email: user?.email || "",
        },
        theme: { color: "#f59e0b" },
        handler: async (response) => {
          try {
            await paymentsApi.verify({
              order_id: order.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              await paymentsApi.markFailed(order.id);
            } catch {}
            reject(new Error("Payment cancelled"));
          },
        },
      });
      rzp.on("payment.failed", async () => {
        try {
          await paymentsApi.markFailed(order.id);
        } catch {}
        reject(new Error("Payment failed"));
      });
      rzp.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { payment_method, ...address } = form;
      const order = await ordersApi.create({
        shipping_address: address,
        payment_method,
      });
      if (payment_method !== "cod") {
        await payOnline(order);
      }
      await refreshCart();
      router.push("/orders?success=true");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const shipping = cart.total >= 999 ? 0 : 99;
  const grandTotal = cart.total + shipping;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <h1 className="text-3xl font-bold mb-8">
        <span className="text-gradient">Checkout</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span>📍</span> Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-[var(--color-text)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-[var(--color-text)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">Address Line 1 *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={form.address_line1}
                    onChange={handleChange}
                    required
                    placeholder="House/Flat No., Street Name"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-[var(--color-text)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={form.address_line2}
                    onChange={handleChange}
                    placeholder="Landmark, Area (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-[var(--color-text)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-[var(--color-text)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-[var(--color-text)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-[var(--color-text)]"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span>💳</span> Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: "cod", label: "Cash on Delivery", icon: "💵" },
                  { value: "upi", label: "UPI Payment", icon: "📱" },
                  { value: "card", label: "Credit/Debit Card", icon: "💳" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      form.payment_method === method.value
                        ? "border-[var(--color-primary)] bg-amber-500/5"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.value}
                      checked={form.payment_method === method.value}
                      onChange={handleChange}
                      className="accent-amber-500"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.product_id} className="flex gap-3 items-center">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">₹{item.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <hr className="border-[var(--color-border)] mb-4" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Subtotal</span>
                  <span>₹{cart.total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <hr className="border-[var(--color-border)]" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-gradient">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? "Placing Order..." : `Place Order — ₹${grandTotal.toLocaleString("en-IN")}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
