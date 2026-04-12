"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { productsApi, ordersApi } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const STATUS_COLORS = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  shipped: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function AdminPage() {
  const { user } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "", price: "", category: "Cookware", description: "",
    image_url: "", stock: "100", brand: "", material: "", featured: false,
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!user.is_admin) {
      router.push("/");
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        productsApi.getAll({ limit: 100 }),
        ordersApi.getAll(),
      ]);
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      };
      if (editId) {
        await productsApi.update(editId, data);
      } else {
        await productsApi.create(data);
      }
      setShowForm(false);
      setEditId(null);
      setForm({
        name: "", price: "", category: "Cookware", description: "",
        image_url: "", stock: "100", brand: "", material: "", featured: false,
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image_url: product.image_url,
      stock: product.stock.toString(),
      brand: product.brand || "",
      material: product.material || "",
      featured: product.featured,
    });
    setEditId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productsApi.delete(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user?.is_admin) return null;
  if (loading) return <LoadingSpinner size="lg" text="Loading admin data..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          Admin <span className="text-gradient">Dashboard</span>
        </h1>
        <div className="flex gap-2 bg-[var(--color-surface-2)] rounded-xl p-1">
          {["products", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                tab === t
                  ? "bg-[var(--color-surface)] shadow-sm text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {t} ({t === "products" ? products.length : orders.length})
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Products", value: products.length, icon: "📦", color: "from-blue-500 to-indigo-500" },
          { label: "Total Orders", value: orders.length, icon: "🛒", color: "from-green-500 to-emerald-500" },
          { label: "Revenue", value: `₹${orders.reduce((a, o) => a + o.total, 0).toLocaleString("en-IN")}`, icon: "💰", color: "from-emerald-500 to-teal-500" },
          { label: "Pending", value: orders.filter((o) => o.status === "pending").length, icon: "⏳", color: "from-purple-500 to-pink-500" },
        ].map((stat) => (
          <div key={stat.label} className="relative overflow-hidden bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/3 translate-x-1/3`}></div>
            <span className="text-2xl block mb-1">{stat.icon}</span>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Manage Products</h2>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditId(null);
                setForm({
                  name: "", price: "", category: "Cookware", description: "",
                  image_url: "", stock: "100", brand: "", material: "", featured: false,
                });
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              {showForm ? "Cancel" : "+ Add Product"}
            </button>
          </div>

          {/* Product Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 mb-6"
            >
              <h3 className="font-semibold mb-4">{editId ? "Edit Product" : "Add New Product"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-[var(--color-text)]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1">Price (₹) *</label>
                  <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-[var(--color-text)]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-[var(--color-text)]">
                    <option>Cookware</option>
                    <option>Cutlery</option>
                    <option>Storage</option>
                    <option>Appliances</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1">Stock *</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-[var(--color-text)]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1">Brand</label>
                  <input name="brand" value={form.brand} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-[var(--color-text)]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1">Material</label>
                  <input name="material" value={form.material} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-[var(--color-text)]" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1">Image URL *</label>
                  <input name="image_url" value={form.image_url} onChange={handleChange} required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-[var(--color-text)]" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none resize-none text-[var(--color-text)]" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                    className="accent-emerald-500 w-4 h-4" />
                  <label className="text-sm font-medium">Featured Product</label>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg transition-all duration-300">
                  {editId ? "Update Product" : "Add Product"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                  className="px-6 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Products Table */}
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Stock</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            {product.featured && (
                              <span className="text-xs text-emerald-500">⭐ Featured</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.category}</td>
                      <td className="px-4 py-3 text-sm font-semibold">₹{product.price.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(product)}
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(product.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Manage Orders</h2>
          {orders.length === 0 ? (
            <p className="text-center text-[var(--color-text-muted)] py-12">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)]">Order ID</p>
                        <p className="font-mono text-sm font-medium">{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)]">Date</p>
                        <p className="text-sm">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)]">Total</p>
                        <p className="text-sm font-bold text-gradient">₹{order.total.toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)]">Payment</p>
                        <p className="text-sm uppercase">{order.payment_method}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status]}`}
                      >
                        {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="text-sm text-[var(--color-text-muted)] mb-3">
                    <span className="font-medium text-[var(--color-text)]">Ship to:</span>{" "}
                    {order.shipping_address.full_name}, {order.shipping_address.address_line1},{" "}
                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-[var(--color-surface-2)] rounded-lg p-1.5 pr-3">
                        <img src={item.image_url} alt={item.name} className="w-8 h-8 object-cover rounded" />
                        <span className="text-xs">{item.name} ×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
