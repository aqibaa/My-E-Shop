import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

// Font Configuration (Professional Way)
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata = {
  title: "My-E-Shop | Premium Lifestyle Store",
  description: "Curated collection of premium products.",
};
export const viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased font-sans min-h-screen flex flex-col">
        <Header />
        <TooltipProvider>
          <main className="flex-1">
            {children}
          </main>
        </TooltipProvider>
        <Footer />
      </body>
    </html>
  );
}