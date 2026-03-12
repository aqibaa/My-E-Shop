"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useUser, SignInButton } from "@clerk/nextjs" // Auth Import
import { Check, CreditCard, MapPin, ClipboardList, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart-store"
import { useCheckoutStore } from "@/store/checkout-store";
import { createOrder } from "@/lib/actions/order.actions"
import { toast } from "sonner"

const steps = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: ClipboardList },
]

export default function CheckOutDetail() {
  const router = useRouter()
  const { isLoaded, isSignedIn, user } = useUser() // Clerk Auth State
  const [isSubmitting, setIsSubmitting] = useState(false)


  const { items, clearCart } = useCartStore()
  const {
    currentStep,
    setStep,
    shippingAddress,
    saveAddress,
    paymentMethod
  } = useCheckoutStore()


  const {
    register,
    trigger,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: shippingAddress || {
      firstName: "", lastName: "", email: "", address: "", city: "", zip: "", phone: ""
    }
  })


  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  if (!isMounted) return null

  if (isLoaded && !isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center px-4">
        <div className="bg-gray-100 p-4 rounded-full">
          <ClipboardList className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold">Please Sign In to Checkout</h2>
        <p className="text-muted-foreground max-w-md">
          You need to be logged in to place an order and track it later.
        </p>
        <SignInButton mode="modal" forceRedirectUrl="/checkout">
          <Button size="lg" className="rounded-xl px-8">Sign In / Register</Button>
        </SignInButton>
      </div>
    )
  }

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) * item.quantity),
    0
  )
  const shipping = subtotal > 100 ? 0 : 15
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleNextStep = async () => {
    const isValid = await trigger();

    if (isValid) {
      const formData = getValues();
      saveAddress(formData);
      setStep(2);                   //
    } else {
      toast.error("Please fill in all required fields.");
    }
  }


  // Place Order Logic
  const onPlaceOrder = async () => {
    setIsSubmitting(true)
    try {
      const finalShippingAddress = getValues();

      const orderData = {
        items,
        shippingAddress: finalShippingAddress,
        paymentMethod: 'Credit Card',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      }

      const newOrder = await createOrder(orderData)

      if (newOrder) {
        clearCart()
        toast.success("Order placed successfully!")
        router.push(`/order/${newOrder.id}`)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link href="/product" className="mt-4 text-blue-600 hover:underline">Go back to shopping</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-foreground">
        Checkout
      </h1>

      {/* Steps UI */}
      <div className="mb-10 flex items-center justify-center">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${isCurrent ? "bg-foreground text-background" :
                  isCompleted ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}
              >
                {isCompleted ? <Check className="size-4" /> : <Icon className="size-4" />}
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 h-px w-8 sm:w-16 ${currentStep > step.id ? "bg-foreground" : "bg-border"}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-1">

          {/* STEP 1: SHIPPING FORM */}
          {currentStep === 1 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">Shipping Address</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register("firstName", { required: true })} className={`rounded-xl ${errors.firstName ? 'border-red-500' : ''}`} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register("lastName", { required: true })} className={`rounded-xl ${errors.lastName ? 'border-red-500' : ''}`} />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email", { required: true })} className={`rounded-xl ${errors.email ? 'border-red-500' : ''}`} />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" {...register("address", { required: true })} className={`rounded-xl ${errors.address ? 'border-red-500' : ''}`} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("city", { required: true })} className={`rounded-xl ${errors.city ? 'border-red-500' : ''}`} />
                </div>



                <div className="flex flex-col gap-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" {...register("zip", { required: true })} className={`rounded-xl ${errors.zip ? 'border-red-500' : ''}`} />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" {...register("phone", { required: true })} className={`rounded-xl ${errors.phone ? 'border-red-500' : ''}`} />
                </div>
              </div>

              <Button size="lg" className="mt-8 w-full rounded-xl" onClick={handleNextStep}>
                Continue to Payment
              </Button>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {currentStep === 2 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">Payment Method</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Card Holder Name</Label>
                  <Input placeholder="John Doe" disabled className="bg-gray-50 rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Card Number</Label>
                  <Input placeholder="4242 4242 4242 4242" disabled className="bg-gray-50 rounded-xl" />
                </div>
              </div>

              <Separator className="my-6" />
              <div className="flex items-center gap-3 rounded-xl bg-secondary p-4">
                <CreditCard className="size-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Demo Mode: No payment required.</p>
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="outline" size="lg" className="rounded-xl" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" className="flex-1 rounded-xl" onClick={() => setStep(3)}>Review Order</Button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {currentStep === 3 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">Review Your Order</h2>

              <div className="mb-6 flex flex-col gap-4 rounded-xl bg-secondary p-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shipping to</span>
                  <p className="mt-1 text-sm text-foreground">
                    {getValues("firstName")} {getValues("lastName")}<br />
                    {getValues("address")}, {getValues("city")}, {getValues("zip")}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <Image
                        src={item.images && item.images[0] ? item.images[0] : (item.image || "/placeholder.jpg")} alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="outline" size="lg" className="rounded-xl" onClick={() => setStep(2)}>Back</Button>
                <Button size="lg" className="flex-1 rounded-xl" onClick={onPlaceOrder} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Place Order — $${total.toFixed(2)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-80">
          <div className="sticky top-36 rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Order Summary</h3>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 flex-1">{item.name} x{item.quantity}</span>
                  <span className="ml-2 font-medium text-foreground">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-1" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">{shipping === 0 ? "Free" : `$${shipping}`}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}