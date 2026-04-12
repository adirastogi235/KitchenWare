const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Something went wrong");
  }

  return res.json();
}

// Auth
export const authApi = {
  sendOtp: (phone) => request("/auth/send-otp", { method: "POST", body: JSON.stringify({ phone }) }),
  verifyOtp: (data) => request("/auth/verify-otp", { method: "POST", body: JSON.stringify(data) }),
  getProfile: () => request("/auth/me"),
  updateProfile: (data) => request("/auth/me", { method: "PUT", body: JSON.stringify(data) }),
};

// Products
export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") query.append(key, val);
    });
    const qs = query.toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  getOne: (id) => request(`/products/${id}`),
  getCategories: () => request("/products/categories"),
  create: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
  getReviews: (id) => request(`/products/${id}/reviews`),
  addReview: (id, data) => request(`/products/${id}/reviews`, { method: "POST", body: JSON.stringify(data) }),
};

// Cart
export const cartApi = {
  get: () => request("/cart"),
  add: (product_id, quantity = 1) => request("/cart/add", { method: "POST", body: JSON.stringify({ product_id, quantity }) }),
  update: (product_id, quantity) => request(`/cart/update/${product_id}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
  remove: (product_id) => request(`/cart/remove/${product_id}`, { method: "DELETE" }),
  clear: () => request("/cart/clear", { method: "DELETE" }),
};

// Orders
export const ordersApi = {
  create: (data) => request("/orders", { method: "POST", body: JSON.stringify(data) }),
  getMy: () => request("/orders"),
  getAll: () => request("/orders/all"),
  getOne: (id) => request(`/orders/${id}`),
  updateStatus: (id, status) => request(`/orders/${id}/status?status=${status}`, { method: "PUT" }),
};

// Payments
export const paymentsApi = {
  create: (order_id) => request("/payments/create", { method: "POST", body: JSON.stringify({ order_id }) }),
  verify: (data) => request("/payments/verify", { method: "POST", body: JSON.stringify(data) }),
  markFailed: (order_id) => request(`/payments/${order_id}/failed`, { method: "POST" }),
};

// Wishlist
export const wishlistApi = {
  get: () => request("/wishlist"),
  add: (product_id) => request(`/wishlist/${product_id}`, { method: "POST" }),
  remove: (product_id) => request(`/wishlist/${product_id}`, { method: "DELETE" }),
};
