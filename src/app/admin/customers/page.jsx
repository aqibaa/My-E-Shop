import { getAllCustomers } from "@/lib/actions/admin.actions"
import CustomersClient from "@/components/admin/CustomersClient"

export const metadata = {
  title: 'Customers | Admin',
}

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();

  return (
    <CustomersClient customers={customers} />
  )
}