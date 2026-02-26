
"use client"
import { useState,useEffect } from "react"
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
import ProductCard from "@/components/shared/Product-card"
import {  reviewDistribution } from "@/lib/data"
import { useCartStore } from '@/store/cart-store';
import { toast } from "sonner" 

export default  function ProductPage({product,relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState(0)
  
   const productSizes = product.sizes || [] 
   const [selectedSize, setSelectedSize] = useState(
    productSizes.length > 0 ? productSizes[0] : null
  )
  
 
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    setSelectedImage(0)
    setSelectedColor(0)
    setSelectedSize(product.sizes?.length > 0 ? product.sizes[0] : null)
    setQuantity(1)
  }, [product])

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0


 const handleAddToCart = () => {
    addItem(product,quantity);
    toast(`${quantity} items added to cart!`)
    alert(`${quantity} items added to cart!`);  };


  const productColors = product.colors || []
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || "/placeholder.jpg"]
 
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      {/* Breadcrumbs */}
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

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
            <Image
              src={productImages[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.badge && (
              <Badge className="absolute left-4 top-4 rounded-lg bg-foreground text-background text-xs">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative size-20 overflow-hidden rounded-xl border-2 transition-all ${selectedImage === i
                    ? "border-foreground"
                    : "border-transparent opacity-60 hover:opacity-100"
                  }`}
              >
                <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              {product.name}
            </h1>

            {/* Rating */}
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

            {/* Price */}
            <div className="flex items-center gap-3">
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

          {/* Color Selector */}
          {productColors.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-foreground">
                Color:{" "}
                <span className="font-normal text-muted-foreground">
                  {productColors[selectedColor]}
                </span>
              </span>
              <div className="flex items-center gap-2">
                {productColors.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    className={`size-9 rounded-full border-2 transition-all ${selectedColor === i
                        ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                        : "border-border"
                      }`}
                    style={{ backgroundColor: color }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {productSizes.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-foreground">Size</span>
              <div className="flex flex-wrap items-center gap-2">
                {productSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-10 min-w-12 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-all ${selectedSize === size
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

          {/* Quantity + Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center rounded-xl border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-l-xl rounded-r-none"
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
                  className="rounded-l-none rounded-r-xl"
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
              className="flex-1 rounded-xl text-base">
                <ShoppingBag className="mr-2 size-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`size-5 ${isWishlisted ? "fill-destructive text-destructive" : ""}`}
                />
              </Button>
            </div>

            <Button variant="secondary" size="lg" className="w-full rounded-xl text-base">
              <Zap className="mr-2 size-5" />
              Buy Now
            </Button>
          </div>

          {/* Guarantees */}
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

          {/* Accordions */}
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                <p className="leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping Information</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 text-muted-foreground">
                  <p>Free standard shipping on all orders over $100.</p>
                  <p>Standard delivery: 3-5 business days.</p>
                  <p>Express delivery: 1-2 business days (+$15).</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>Returns & Exchanges</AccordionTrigger>
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

      {/* Customer Reviews */}
      <section className="mt-10">
        <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">
          Customer Reviews
        </h2>
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          {/* Rating summary */}
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

          {/* Distribution bars */}
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
