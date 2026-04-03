import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function ProductSkeleton() {
  return (
    <Card className="group overflow-hidden border rounded-xl bg-white animate-pulse">
      <div className="relative aspect-4/3 bg-gray-200" />

      <CardContent className="p-4 pt-4">
        <div className="h-3 w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-3" />
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
      </CardContent>

      <CardFooter className="p-4 pt-0">
         <div className="h-9 w-full bg-gray-200 rounded-lg" />
      </CardFooter>
    </Card>
  )
}