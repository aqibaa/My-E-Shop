import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/actions/order.actions" // Action import karein
import { CheckCircle2, MapPin, Package, CreditCard, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default async function OrderDetailsPage({ params }) {
  const { id } = await params
  
  const order = await getOrderById(id);

  if (!order) return notFound(); 
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shippingAddress = JSON.parse(order.shippingAddress);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-green-100 p-3 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Thank you for your order!</h1>
        <p className="text-gray-500 mt-2">
           Order <span className="font-mono font-medium text-black">#{order.id}</span> has been placed.
        </p>
        <p className="text-sm text-gray-400 mt-1">
           A confirmation email has been sent to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <Package className="w-5 h-5 text-blue-600" /> Order Items
              </h2>
              <div className="space-y-4">
                 {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-2">
                       <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                       </div>
                       <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                       </div>
                       <p className="font-medium text-sm">
                          ${(Number(item.price) * item.qty).toFixed(2)}
                       </p>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Info */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                 <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" /> Shipping
                 </h2>
                 <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                 <p className="text-gray-600 text-sm mt-1">
                    {shippingAddress.address}, {shippingAddress.city}<br/>
                    {shippingAddress.zip}, {shippingAddress.country || 'USA'}
                 </p>
                 <p className="text-gray-600 text-sm mt-2">{shippingAddress.phone}</p>
                 
                 <div className="mt-4">
                    {order.isDelivered ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Delivered</Badge>
                    ) : (
                        <Badge variant="secondary" className="text-orange-600 bg-orange-50">Not Delivered</Badge>
                    )}
                 </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                 <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" /> Payment
                 </h2>
                 <p className="text-sm text-gray-600">Method: <span className="font-medium text-black">{order.paymentMethod}</span></p>
                 <p className="text-sm text-gray-600 mt-1">Date: {formatDate(order.createdAt)}</p>
                 
                 <div className="mt-4">
                    {order.isPaid ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
                    ) : (
                        <Badge variant="secondary" className="text-red-600 bg-red-50">Not Paid</Badge>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
           <div className="bg-gray-50 rounded-2xl p-6 border sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                    <span className="text-gray-500">Items</span>
                    <span>${Number(order.itemsPrice).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span>${Number(order.shippingPrice).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span>${Number(order.taxPrice).toFixed(2)}</span>
                 </div>
                 <Separator className="my-2" />
                 <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${Number(order.totalPrice).toFixed(2)}</span>
                 </div>
              </div>

              {/* Action Buttons */}
              {!order.isPaid && (
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700" size="lg">
                     Pay Now
                  </Button>
              )}
              
              <Link href="/products">
                 <Button variant="outline" className="w-full mt-3">
                    Continue Shopping
                 </Button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  )
}
