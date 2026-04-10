import { getStoreSettings } from "@/lib/actions/setting.actions";
import CheckOutDetail from "@/components/shared/CheckOutDetail"
import { getUserAddresses } from "@/lib/actions/user.actions"

export const metadata = {
  title: 'Checkout | My E-Shop',
}

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

   let savedAddress = null;
  try {
    const addresses = await getUserAddresses();
    if (addresses && addresses.length > 0) {
      savedAddress = addresses.find(a => a.isDefault) || addresses[0];
    }
  } catch (error) {
    console.error("User not logged in or address fetch failed");
  }

  return (
    <CheckOutDetail 
      taxRate={settings?.taxRate || 8}
      shippingCost={settings?.shippingCost || 15} 
      isMaintenance={settings?.isMaintenance || false}
      defaultAddress={savedAddress}
    />
  )
}