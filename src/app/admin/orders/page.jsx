import { getAllAdminOrders } from "@/lib/actions/order.actions"
import OrdersClient from "@/components/admin/OrdersClient"

export const metadata = {
  title: 'Manage Orders | Admin',
}

export default async function AdminOrdersPage() {
  const orders = await getAllAdminOrders();

  return (
    <OrdersClient orders={orders} />
  )
}