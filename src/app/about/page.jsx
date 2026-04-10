import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Truck, ShieldCheck, HeartHandshake } from "lucide-react"

export const metadata = {
  title: 'About Us | My E-Shop',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col pb-16">
      <section className="relative h-[40vh] w-full bg-gray-900 flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 opacity-40">
            <Image 
            src="/store.jpg"
              alt="About Us Hero" 
              fill 
              className="object-cover" 
            />
         </div>
         <div className="relative z-10 text-center text-white px-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
               Delivering premium quality products with an unforgettable shopping experience since 2024.
            </p>
         </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
         <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Who We Are</h2>
         <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            At My E-Shop, we believe that shopping should be simple, fast, and enjoyable. We started with a simple idea: to bring the world's best brands and high-quality products directly to your doorstep. We carefully curate our collection to ensure that every item meets our strict standards for quality and design.
         </p>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-16">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="font-serif text-3xl font-bold text-foreground">Our Core Values</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                  <div className="mx-auto w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                     <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                  <p className="text-muted-foreground text-sm">We never compromise on the quality of our products. You get exactly what you see.</p>
               </div>
               
               <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                  <div className="mx-auto w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                     <Truck className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
                  <p className="text-muted-foreground text-sm">Our logistics network ensures your orders reach you in the shortest time possible.</p>
               </div>

               <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                  <div className="mx-auto w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6">
                     <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Secure Shopping</h3>
                  <p className="text-muted-foreground text-sm">Your data and payments are protected with industry-leading security standards.</p>
               </div>

               <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                  <div className="mx-auto w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                     <HeartHandshake className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Customer First</h3>
                  <p className="text-muted-foreground text-sm">We are here for you 24/7. Your satisfaction is our ultimate priority.</p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
         <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Ready to upgrade your lifestyle?</h2>
         <Link href="/product">
            <Button size="lg" className="rounded-full px-10 h-14 text-lg">Explore Our Collection</Button>
         </Link>
      </section>

    </div>
  )
}