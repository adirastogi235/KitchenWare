"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productsApi } from "@/lib/api";
import { useApp } from "@/lib/context";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, addToCart, toggleWishlist, wishlist } = useApp();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const inWishlist = wishlist.some((p) => p.id === params.id);

  useEffect(() => {
    const load = async () => {
      try {
        const [prod, revs] = await Promise.all([
          productsApi.getOne(params.id),
          productsApi.getReviews(params.id),
        ]);
        setProduct(prod);
        setReviews(revs);
      } catch {
        router.push("/products");
      }
      setLoading(false);
    };
    load();
  }, [params.id, router]);

  const handleAddToCart = async () => {
    if (!user) return router.push("/auth");
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
    } catch (err) {
      alert(err.message);
    }
    setAdding(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return router.push("/auth");
    setSubmittingReview(true);
    try {
      await productsApi.addReview(params.id, {
        product_id: params.id,
        ...reviewForm,
      });
      const [updatedProduct, updatedReviews] = await Promise.all([
        productsApi.getOne(params.id),
        productsApi.getReviews(params.id),
      ]);
      setProduct(updatedProduct);
      setReviews(updatedReviews);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      alert(err.message);
    }
    setSubmittingReview(false);
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading product..." />;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-8">
        <button onClick={() => router.push("/")} className="hover:text-[var(--color-primary)] transition-colors">
          Home
        </button>
        <span>/</span>
        <button onClick={() => router.push("/products")} className="hover:text-[var(--color-primary)] transition-colors">
          Products
        </button>
        <span>/</span>
        <button
          onClick={() => router.push(`/products?category=${product.category}`)}
          className="hover:text-[var(--color-primary)] transition-colors"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-[var(--color-text)] font-medium truncate">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden bg-[var(--color-surface-2)] aspect-square">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.featured && (
            <span className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-full shadow-lg">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-[var(--color-primary)] bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-sm text-[var(--color-text-muted)] bg-[var(--color-surface-2)] px-3 py-1 rounded-full">
                {product.brand}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(product.avg_rating) ? "text-amber-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-[var(--color-text-muted)]">
              {product.avg_rating.toFixed(1)} ({product.num_reviews} reviews)
            </span>
          </div>

          <div className="text-4xl font-bold text-gradient mb-6">
            ₹{product.price.toLocaleString("en-IN")}
          </div>

          <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {product.material && (
              <div className="bg-[var(--color-surface-2)] rounded-xl p-3">
                <span className="text-xs text-[var(--color-text-muted)] block">Material</span>
                <span className="font-medium">{product.material}</span>
              </div>
            )}
            <div className="bg-[var(--color-surface-2)] rounded-xl p-3">
              <span className="text-xs text-[var(--color-text-muted)] block">Availability</span>
              <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center rounded-xl border border-[var(--color-border)] overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-[var(--color-surface-2)] transition-colors text-lg font-medium"
              >
                −
              </button>
              <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-3 hover:bg-[var(--color-surface-2)] transition-colors text-lg font-medium"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              id="add-to-cart-detail"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 active:scale-[0.98]"
            >
              {adding ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              onClick={() => user ? toggleWishlist(product.id) : router.push("/auth")}
              className={`p-3.5 rounded-xl border-2 transition-all duration-300 ${
                inWishlist
                  ? "border-red-400 bg-red-50 dark:bg-red-500/10 text-red-500"
                  : "border-[var(--color-border)] hover:border-red-400 text-[var(--color-text-muted)] hover:text-red-500"
              }`}
            >
              <svg className="w-6 h-6" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--color-border)] mb-8">
        <div className="flex gap-8">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {tab === "reviews" ? `Reviews (${reviews.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "description" && (
        <div className="prose max-w-none text-[var(--color-text-muted)] leading-relaxed">
          <p>{product.description}</p>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-8">
          {/* Write Review */}
          {user && (
            <form
              onSubmit={handleSubmitReview}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6"
            >
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="text-sm text-[var(--color-text-muted)] block mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1"
                    >
                      <svg
                        className={`w-7 h-7 ${star <= reviewForm.rating ? "text-amber-400" : "text-gray-300"} transition-colors`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none resize-none h-24 text-[var(--color-text)]"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                        {review.user_name[0]}
                      </div>
                      <div>
                        <span className="font-medium">{review.user_name}</span>
                        <div className="flex mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-3.5 h-3.5 ${star <= review.rating ? "text-amber-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-[var(--color-text-muted)] text-sm">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[var(--color-text-muted)] py-8">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
