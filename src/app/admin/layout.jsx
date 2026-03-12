import { checkAdmin } from "../(root)/lib/admin";
import AdminSidebar from "../../components/admin/AdminSidebar";
export default async function AdminLayout({ children }) {
  await checkAdmin(); 

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
     <AdminSidebar /> 
      <div className="flex-1 p-6 lg:p-8 bg-gray-50/30">{children}</div>
    </div>
  )
}