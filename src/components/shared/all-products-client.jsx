"use client"

import { useEffect } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
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
import { useFilterStore } from "@/store/filter-store";


function FilterSidebar({
    availableCategories, availableBrands
}) {
    const {
        priceRange, setPriceRange,
        selectedBrands, toggleBrand,
        selectedCategories, toggleCategory
    } = useFilterStore();

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

export default function AllProductsClient({ products, totalPages, currentPage }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || "";
    const availableCategories = [...new Set(products.map(p => p.category))];
    const availableBrands = [...new Set(products.map(p => p.brand))];

    const {
        priceRange,
        setPriceRange,
        selectedBrands,
        toggleBrand,
        selectedCategories,
        toggleCategory,
        sortBy,
        setSortBy,
        resetFilters
    } = useFilterStore();


    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {

            const matchedCategory = availableCategories.find(
                c => c.toLowerCase() === categoryParam.toLowerCase()
            );

            if (matchedCategory) {
                resetFilters();
                if (!selectedCategories.includes(matchedCategory)) {
                    toggleCategory(matchedCategory);
                }
            }
        }
    }, [searchParams]);

    const filteredProducts = products
        .filter((p) => {
            if (!searchQuery) return true;
            const lowerQuery = searchQuery.toLowerCase();
            return (
                p.name.toLowerCase().includes(lowerQuery) ||
                p.brand.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            );
        })
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



    const handlePageChange = (newPage) => {
        // Naya URL banayenge purane filters ke sath
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("page", newPage);

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${pathname}${query}`);
    };

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

                            availableCategories={availableCategories}
                            availableBrands={availableBrands}
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
                                            availableCategories={availableCategories}
                                            availableBrands={availableBrands}
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
                                    onClick={() => toggleCategory(cat)}
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
                                onClick={resetFilters}>
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
                            <p className="text-sm text-muted-foreground">Category: {searchParams.get('category')}</p>
                            <Button
                                variant="link"
                                onClick={resetFilters}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl px-4"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </Button>

                            <span className="text-sm font-medium text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl px-4"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}