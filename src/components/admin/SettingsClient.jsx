"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Store, Mail, Truck, Receipt, AlertTriangle, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// note abhi yh page demi data say bnaya h kl me isko complete kr dyn ga inshAllah

export default function SettingsClient() {
  const [isLoading, setIsLoading] = useState(false)

  // Default values set ki hain jo inputs mein pehle se bhari hongi
  const { register, handleSubmit } = useForm({
    defaultValues: {
      storeName: "My E-Shop",
      supportEmail: "support@myeshop.com",
      taxRate: "8",
      shippingCost: "15",
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Yahan actual API call aayegi future mein
      // await updateStoreSettings(data);
      
      // Fake delay take loading animation show ho (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      console.log("Saved Settings:", data)
      toast.success("Settings updated successfully!")
    } catch (error) {
      toast.error("Failed to update settings.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">Store Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-blue-50 text-blue-600 p-2 rounded-xl"><Store className="w-5 h-5" /></div>
             <h2 className="text-lg font-semibold text-foreground">General Information</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input {...register("storeName", { required: true })} className="rounded-xl" />
              <p className="text-xs text-muted-foreground">This name appears on the header and emails.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Support Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" {...register("supportEmail")} className="rounded-xl pl-9" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-green-50 text-green-600 p-2 rounded-xl"><Receipt className="w-5 h-5" /></div>
             <h2 className="text-lg font-semibold text-foreground">Financial & Shipping</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Default Tax Rate (%)</Label>
              <div className="relative">
                <Input type="number" step="0.1" {...register("taxRate")} className="rounded-xl pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Flat Shipping Cost ($)</Label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="number" step="0.1" {...register("shippingCost")} className="rounded-xl pl-9" />
              </div>
              <p className="text-xs text-muted-foreground">Orders above $100 get free shipping automatically.</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50/50 rounded-2xl border border-red-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-red-100 text-red-600 p-2 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
             <h2 className="text-lg font-semibold text-red-800">Danger Zone</h2>
          </div>
          <Separator className="bg-red-100 mb-4" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
                 <p className="font-medium text-foreground">Maintenance Mode</p>
                 <p className="text-sm text-muted-foreground">Temporarily disable checkout for all users.</p>
             </div>
             <Button type="button" variant="destructive" className="rounded-xl">
                 Enable Maintenance
             </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
           <Button type="submit" size="lg" disabled={isLoading} className="rounded-xl px-8 h-12 text-md">
              {isLoading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving Changes...</>
              ) : (
                <><Save className="w-5 h-5 mr-2" /> Save Settings</>
              )}
           </Button>
        </div>

      </form>
    </div>
  )
}