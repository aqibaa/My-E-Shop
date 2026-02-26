"use client"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"



 function ProductCard({product}) {
    
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {product.badge && (
          <Badge className="absolute left-3 top-3 rounded-lg bg-foreground text-background text-[10px] uppercase tracking-wider">
            {product.badge}
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 size-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`size-4 ${isWishlisted ? "fill-destructive text-destructive" : "text-foreground"}`}
          />
        </Button>

        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button className="w-full rounded-xl" size="sm">
            <ShoppingBag className="mr-2 size-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 pt-4">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-foreground text-foreground"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
<div className="flex items-center flex-wrap gap-2">
  <span className="text-base font-semibold text-foreground">
    ${product.price}
  </span>
  {product.originalPrice && (
    <span className="text-sm text-muted-foreground line-through">
      ${product.originalPrice}
    </span>
  )}
  {discount > 0 && (
    <span className="text-xs font-medium text-destructive">
      -{discount}%
    </span>
  )}
</div>
  </div>
    </div>
  )
}

export default ProductCard;
