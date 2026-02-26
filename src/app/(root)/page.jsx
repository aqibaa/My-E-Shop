import ProductCard from '@/components/shared/Product-card'
import { getAllProducts } from '@/lib/actions/product.actions'

export default async function Home() {
  const products = await getAllProducts();
  

  return (
    <>      
      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-4">Latest Arrivals</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>No products found</p>
        )}
      </section>
    </>
  )
}