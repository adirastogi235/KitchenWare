"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useApp();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🍳</span>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? "Welcome back!" : "Create an account"}
          </h1>
          <p className="text-[var(--color-text-muted)]">
            {isLogin
              ? "Sign in to your Rasoi Ghar account"
              : "Join Rasoi Ghar for the best kitchenware"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 shadow-xl shadow-black/5">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Priya Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-[var(--color-text)]"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="priya@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-[var(--color-text)]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-1.5">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-[var(--color-text)]"
              />
            </div>

            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-[var(--color-primary)] font-medium hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">Demo Credentials:</p>
            <div className="text-xs text-[var(--color-text-muted)] space-y-1">
              <p>
                <span className="font-medium">Admin:</span> admin@rasoighar.com / admin123
              </p>
              <p>
                <span className="font-medium">User:</span> priya@example.com / password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
