"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Store, Mail, Truck, Receipt, AlertTriangle, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { updateStoreSettings } from "@/lib/actions/setting.actions"

export default function SettingsClient({initialData}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMaintenance, setIsMaintenance] = useState(initialData?.isMaintenance || false)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      storeName: initialData?.storeName || "",
      supportEmail: initialData?.supportEmail || "",
      taxRate: initialData?.taxRate || 0,
      shippingCost: initialData?.shippingCost || 0,
    }
  })

   const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await updateStoreSettings({
          ...data,
          isMaintenance: isMaintenance
      });
      
      toast.success("Settings updated successfully! Changes applied globally.")
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

           <div className={`rounded-2xl border shadow-sm p-6 sm:p-8 transition-colors ${isMaintenance ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-4">
             <div className={`${isMaintenance ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'} p-2 rounded-xl`}><AlertTriangle className="w-5 h-5" /></div>
             <h2 className={`text-lg font-semibold ${isMaintenance ? 'text-red-800' : 'text-gray-800'}`}>Maintenance Mode</h2>
          </div>
          <Separator className={isMaintenance ? 'bg-red-100 mb-4' : 'bg-gray-200 mb-4'} />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
                 <p className="font-medium text-foreground">
                    Status: {isMaintenance ? <span className="text-red-600 font-bold">Active</span> : <span className="text-green-600 font-bold">Inactive</span>}
                 </p>
                 <p className="text-sm text-muted-foreground mt-1">If active, normal users will not be able to checkout.</p>
             </div>
             <Button 
                type="button" 
                variant={isMaintenance ? "outline" : "destructive"} 
                className={`rounded-xl ${isMaintenance ? 'border-red-200 text-red-600 hover:bg-red-100' : ''}`}
                onClick={() => setIsMaintenance(!isMaintenance)} // Toggle Function
             >
                 {isMaintenance ? "Disable Maintenance" : "Enable Maintenance"}
             </Button>
          </div>
        </div>

        {/* Action Buttons */}
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