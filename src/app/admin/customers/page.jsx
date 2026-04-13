import { getAdminCustomersPaginated } from "@/lib/actions/admin.actions"
import CustomersClient from "@/components/admin/CustomersClient"

export const metadata = {
  title: 'Customers | Admin',
}

export default async function AdminCustomersPage({ searchParams }) {
  const resolvedParams = await searchParams;
  
  const page = resolvedParams?.page ? Number(resolvedParams.page) : 1;
  const search = resolvedParams?.search || "";

  const { data, totalPages, currentPage, totalCount } = await getAdminCustomersPaginated({ 
      page, 
      limit: 10, 
      search 
  });



  return (
    <CustomersClient 
       customers={data} 
       totalPages={totalPages} 
       currentPage={currentPage} 
       totalCount={totalCount} 
       currentSearch={search} 
    />
  )
}