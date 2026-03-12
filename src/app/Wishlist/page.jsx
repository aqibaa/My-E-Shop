"use client"

import { useWishlistStore } from "@/store/wishlist-store"
import ProductCard from "@/components/shared/Product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, ArrowRight } from "lucide-react"

export default function WishlistPage() {
    const { items, clearWishlist } = useWishlistStore();



    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb & Header */}
            <section className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">Wishlist</span>
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
                        My Wishlist
                    </h1>
                    {items.length > 0 && (
                        <Button variant="outline" onClick={clearWishlist}>Clear All</Button>
                    )}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed">
                        <Heart className="w-16 h-16 text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600">Your wishlist is empty</h2>
                        <p className="text-gray-400 mb-6">Start saving items you love!</p>
                        <Link href="/product">
                            <Button>Explore Products</Button>
                        </Link>
                    </div>
                )}
            </section>
        </div>
    )
}
