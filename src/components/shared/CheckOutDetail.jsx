"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { useUser, SignInButton } from "@clerk/nextjs"
import { Check, CreditCard, MapPin, ClipboardList, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart-store"
import { useCheckoutStore } from "@/store/checkout-store";
import { createOrder } from "@/lib/actions/order.actions"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"

const steps = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: ClipboardList },
]

export default function CheckOutDetail({ taxRate = 8, shippingCost = 15, isMaintenance = false, defaultAddress }) {
  const { isLoaded, isSignedIn } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)


  const { items, clearCart, discountPercentage, appliedCoupon } = useCartStore()
  const { currentStep, setStep, shippingAddress, saveAddress } = useCheckoutStore()



  const initialFormValues = (shippingAddress && shippingAddress.firstName)
    ? shippingAddress
    : (defaultAddress ? {
      firstName: defaultAddress.firstName,
      lastName: defaultAddress.lastName,
      email: defaultAddress.email,
      address: defaultAddress.address,
      city: defaultAddress.city,
      zip: defaultAddress.zip,
      phone: defaultAddress.phone,
      country: defaultAddress.country,
    } : {
      firstName: "", lastName: "", email: "", address: "", city: "", zip: "", phone: "", country: ""
    });

  const { register, trigger, getValues, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialFormValues
  })


  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  if (!isMounted) return null

  if (isMaintenance) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="bg-red-50 p-4 rounded-full mb-4 text-red-600">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Checkout is temporarily disabled</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          Our store is currently undergoing maintenance. Please try completing your purchase later.
        </p>
        <Link href="/products" className="mt-8">
          <Button variant="outline">Back to Store</Button>
        </Link>
      </div>
    )
  }

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

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link href="/product" className="mt-4 text-blue-600 hover:underline">Go back to shopping</Link>
      </div>
    )
  }


  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;

  const actualShipping = subtotalAfterDiscount > 100 ? 0 : Number(shippingCost);
  const actualTax = Number(((subtotalAfterDiscount * Number(taxRate)) / 100).toFixed(2));
  const total = subtotalAfterDiscount + actualShipping + actualTax;

  const handleNextStep = async () => {
    const isValid = await trigger();

    if (isValid) {
      const formData = getValues();
      saveAddress(formData);
      setStep(2);
    } else {
      toast.error("Please fill in all required fields.");
    }
  }

  const onPlaceOrder = async () => {
    setIsSubmitting(true)
    try {
      const finalShippingAddress = getValues();

      const orderData = {
        items,
        shippingAddress: finalShippingAddress,
        itemsPrice: subtotal,
        shippingPrice: actualShipping,
        taxPrice: actualTax,
        totalPrice: total,
        discountAmount: discountAmount,
      }

      const result = await createOrder(orderData)

      if (result && result.url) {
        clearCart()
        toast.success("Order placed successfully!")
        window.location.href = result.url;
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-foreground">
        Checkout
      </h1>

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
                  <Label htmlFor="country">Country</Label>
                  <Input id="city" {...register("country", { required: true })} className={`rounded-xl ${errors.country ? 'border-red-500' : ''}`} />
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
                <label className="flex items-center gap-4 p-4 border-2 border-blue-600 bg-blue-50 rounded-xl cursor-pointer">
                  <input type="radio" checked readOnly className="w-5 h-5 text-blue-600" />
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Credit / Debit Card</p>
                    <p className="text-xs text-gray-500">Secure payment via Stripe Checkout</p>
                  </div>
                </label>

                {/* add Cash on Delivery baad me*/}
              </div>

              <Separator className="my-6" />

              <div className="mt-8 flex gap-3">
                <Button variant="outline" size="lg" className="rounded-xl" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button size="lg" className="flex-1 rounded-xl" onClick={() => setStep(3)}>
                  Review Order
                </Button>
              </div>
            </div>
          )}


          {currentStep === 3 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">Review Your Order</h2>

              <div className="mb-6 flex flex-col gap-4 rounded-xl bg-secondary p-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shipping to</span>
                  <p className="mt-1 text-sm text-foreground">
                    {getValues("firstName")} {getValues("lastName")}<br />
                    {getValues("address")}, {getValues("city")}, {getValues("zip")}, {getValues("country")}
                  </p>
                </div>
              </div>


              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.cartItemId || item.id} className="flex items-center gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <Image src={item.cartImage || (item.images && item.images.length > 0 ? item.images[0] : "/placeholder.jpg")} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedColor && item.selectedSize && <span className="mx-1">|</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="outline" size="lg" className="rounded-xl" onClick={() => setStep(2)}>Back</Button>
                <Button size="lg" className="flex-1 rounded-xl text-white" onClick={onPlaceOrder} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Place Order & Pay — $${total.toFixed(2)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-80">
          <div className="sticky top-36 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Order Summary</h3>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.cartItemId || item.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 flex-1">
                    {item.name} <span className="text-xs">({item.selectedColor?.slice(0, 3)}
                      {item.selectedColor && item.selectedSize ? '|' : ''}{item.selectedSize})</span> x{item.quantity}
                  </span>
                  <span className="ml-2 font-medium text-foreground">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <Separator className="my-2" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
              </div>

              {/* COUPON DISCOUNT DISPLAY */}
              {discountPercentage > 0 && (
                <div className="flex items-center justify-between text-sm text-green-600 font-medium">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">{actualShipping === 0 ? "Free" : `$${actualShipping.toFixed(2)}`}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                <span className="font-medium text-foreground">${actualTax.toFixed(2)}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total to Pay</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}