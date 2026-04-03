import ProductSkeleton from "@/components/shared/ProductSkeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="h-4 w-48 bg-gray-200 rounded mb-8 animate-pulse" />

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}