import { getDashboardData } from "@/lib/actions/admin.actions"
import DashboardClient from "../../components/admin/DashboardClient";
export const metadata = {
  title: 'Admin Dashboard | Overview',
}

export default async function AdminPage() {
  const data = await getDashboardData();

  return (
    <DashboardClient 
      stats={data.stats} 
      recentOrders={data.recentOrders} 
      products={data.products} 
    />
  )
}