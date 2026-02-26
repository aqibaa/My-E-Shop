"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ProductCard from "@/components/shared/Product-card"
import Link from "next/link"

function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedBrands,
  toggleBrand,
  selectedCategories,
  toggleCategory,
  availableCategories, 
  availableBrands      
}) {    
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground">Price Range</h3>
        <Slider
          min={0}
          max={3000} 
          step={50}
          value={priceRange}
          onValueChange={setPriceRange}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Categories</h3>
        {availableCategories.map((cat) => (
          <label key={cat} className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              checked={selectedCategories.includes(cat)}
              onCheckedChange={() => toggleCategory(cat)}
            />
            <span className="text-sm text-muted-foreground">{cat}</span>
          </label>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Brands</h3>
        {availableBrands.map((brand) => (
          <label key={brand} className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              checked={selectedBrands.includes(brand)}
              onCheckedChange={() => toggleBrand(brand)}
            />
            <span className="text-sm text-muted-foreground">{brand}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default function AllProductsClient({ products }) {
   
    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];

    const [priceRange, setPriceRange] = useState([0, 3000])
    const [selectedBrands, setSelectedBrands] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [sortBy, setSortBy] = useState("featured")

    const toggleBrand = (brand) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        )
    }

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        )
    }

    const filteredProducts = products
        .filter((p) => Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1])
        .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
        .filter(
            (p) =>
                selectedCategories.length === 0 ||
                selectedCategories.includes(p.category)
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "price-asc":
                    return Number(a.price) - Number(b.price)
                case "price-desc":
                    return Number(b.price) - Number(a.price)
                case "rating":
                    return Number(b.rating) - Number(a.rating)
                default:
                    return 0
            }
        })
       
    const activeFilterCount =
        selectedBrands.length + selectedCategories.length + (priceRange[0] > 0 || priceRange[1] < 3000 ? 1 : 0)

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>All Products</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="sticky top-36">
                        <h2 className="mb-6 text-lg font-semibold text-foreground">Filters</h2>
                        <FilterSidebar
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            selectedBrands={selectedBrands}
                            toggleBrand={toggleBrand}
                            selectedCategories={selectedCategories}
                            toggleCategory={toggleCategory}
                            availableCategories={categories}
                            availableBrands={brands}
                        />
                    </div>
                </aside>

                <div className="flex-1">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="rounded-xl lg:hidden">
                                        <SlidersHorizontal className="mr-2 size-4" />
                                        Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80 overflow-y-auto">
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="px-4 pt-6">
                                        <FilterSidebar
                                            priceRange={priceRange}
                                            setPriceRange={setPriceRange}
                                            selectedBrands={selectedBrands}
                                            toggleBrand={toggleBrand}
                                            selectedCategories={selectedCategories}
                                            toggleCategory={toggleCategory}
                                            availableCategories={categories}
                                            availableBrands={brands}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">
                                    {filteredProducts.length}
                                </span>{" "}
                                products
                            </p>
                        </div>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-44 rounded-xl">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="featured">Featured</SelectItem>
                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

   {activeFilterCount > 0 && (
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            {selectedCategories.map((cat) => (
                                <Button
                                    key={cat}
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => toggleCategory(cat, selectedCategories, setSelectedCategories)}
                                >
                                    {cat}
                                    <X className="ml-1 size-3" />
                                </Button>
                            ))}
                            {selectedBrands.map((brand) => (
                                <Button
                                    key={brand}
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => toggleBrand(brand)}
                                >
                                    {brand}
                                    <X className="ml-1 size-3" />
                                </Button>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedBrands([])
                                    setSelectedCategories([])
                                    setPriceRange([0, 500])
                                }}
                            >
                                Clear all
                            </Button>
                        </div>
                    )} 

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-lg font-medium text-foreground">No products found</p>
                            <Button 
                                variant="link" 
                                onClick={() => {
                                    setSelectedBrands([])
                                    setSelectedCategories([])
                                    setPriceRange([0, 3000])
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}