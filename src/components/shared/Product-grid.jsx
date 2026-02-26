import ProductCard from "./Product-card";
import { getAllProducts } from "@/lib/actions/product.actions";


export async function ProductsGrid({ title, subtitle }) {

  const products = await getAllProducts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No products found.</p>
        </div>
      )}

    </section>
  )
}
