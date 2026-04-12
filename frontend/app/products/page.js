"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSpinner";
import { productsApi } from "@/lib/api";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    productsApi.getCategories().then((data) => setCategories(data.categories)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort_by: sortBy };
      if (category) params.category = category;
      if (search) params.search = search;
      if (minPrice) params.min_price = parseFloat(minPrice);
      if (maxPrice) params.max_price = parseFloat(maxPrice);
      const data = await productsApi.getAll(params);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [category, search, sortBy, minPrice, maxPrice]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <span className="text-sm font-semibold tracking-widest uppercase text-emerald-600">Browse</span>
        <h1 className="text-3xl md:text-5xl font-bold mt-2 tracking-tight">
          {category ? (
            <>
              <span className="text-gradient">{category}</span> Collection
            </>
          ) : (
            <>
              All <span className="text-gradient">Products</span>
            </>
          )}
        </h1>
        <p className="text-[var(--color-text-muted)] mt-2">
          {loading ? "Loading..." : `${products.length} products found`}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="product-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-[var(--color-text)]"
          />
        </div>

        <select
          id="product-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-emerald-400 outline-none text-[var(--color-text)] cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
          <option value="rating">Best Rated</option>
        </select>

        <button
          className="md:hidden px-4 py-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] font-medium flex items-center gap-2 justify-center"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside className={`${filtersOpen ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-[var(--color-text-muted)]">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory("")}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    !category
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                      category === cat
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-[var(--color-text-muted)]">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm outline-none focus:border-emerald-400 text-[var(--color-text)]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm outline-none focus:border-emerald-400 text-[var(--color-text)]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setCategory("");
                setSearch("");
                setMinPrice("");
                setMaxPrice("");
                setSortBy("newest");
              }}
              className="w-full py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:border-rose-300 hover:text-rose-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(9)].map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <span className="text-6xl block mb-4">🔍</span>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-[var(--color-text-muted)]">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
