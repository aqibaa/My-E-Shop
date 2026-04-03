import { getAdminProducts } from "@/lib/actions/admin.actions";
import ProductsClient from "@/components/admin/ProductsClient"

export const metadata = {
  title: 'Manage Products | Admin',
}

export default async function AdminProductsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = resolvedParams?.page ? Number(resolvedParams.page) : 1;
  const search = resolvedParams?.search || "";

  const { data, totalPages, currentPage, totalCount } = await getAdminProducts({ page, limit: 10, search });

  return (
    <ProductsClient 
      data={data} 
      totalPages={totalPages} 
      currentPage={currentPage} 
      totalCount={totalCount} 
      currentSearch={search} 
    />
  )
}