import { getAllProducts } from "@/lib/actions/product.actions"
import AllProductsClient from "@/components/shared/all-products-client"

export const metadata = {
  title: 'All Products - My E-Shop',
  description: 'Browse our latest collection of premium products.'
}

export default async function ProductsPage() {
  // 1. Database se products fetch karein
  const products = await getAllProducts();

  // 2. Client Component ko pass karein
  return (
    <AllProductsClient products={products} />
  )
}