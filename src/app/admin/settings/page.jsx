import { getStoreSettings } from "@/lib/actions/setting.actions";
import SettingsClient from "@/components/admin/SettingsClient"

export const metadata = {
  title: 'Settings | Admin',
}

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings(); 

  return (
    <SettingsClient initialData={settings} />
  )
}