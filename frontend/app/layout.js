import "./globals.css";
import { AppProvider } from "@/lib/context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import WelcomeModal from "@/components/WelcomeModal";

export const metadata = {
  title: "रसोई घर - Premium Kitchenware Shop",
  description:
    "Your one-stop destination for premium kitchenware. From traditional Indian cookware to modern kitchen appliances, रसोई घर (Rasoi Ghar) brings quality to your kitchen.",
  keywords: "kitchenware, cookware, cutlery, kitchen appliances, rasoi ghar, रसोई घर, Indian kitchen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toast />
          <WelcomeModal />
        </AppProvider>
      </body>
    </html>
  );
}
