"use client"
import Link from "next/link"
import { useEffect } from "react"
import {
  Headphones, Shirt, Watch, Laptop, Footprints, Gem, ShoppingBag
} from "lucide-react"
import { useCategoryStore } from "@/store/category-store"

const iconMap = {
  "Electronics": Laptop,
  "Fashion": Shirt,
  "Watches": Watch,
  "Audio": Headphones,
  "Footwear": Footprints,
  "Accessories": Gem,
  "Lifestyle": ShoppingBag
}

export function FeaturedCategories() {
  const { categories, fetchCategories, isLoading } = useCategoryStore()
  useEffect(() => {
    fetchCategories()
  }, [])
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Shop by Category
        </h2>
        <p className="text-sm text-muted-foreground">
          Browse our curated collections
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 sm:gap-6">
        {isLoading && categories.length === 0 && (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
          ))
        )}


        {categories.map((category) => {
          const Icon = iconMap[category.name] || ShoppingBag;

          return (
            <Link
              key={category.id}
              href={`/product?category=${category.slug}`}
              className="group flex flex-col items-center gap-3"
            >
              <div className="flex size-20 items-center justify-center rounded-2xl bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:size-24">
                <Icon className="size-7 sm:size-8" />
              </div>
              <span className="text-xs font-medium text-foreground sm:text-sm capitalize">
                {category.name}
              </span>
            </Link>
          )
        })}

      </div>
    </section>
  )
}
