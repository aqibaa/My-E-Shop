import { getProductBySlug, getRelatedProducts } from "@/lib/actions/product.actions"
import ProductDetails from "@/components/shared/product-details" // Import new client component

// SEO Metadata (Optional but good)
export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Product Not Found" }
  return {
    title: `${product.name} - My Shop`,
    description: product.description
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  
  // 1. Fetch Product from DB
  const product = await getProductBySlug(slug)
  
  if (!product) {
      return <div className="p-20 text-center font-bold text-xl">Product Not Found</div>
  }

  // 2. Fetch Related Products from DB
  const relatedProducts = await getRelatedProducts({
    categoryId: product.category,
    productId: product.id
  })

  // 3. Pass data to Client Component
  return (
    <ProductDetails 
       product={product} 
       relatedProducts={relatedProducts} 
    />
  )
}