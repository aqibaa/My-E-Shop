
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart-store" 

export default function Cartdetail() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantityAction = useCartStore((state) => state.updateQuantity)
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;

  const handleUpdateQuantity = (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return; 
    updateQuantityAction(id, newQty);
  }

  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0)
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
        <ShoppingBag className="mb-4 size-16 text-muted-foreground" />
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button asChild className="mt-6 rounded-xl px-8" size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-foreground">
        Shopping Cart ({items.length} items)
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-1">
          <div className="hidden items-center gap-4 pb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:flex">
            <span className="flex-1">Product</span>
            <span className="w-28 text-center">Quantity</span>
            <span className="w-24 text-right">Total</span>
            <span className="w-10" />
          </div>
          <Separator className="hidden sm:block" />

          <div className="flex flex-col gap-6 pt-6">
            {items.map((item) => (
              <div key={item.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary sm:size-24">
                      <Image
                        src={
                            item.images && item.images.length > 0 
                            ? item.images[0] 
                            : (item.image || "/placeholder.jpg")
                        }
                        alt={item.name || "Product Image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-sm font-medium text-foreground hover:underline"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        Brand: {item.brand}
                      </span>
                      <span className="text-sm font-medium text-foreground sm:hidden">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex w-28 items-center justify-center">
                    <div className="flex items-center rounded-xl border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-l-xl rounded-r-none"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="flex w-8 items-center justify-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-l-none rounded-r-xl"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Total */}
                  <span className="hidden w-24 text-right text-sm font-semibold text-foreground sm:block">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>

                  {/* Remove */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <Separator className="mt-6" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-96">
          <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
            <h2 className="mb-6 text-lg font-semibold text-foreground">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-medium text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-medium text-foreground">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Input
                placeholder="Promo code"
                className="rounded-xl"
              />
              <Button variant="outline" className="shrink-0 rounded-xl">
                Apply
              </Button>
            </div>

            <Button asChild size="lg" className="mt-6 w-full rounded-xl text-base">
              <Link href="/checkout">
                Checkout
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}