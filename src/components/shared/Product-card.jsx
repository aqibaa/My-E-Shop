// "use client"

// import Image from "next/image"
// import Link from "next/link"
// import { Heart, ShoppingBag, Star } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { useState } from "react"



// export function ProductCard({
//   id,
//   title,
//   price,
//   originalPrice,
//   image,
//   rating,
//   reviewCount,
//   badge,
// }) {
//   const [isWishlisted, setIsWishlisted] = useState(false)
//   const discount = originalPrice
//     ? Math.round(((originalPrice - price) / originalPrice) * 100)
//     : 0

//   return (
//     <div className="group relative flex flex-col">
//       {/* Image container */}
//       <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
//         <Link href={`/products/${id}`} className="absolute inset-0">
//           <Image
//             src={image}
//             alt={title}
//             fill
//             className="object-cover transition-transform duration-500 group-hover:scale-105"
//             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//           />
//         </Link>

//         {/* Badges */}
//         {badge && (
//           <Badge className="absolute left-3 top-3 rounded-lg bg-foreground text-background text-[10px] uppercase tracking-wider">
//             {badge}
//           </Badge>
//         )}

//         {/* Wishlist button */}
//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute right-3 top-3 size-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
//           onClick={() => setIsWishlisted(!isWishlisted)}
//           aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           <Heart
//             className={`size-4 ${isWishlisted ? "fill-destructive text-destructive" : "text-foreground"}`}
//           />
//         </Button>

//         {/* Quick add to cart - appears on hover */}
//         <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
//           <Button className="w-full rounded-xl" size="sm">
//             <ShoppingBag className="mr-2 size-4" />
//             Add to Cart
//           </Button>
//         </div>
//       </div>

//       {/* Info */}
//       <div className="flex flex-col gap-1.5 pt-4">
//         <Link
//           href={`/products/${id}`}
//           className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground line-clamp-1"
//         >
//           {title}
//         </Link>

//         {/* Rating */}
//         <div className="flex items-center gap-1.5">
//           <div className="flex items-center gap-0.5">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <Star
//                 key={i}
//                 className={`size-3 ${
//                   i < Math.floor(rating)
//                     ? "fill-foreground text-foreground"
//                     : "fill-muted text-muted"
//                 }`}
//               />
//             ))}
//           </div>
//           <span className="text-xs text-muted-foreground">({reviewCount})</span>
//         </div>

//         {/* Price */}
// <div className="flex items-center gap-2">
//   <span className="text-base font-semibold text-foreground">
//     ${price.toFixed(2)}
//   </span>
//   {originalPrice && (
//     <span className="text-sm text-muted-foreground line-through">
//       ${originalPrice.toFixed(2)}
//     </span>
//   )}
//   {discount > 0 && (
//     <span className="text-xs font-medium text-destructive">
//       -{discount}%
//     </span>
//   )}
// </div>
//   </div>
//     </div>
//   )
// }
// components/shared/ProductCard.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({
    id,
    title,
    price,
    originalPrice,
    image,
    rating,
    reviewCount,
    badge, }) {
    const discount =originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return (
        <div className="group relative">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="flex items-center gap-1.5">
//           <div className="flex items-center gap-0.5">
//             {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`size-3 ${i < Math.floor(rating)
                                ? "fill-foreground text-foreground"
                                : "fill-muted text-muted"
                            }`}
                    />
                ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({reviewCount})</span>
                </div>

                <div>

                    {badge && (
                        <Badge className="absolute right-3 top-3 uppercase text-[10px] tracking-wider">
                            {badge}
                        </Badge>
                    )}
                    {discount > 0 && (
                        <Badge variant="destructive" className="absolute left-3 top-3 uppercase text-[10px]">
                            -{discount}%
                        </Badge>
                    )}
                </div>

                <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Button className="w-full rounded-lg shadow-lg" size="sm">
                        <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                </div>
            </div>

            {/* Product Details */}
            <div className="mt-4 space-y-1">
                <Link href={`/products/${id}`}>
                    <h3 className="text-sm font-medium text-gray-900 hover:underline">{title}</h3>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="font-bold">${price}</span>
                    {originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
