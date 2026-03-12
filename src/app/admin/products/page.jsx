import { getAllProducts } from "@/lib/actions/product.actions"
import ProductsClient from "@/components/admin/ProductsClient"

export const metadata = {
  title: 'Manage Products | Admin',
}

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <ProductsClient data={products} />
  )
}