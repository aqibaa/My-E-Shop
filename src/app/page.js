import Hero from "@/components/shared/Hero";
import { FeaturedCategories } from "@/components/shared/Featured-categories"; 
import { PromoBanner } from "@/components/shared/Promo-banner";
import { ProductsGrid } from "@/components/shared/Product-grid";
import { getAllProducts } from "@/lib/actions/product.actions";

// Cache this page for 1 hour to save database reads (Good for production)
export const revalidate = 3600;

export const metadata = {
  title: 'My E-Shop | Home',
}

export default async function Home() {
  // 1. Fetch Latest Arrivals (Recent 8 products)
  const recentResponse = await getAllProducts({ limit: 8, page: 1 });
  const latestProducts = recentResponse?.data || [];

  // 2. Fetch Best Sellers (Iske liye humein backend mein query change karni hogi, 
  // lekin abhi ke liye hum next 8 products utha lete hain as "Best Sellers" just to show different data)
  const bestSellerResponse = await getAllProducts({ limit: 8, page: 2 });
  const bestSellers = bestSellerResponse?.data || [];

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* 1. HERO SECTION */}
      <Hero />
      
      {/* 2. CATEGORIES SECTION */}
      <div className="mt-8">
        <FeaturedCategories />
      </div>

      {/* 3. NEW ARRIVALS GRID */}
      <section className="wrapper max-w-7xl mx-auto px-4 w-full">
        {/* NAYA: Pass products array directly to Grid */}
        <ProductsGrid
          title="New Arrivals"
          subtitle="The latest additions to our collection"
          products={latestProducts} 
        />
      </section>

      {/* 4. PROMO BANNER */}
      <PromoBanner />

      {/* 5. BEST SELLERS GRID */}
      <section className="wrapper max-w-7xl mx-auto px-4 w-full">
        {/* NAYA: Pass the second array of products here */}
        <ProductsGrid
          title="Best Seller"
          subtitle="Most Loved By Our Customers"
          products={bestSellers} 
        />
      </section>
    </div>
  );
}