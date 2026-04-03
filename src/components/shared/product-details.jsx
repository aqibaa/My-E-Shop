
"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  Minus,
  Plus,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react"
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import ProductImageZoom from "./ProductImageZoom"
import ProductCard from "@/components/shared/Product-card"
import { reviewDistribution } from "@/lib/data"
import { useCartStore } from '@/store/cart-store';
import { toast } from "sonner"


export default function ProductPage({ product, relatedProducts }) {
  const { addItem } = useCartStore();

  const { toggleWishlist, items } = useWishlistStore();
  const isLiked = items.some((item) => item.id === product.id)

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])


  const productColors = product.colors || [];
  const [selectedColorIndex, setSelectedColorIndex] = useState(productColors.length > 0 ? 0 : null);

  let rawImages = [];
  if (selectedColorIndex !== null && productColors[selectedColorIndex]?.images?.length > 0) {
    rawImages = productColors[selectedColorIndex].images;
  } else if (product.images && product.images.length > 0) {
    rawImages = product.images;
  } else {
    rawImages = [product.image]; 
  }

   const handleColorClick = (index) => {
    setSelectedColorIndex(index);
    setCurrentImageIndex(0); 
  };

  const activeImages = rawImages.filter(img => img && typeof img === 'string' && img.trim() !== "");

  if (activeImages.length === 0) {
    activeImages.push("/placeholder.jpg");
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productSizes = product.sizes || []
  const [selectedSize, setSelectedSize] = useState(
    productSizes.length > 0 ? productSizes[0] : null
  )
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    const finalColorName = selectedColorIndex !== null && productColors.length > 0
      ? productColors[selectedColorIndex].name
      : null;

    const finalImage = activeImages.length > 0
      ? activeImages[0]
      : (product.image || "/placeholder.jpg");

    addItem(product, quantity, finalColorName, selectedSize, finalImage);

    toast.success(`Added ${quantity} ${product.name} to cart!`);
  }


  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0


  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/product">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-10 md:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-4">
          <div className="relative aspect-square  rounded-2xl bg-secondary">
            <ProductImageZoom
              images={activeImages} 
              alt={product.name}
              currentIndex={currentImageIndex}
              setCurrentIndex={setCurrentImageIndex}
            />
            {product.badge && (
              <Badge className="absolute left-4 top-4 rounded-lg bg-foreground text-background text-xs">
                {product.badge}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < Math.floor(product.rating)
                      ? "fill-foreground text-foreground"
                      : "fill-muted text-muted"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-3">
              <span className="text-2xl font-bold text-foreground">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
              {discount > 0 && (
                <Badge variant="secondary" className="rounded-lg text-xs">
                  Save {discount}%
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {productColors.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-foreground">
                Color:{" "}
                <span className="font-normal text-muted-foreground">
                  {productColors[selectedColorIndex]?.name}
                </span>
              </span>
              <div className="flex items-center gap-2">
                {productColors.map((colorObj, i) => (
                  <button
                    key={i}
                    onClick={() => handleColorClick(i)}
                    className={`size-10 rounded-full cursor-pointer border-2 transition-all ${selectedColorIndex === i
                      ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : "border-border"
                      }`}
                    style={{ backgroundColor: colorObj.colorCode || '#ccc' }}
                    aria-label={colorObj.name}
                  />
                ))}
              </div>
            </div>
          )}

          {productSizes.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-foreground">Size</span>
              <div className="flex flex-wrap items-center gap-2">
                {productSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-10 min-w-12 items-center cursor-pointer justify-center rounded-xl border px-3 text-sm font-medium transition-all ${selectedSize === size
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:border-foreground"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center rounded-xl border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-l-xl rounded-r-none cursor-pointer"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="flex w-12 items-center justify-center text-sm font-medium text-foreground">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-l-none rounded-r-xl cursor-pointer"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg"
                onClick={handleAddToCart}
                className="flex-1 rounded-xl text-base cursor-pointer">
                <ShoppingBag className="mr-2 size-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl cursor-pointer"
                onClick={() => toggleWishlist(product)}
                aria-label={isMounted && isLiked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={isMounted && isLiked ? "fill-red-500 text-red-500" : ""} />
              </Button>
            </div>

            <Button variant="secondary" size="lg" className="w-full rounded-xl text-base cursor-pointer">
              <Zap className="mr-2 size-5" />
              Buy Now
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Free Shipping" },
              { icon: RotateCcw, label: "Easy Returns" },
              { icon: Shield, label: "2-Year Warranty" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-secondary p-3 text-center"
              >
                <Icon className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="cursor-pointer">Description</AccordionTrigger>
              <AccordionContent>
                <p className="leading-relaxed text-muted-foreground cursor-pointer">
                  {product.description}
                </p>
              </AccordionContent>
            </AccordionItem>
            {product.features && product.features.length > 0 && (
              <AccordionItem value="Key Features">
                <AccordionTrigger className="cursor-pointer">Key Features  </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="shipping">
              <AccordionTrigger className="cursor-pointer">Shipping Information</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 text-muted-foreground">
                  <p>Free standard shipping on all orders over $100.</p>
                  <p>Standard delivery: 3-5 business days.</p>
                  <p>Express delivery: 1-2 business days (+$15).</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger className="cursor-pointer">Returns & Exchanges</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 text-muted-foreground">
                  <p>30-day hassle-free return policy.</p>
                  <p>Items must be unused and in original packaging.</p>
                  <p>Free return shipping for all orders.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">
          Customer Reviews
        </h2>
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <div className="flex flex-col items-center gap-4 lg:w-60">
            <span className="text-5xl font-bold text-foreground">
              {product.rating}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-5 ${i < Math.floor(product.rating)
                    ? "fill-foreground text-foreground"
                    : "fill-muted text-muted"
                    }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Based on {product.reviewCount} reviews
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {reviewDistribution.map(({ stars, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="w-14 text-right text-sm text-muted-foreground">
                  {stars} stars
                </span>
                <Progress value={percentage} className="h-2.5 flex-1" />
                <span className="w-10 text-sm text-muted-foreground">
                  {percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      <div className="mt-10">
        {relatedProducts.length > 0 ? (
          <section className="mt-20">
            <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : (

          <div className="flex flex-col items-center justify-center py-12 bg-secondary/20 rounded-xl border border-dashed border-secondary">
            <p className="text-lg font-medium text-muted-foreground">
              No similar items found in this category yet.
            </p>
            <Link href="/product" className="mt-2 text-primary hover:underline underline-offset-4">
              Explore other products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
