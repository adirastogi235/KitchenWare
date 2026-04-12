"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, cartApi, wishlistApi } from "@/lib/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0 });
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant, id: Date.now() });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", next);
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      // Load cart & wishlist
      try {
        const c = await cartApi.get();
        setCart(c);
      } catch {}
      try {
        const w = await wishlistApi.get();
        setWishlist(w);
      } catch {}
    } catch {
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const checkPhone = async (phone) => {
    return await authApi.checkPhone(phone);
  };

  const verifyFirebaseToken = async (firebaseToken, name) => {
    const payload = { firebase_token: firebaseToken };
    if (name) payload.name = name;
    const data = await authApi.verifyFirebase(payload);
    localStorage.setItem("token", data.access_token);
    setUser(data.user);
    try {
      const c = await cartApi.get();
      setCart(c);
    } catch {}
    try {
      const w = await wishlistApi.get();
      setWishlist(w);
    } catch {}
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCart({ items: [], total: 0, item_count: 0 });
    setWishlist([]);
  };

  const refreshCart = async () => {
    try {
      const c = await cartApi.get();
      setCart(c);
    } catch {}
  };

  const refreshWishlist = async () => {
    try {
      const w = await wishlistApi.get();
      setWishlist(w);
    } catch {}
  };

  const addToCart = async (productId, qty = 1) => {
    const c = await cartApi.add(productId, qty);
    setCart(c);
    showToast("Added to cart");
  };

  const updateCartItem = async (productId, qty) => {
    const c = await cartApi.update(productId, qty);
    setCart(c);
  };

  const removeFromCart = async (productId) => {
    const c = await cartApi.remove(productId);
    setCart(c);
  };

  const toggleWishlist = async (productId) => {
    const inWishlist = wishlist.some((p) => p.id === productId);
    if (inWishlist) {
      await wishlistApi.remove(productId);
    } else {
      await wishlistApi.add(productId);
    }
    await refreshWishlist();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        wishlist,
        loading,
        darkMode,
        toggleDarkMode,
        checkPhone,
        verifyFirebaseToken,
        logout,
        addToCart,
        updateCartItem,
        removeFromCart,
        refreshCart,
        toggleWishlist,
        refreshWishlist,
        toast,
        showToast,
        dismissToast: () => setToast(null),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
