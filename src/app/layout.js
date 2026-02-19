// app/layout.js
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

// Font Configuration (Professional Way)
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata = {
  title: "My-E-Shop | Premium Lifestyle Store",
  description: "Curated collection of premium products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased font-sans min-h-screen flex flex-col">
        {/* Header Global Rahega */}
        <Header />
        
        {/* Main Content Dynamic Rahega */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer Global Rahega */}
        <Footer />
      </body>
    </html>
  );
}