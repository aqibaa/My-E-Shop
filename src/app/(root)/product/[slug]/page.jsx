import { getProductBySlug, getRelatedProducts } from "@/lib/actions/product.actions"
import ProductDetails from "@/components/shared/product-details" 



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

  const product = await getProductBySlug(slug)

  if (!product) {
    return <div className="p-20 text-center font-bold text-xl">Product Not Found</div>
  }

  const relatedProducts = await getRelatedProducts({
    categoryId: product.category,
    productId: product.id
  })

  return (
    <ProductDetails
      product={product}
      relatedProducts={relatedProducts}
    />
  )
}
