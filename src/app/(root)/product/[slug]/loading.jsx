import { Separator } from "@/components/ui/separator"

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 animate-pulse">
       <div className="h-4 w-64 bg-gray-200 rounded mb-8" />
       
       <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
      
          <div className="flex flex-1 flex-col gap-4">
             <div className="aspect-square w-full bg-gray-200 rounded-2xl" />
             <div className="flex gap-3">
                <div className="size-20 bg-gray-200 rounded-xl" />
                <div className="size-20 bg-gray-200 rounded-xl" />
                <div className="size-20 bg-gray-200 rounded-xl" />
             </div>
          </div>
          
          <div className="flex flex-1 flex-col gap-6 pt-4">
             <div className="h-10 w-3/4 bg-gray-200 rounded" />
             
             <div className="flex items-center gap-4">
                <div className="h-6 w-1/4 bg-gray-200 rounded" />
                <div className="h-8 w-1/3 bg-gray-200 rounded" />
             <Separator className="my-2" />
             </div>

             
             <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
             </div>
             
             <div className="flex gap-4 mt-8">
                <div className="h-14 flex-1 bg-gray-200 rounded-xl" />
                <div className="h-14 w-16 bg-gray-200 rounded-xl" />
             </div>
             
             <div className="space-y-4 mt-4">
                <div className="h-12 w-full bg-gray-200 rounded-lg" />
                <div className="h-12 w-full bg-gray-200 rounded-lg" />
             </div>
          </div>
       </div>
    </div>
  )
}