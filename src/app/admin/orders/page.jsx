import { getAdminOrdersPaginated } from "@/lib/actions/admin.actions"
import OrdersClient from "@/components/admin/OrdersClient"

export const metadata = {
  title: 'Manage Orders | Admin',
}

export default async function AdminOrdersPage({ searchParams }) {
  const resolvedParams = await searchParams;
  
  const page = resolvedParams?.page ? Number(resolvedParams.page) : 1;
  const search = resolvedParams?.search || "";
  const status = resolvedParams?.status || "all";

  // Fetch paginated orders (10 per page)
  const { data, totalPages, currentPage, totalCount } = await getAdminOrdersPaginated({ 
      page, 
      limit: 10, 
      search,
      status
  });

  return (
    <OrdersClient 
       orders={data} 
       totalPages={totalPages} 
       currentPage={currentPage} 
       totalCount={totalCount} 
       currentSearch={search} 
       currentStatus={status}
    />
  )
}