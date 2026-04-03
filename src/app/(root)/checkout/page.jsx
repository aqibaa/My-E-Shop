import { getStoreSettings } from "@/lib/actions/setting.actions";
import CheckOutDetail from "@/components/shared/CheckOutDetail"

export const metadata = {
  title: 'Checkout | My E-Shop',
}

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return (
    <CheckOutDetail 
      taxRate={settings?.taxRate || 8}
      shippingCost={settings?.shippingCost || 15} 
      isMaintenance={settings?.isMaintenance || false}
    />
  )
}