import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NotificationPopup from "../components/NotificationPopup";
import SplashScreen from "../components/SplashScreen";
import { prisma } from "@/lib/prisma";

// 👈 شلنا سطر export const dynamic = 'force-dynamic'; من هون عشان ما يعمل خطأ

export const instant = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ali-Boss | متجرك الأول",
  description: "أفضل المنتجات بأفضل الأسعار",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ali-Boss",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  
  if (!settings) {
    settings = { 
      id: 'global', 
      siteName: 'Ali-Boss', 
      heroTitle: '', 
      heroSubtitle: '', 
      heroBtnText: '', 
      discountBadge: '', 
      whatsapp: '96170000000', 
      whishNumber: '0000000',
      email: 'info@aliboss.com' 
    };
  }

  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        
        <SplashScreen siteName={settings?.siteName || "Ali-Boss"} />

        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen relative">
              <Navbar siteName={settings?.siteName || "Ali-Boss"} />
              <main className="flex-grow">{children}</main>
              <Footer 
                whatsapp={settings?.whatsapp || ""} 
                email={settings?.email || ""} 
                siteName={settings?.siteName || "Ali-Boss"} 
              />
              <NotificationPopup />
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
