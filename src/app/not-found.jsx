import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, SearchX } from "lucide-react";

export const metadata = {
  title: 'Page Not Found | My E-Shop',
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-gray-50 p-6 rounded-full mb-6">
        <SearchX className="w-16 h-16 text-gray-400" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-4">
        Oops! Page Not Found
      </h1>
      
      <p className="text-lg text-gray-500 max-w-md mb-8">
        We can't seem to find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button size="lg" className="rounded-xl px-8 h-12">
            Go to Homepage
          </Button>
        </Link>
        <Link href="/product">
          <Button variant="outline" size="lg" className="rounded-xl px-8 h-12 gap-2">
            <ShoppingBag className="w-4 h-4" /> Keep Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}