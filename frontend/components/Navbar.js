"use client";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Products", href: "/products" },
  { label: "Cookware", href: "/products?category=Cookware" },
  { label: "Cutlery", href: "/products?category=Cutlery" },
  { label: "Storage", href: "/products?category=Storage" },
  { label: "Appliances", href: "/products?category=Appliances" },
  { label: "Puja", href: "/products?category=Puja" },
];

export default function Navbar() {
  const { user, cart, logout, darkMode, toggleDarkMode } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart?.items?.length || 0;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[var(--color-border)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-xl font-bold tracking-tight">रसोई घर</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="dark-mode-toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-[var(--color-surface-2)] transition-colors duration-200"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {user && (
              <>
                <Link
                  href="/wishlist"
                  className="p-2 rounded-full hover:bg-[var(--color-surface-2)] transition-colors duration-200"
                  title="Wishlist"
                >
                  <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>

                <Link
                  href="/cart"
                  className="p-2 rounded-full hover:bg-[var(--color-surface-2)] transition-colors duration-200 relative"
                  title="Cart"
                >
                  <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/orders"
                  className="p-2 rounded-full hover:bg-[var(--color-surface-2)] transition-colors duration-200"
                  title="My Orders"
                >
                  <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </Link>
              </>
            )}

            {user?.is_admin && (
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium hover:bg-violet-500/20 transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <span className="hidden md:inline text-sm text-[var(--color-text-muted)]">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  id="logout-button"
                  onClick={logout}
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="ml-1 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}

            <button
              className="md:hidden p-2 rounded-full hover:bg-[var(--color-surface-2)]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--color-border)] mt-2 pt-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-2.5 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] transition-colors font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user?.is_admin && (
              <Link
                href="/admin"
                className="block px-4 py-2.5 rounded-xl text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 transition-colors font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
