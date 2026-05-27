import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stickerverse USA — Custom Stickers, Banners & More",
  description: "High-quality custom stickers, banners, magnets, and laser engraving. Upload your design and get an instant proof.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased text-white" style={{ background: 'radial-gradient(ellipse 80% 50% at 15% 0%, rgba(80,60,200,0.07) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 85% 100%, rgba(40,20,120,0.05) 0%, transparent 55%), #060608' }}>
        <CartProvider>
          <Header />
          <div className="flex-1 pt-16">
            <div style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
              {children}
            </div>
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
