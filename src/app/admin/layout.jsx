import { checkAdmin } from "../(root)/lib/admin";
import AdminSidebar from "../../components/admin/AdminSidebar";
export default async function AdminLayout({ children }) {
  await checkAdmin();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/30 w-full">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[100vw]">{children}</div>
    </div>
  )
}