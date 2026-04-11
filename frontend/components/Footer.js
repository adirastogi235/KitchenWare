import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍳</span>
              <span className="text-xl font-bold text-gradient">Rasoi Ghar</span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
              Your one-stop destination for premium kitchenware. From traditional cookware to modern appliances,
              we bring quality to your kitchen.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-[var(--color-text)]">Categories</h3>
            <ul className="space-y-2">
              {["Cookware", "Cutlery", "Storage", "Appliances"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat}`}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors text-sm"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[var(--color-text)]">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "All Products", href: "/products" },
                { name: "My Cart", href: "/cart" },
                { name: "My Orders", href: "/orders" },
                { name: "Wishlist", href: "/wishlist" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-[var(--color-text)]">Contact Us</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-center gap-2">
                <span>📧</span> adirastogi235@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> +91 8709572678
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span> Sakri, Kudra Kaimur, Bihar ,India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            © 2026 Rasoi Ghar. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Terms", "Privacy", "Shipping"].map((item) => (
              <span
                key={item}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
