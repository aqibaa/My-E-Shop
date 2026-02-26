"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, CreditCard, MapPin, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { products } from "@/lib/data"

const steps = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: ClipboardList },
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const subtotal = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

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
              <button
                onClick={() => {
                  if (isCompleted) setCurrentStep(step.id)
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isCurrent
                    ? "bg-foreground text-background"
                    : isCompleted
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="size-4" />
                ) : (
                  <Icon className="size-4" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 h-px w-8 sm:w-16 ${
                    currentStep > step.id ? "bg-foreground" : "bg-border"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-1">
          {currentStep === 1 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main Street" className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="state">State</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                      <SelectItem value="fl">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="10001" className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="rounded-xl" />
                </div>
              </div>
              <Button
                size="lg"
                className="mt-8 w-full rounded-xl"
                onClick={() => setCurrentStep(2)}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">
                Payment Method
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input id="cardName" placeholder="John Doe" className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM / YY" className="rounded-xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" className="rounded-xl" />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex items-center gap-3 rounded-xl bg-secondary p-4">
                <CreditCard className="size-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Your payment info is encrypted and secure. We never store your card details.
                </p>
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1 rounded-xl"
                  onClick={() => setCurrentStep(3)}
                >
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">
                Review Your Order
              </h2>

              <div className="mb-6 flex flex-col gap-4 rounded-xl bg-secondary p-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Shipping to
                  </span>
                  <p className="mt-1 text-sm text-foreground">
                    John Doe, 123 Main Street, New York, NY 10001
                  </p>
                </div>
                <Separator />
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Payment
                  </span>
                  <p className="mt-1 text-sm text-foreground">
                    Visa ending in 4242
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {products.map((item) => (
                  <div key={item.title} className="flex items-center gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </Button>
                <Button size="lg" className="flex-1 rounded-xl">
                  Place Order &mdash; ${total.toFixed(2)}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-80">
          <div className="sticky top-36 rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Order Summary
            </h3>
            <div className="flex flex-col gap-3">
              {products.map((item) => (
                <div key={item.title} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 flex-1">
                    {item.title} x{item.quantity}
                  </span>
                  <span className="ml-2 font-medium text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator className="my-1" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">Free</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium text-foreground">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
