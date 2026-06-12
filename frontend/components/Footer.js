import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-[#1a1410] font-bold text-sm">
                रग
              </div>
              <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">रसोई घर</span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
              परंपरा से आधुनिकता तक—आपकी रसोई के लिए premium kitchenware का अनूठा संग्रह।
            </p>
            <div className="flex gap-3">
              {[
                { icon: "f", href: "#" },
                { icon: "i", href: "#" },
                { icon: "t", href: "#" },
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] transition-colors duration-300"
                >
                  <span className="text-xs font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-[var(--color-text)] text-sm uppercase tracking-widest mb-6">
              Shop
            </h3>
            <ul className="space-y-3">
              {["Cookware", "Cutlery", "Storage", "Appliances"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat}`}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[var(--color-text)] text-sm uppercase tracking-widest mb-6">
              Account
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Browse Products", href: "/products" },
                { name: "My Cart", href: "/cart" },
                { name: "My Orders", href: "/orders" },
                { name: "Wishlist", href: "/wishlist" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[var(--color-text)] text-sm uppercase tracking-widest mb-6">
              Contact
            </h3>
            <ul className="space-y-4 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-[var(--color-primary)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>rasoighar@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-[var(--color-primary)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 8709572678</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-[var(--color-primary)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Bihar, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-border)] mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              &copy; 2026 रसोई घर. सर्वाधिकार सुरक्षित।
            </p>
            <div className="flex gap-6">
              {["Terms", "Privacy", "Shipping"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
