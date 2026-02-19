import Link from "next/link"
import {
  Headphones,
  Shirt,
  Watch,
  Laptop,
  Footprints,
  Gem,
} from "lucide-react"

const categories = [
  { name: "Electronics", icon: Laptop, href: "/products?category=electronics" },
  { name: "Fashion", icon: Shirt, href: "/products?category=fashion" },
  { name: "Watches", icon: Watch, href: "/products?category=watches" },
  { name: "Audio", icon: Headphones, href: "/products?category=audio" },
  { name: "Footwear", icon: Footprints, href: "/products?category=footwear" },
  { name: "Accessories", icon: Gem, href: "/products?category=accessories" },
]

export function FeaturedCategories() {
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

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 sm:gap-6">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link
              key={category.name}
              href={category.href}
              className="group flex flex-col items-center gap-3"
            >
              <div className="flex size-20 items-center justify-center rounded-2xl bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:size-24">
                <Icon className="size-7 sm:size-8" />
              </div>
              <span className="text-xs font-medium text-foreground sm:text-sm">
                {category.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
