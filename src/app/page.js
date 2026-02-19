import Hero from "@/components/shared/Hero";
import { FeaturedCategories } from "@/components/shared/Featured-categories"; // Make sure to create this file based on your old code
import { PromoBanner } from "@/components/shared/Promo-banner";
import { ProductsGrid } from "@/components/shared/Product-grid";



export default function Home() {
  return (
    <>
      <Hero />

      {/* Category Section */}
      <div className="my-16">
        <FeaturedCategories></FeaturedCategories>
      </div>

      {/* New Arrivals Section */}
      <section className="wrapper max-w-7xl mx-auto px-4 py-16">
       <ProductsGrid
        title="New Arrivals"
        subtitle="The latest additions to our collection"
      />
      </section>
      <PromoBanner></PromoBanner>
        <section className="wrapper max-w-7xl mx-auto px-4 py-16">
       <ProductsGrid
        title="Best Seller"
        subtitle="Most Loved By Our Customer"
      />
      </section>
    </>
  );
}