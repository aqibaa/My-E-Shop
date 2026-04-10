export const revalidate = 3600;
import { getAllProducts } from "@/lib/actions/product.actions"
import AllProductsClient from "@/components/shared/all-products-client"

export const metadata = {
  title: 'All Products - My E-Shop',
  description: 'Browse our latest collection of premium products.'
}

export default async function ProductsPage({ searchParams }) {

  const resolvedParams = await searchParams;

  const searchQuery = resolvedParams?.search || "";
  const categoryQuery = resolvedParams?.category || "";
  const sortQuery = resolvedParams?.sort || "newest";
  const pageQuery = resolvedParams?.page ? Number(resolvedParams.page) : 1;
  const brandQuery = resolvedParams?.brand || "";

  const { data, totalPages, currentPage, availableCategories, availableBrands } = await getAllProducts({
    query: searchQuery,
    sort: sortQuery,
     brand: brandQuery,
    category: categoryQuery,
    page: pageQuery,
    limit: 12
  });

  return (
    <AllProductsClient
      products={data}
      totalPages={totalPages}
      currentPage={currentPage}
      globalCategories={availableCategories} 
       globalBrands={availableBrands}
      />
  )
}