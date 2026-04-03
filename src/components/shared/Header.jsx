// "use client";

// import { useState } from "react";
// import { SignedIn, SignedOut, SignInButton, UserButton, fallbackRedirectUrl } from "@clerk/nextjs";
// import { useCartStore } from "@/store/cart-store";
// import Link from "next/link";
// import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { useRouter } from "next/navigation"
// import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// const NAV_LINKS = [
//     { label: "New Arrivals", href: "/product?sort=newest" },
//     { label: "Women", href: "/product?category=women" },
//     { label: "Men", href: "/product?category=men" },
//     { label: "Electronics", href: "/product?category=electronics" },
// ];

// export default function Header() {
//     const router = useRouter()
//     const items = useCartStore((state) => state.items)
//     const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
//     const [searchOpen, setSearchOpen] = useState(false);


//     return (
//         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
//             <div className="bg-primary text-primary-foreground py-2 text-center text-xs font-medium tracking-wide">
//                 Free shipping on orders over $100 — Shop Now
//             </div>

//             <div className="wrapper flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
//                 {/* // Mobile Menu   */}
//                 <div className="flex items-center gap-4">
//                     <Sheet>
//                         <SheetTrigger asChild>
//                             <Button variant="ghost" size="icon" className="lg:hidden">
//                                 <Menu className="h-5 w-5" />
//                             </Button>
//                         </SheetTrigger>
//                         <SheetContent side="left">
//                             <SheetHeader>
//                                 <SheetTitle className="font-serif text-xl">My-E-Shop</SheetTitle>
//                             </SheetHeader>
//                             <nav className="mt-6 flex flex-col gap-4">
//                                 {NAV_LINKS.map((link) => (
//                                     <Link key={link.href} href={link.href} className="text-lg font-medium">
//                                         {link.label}
//                                     </Link>
//                                 ))}
//                             </nav>
//                         </SheetContent>
//                     </Sheet>

//                     <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
//                         My-E-Shop
//                     </Link>
//                 </div>

//                 <nav className="hidden lg:flex items-center gap-6">
//                     {NAV_LINKS.map((link) => (
//                         <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
//                             {link.label}
//                         </Link>
//                     ))}
//                 </nav>

//                 <div className="flex items-center gap-2">
//                     <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
//                         {searchOpen ? <X className="h-5 w-5" /> : <Search className="size-5" />}
//                     </Button>
//                     <Link href="/cart">
//                         <div className="relative">
//                             <ShoppingBag />
//                             {itemCount > 0 && (
//                                 <Badge className="absolute -top-2 -right-2 px-1 py-0.5 text-xs">
//                                     {itemCount}
//                                 </Badge>
//                             )}
//                         </div>
//                     </Link>


//                     <div className="flex items-center gap-2">
//                         <SignedOut>
//                             <SignInButton mode="modal">
//                                 <Button variant="outline" size="sm">Sign In</Button>
//                             </SignInButton>
//                         </SignedOut>

//                         <SignedIn>
//                             <UserButton
//                                 fallbackRedirectUrl="/"
//                                 userProfileMode="navigation"
//                                 userProfileUrl="/account" />
//                         </SignedIn>
//                     </div>

//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         asChild
//                         className="hidden sm:inline-flex"
//                     >
//                         <Link href="/Wishlist" aria-label="Wishlist">
//                             <Heart className="size-5" />
//                         </Link>
//                     </Button>

//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         asChild
//                         className="hidden sm:inline-flex"
//                     >
//                         <Link href="/account" aria-label="Account">
//                             <User className="size-5" />
//                         </Link>
//                     </Button>
//                 </div>
//             </div>
//             {searchOpen && (
//                 <div className="border-t bg-background p-4 animate-in slide-in-from-top-5">
//                     <div className="max-w-3xl mx-auto flex gap-2">
//                         <Input placeholder="Search products..." className="flex-1" autoFocus />
//                         <Button>Search</Button>
//                     </div>
//                 </div>
//             )}
//         </header>
//     );
// }



"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, ShoppingBag,ShieldAlert , Heart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const NAV_LINKS = [
    { label: "New Arrivals", href: "/product?sort=newest" },
    { label: "Women", href: "/product?category=women" },
    { label: "Men", href: "/product?category=men" },
    { label: "Electronics", href: "/product?category=electronics" },
];

const ADMIN_EMAILS = ["aaqib.codes@gmail.com"];

export default function Header() {
    const { isLoaded, user } = useUser();
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const items = useCartStore((state) => state.items)
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

    const [searchOpen, setSearchOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const isAdmin = isLoaded && user && ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress?.toLowerCase());

    useEffect(() => {
        const currentSearch = searchParams.get('search') || "";
        setInputValue(currentSearch);
    }, [searchParams]);

    useEffect(() => {
        if (!pathname.includes('/product')) {
            setSearchOpen(false);
        }
    }, [pathname]);

    useEffect(() => {
        if (!searchOpen) return;
        const timer = setTimeout(() => {
            const trimmedValue = inputValue.trim();
            const currentSearchInUrl = searchParams.get('search') || "";
            if (trimmedValue !== currentSearchInUrl) {
                if (trimmedValue === "") {
                    router.push('/product');
                } else {
                    router.push(`/product?search=${encodeURIComponent(trimmedValue)}`);
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue, searchOpen]);

    const handleManualSearch = (e) => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();

        if (trimmedValue) {
            router.push(`/product?search=${encodeURIComponent(trimmedValue)}`);
            setSearchOpen(false);
        }
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
        if (searchOpen) {
            setInputValue("");
        } else {
            setTimeout(() => {
                document.getElementById('searchInput')?.focus();
            }, 100);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="bg-primary text-primary-foreground py-2 text-center text-xs font-medium tracking-wide">
                Free shipping on orders over $100 — Shop Now
            </div>

            <div className="wrapper flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle className="font-serif text-xl">My-E-Shop</SheetTitle>
                            </SheetHeader>
                            <nav className="mt-6 flex flex-col gap-4">
                                {NAV_LINKS.map((link) => (
                                    <Link key={link.href} href={link.href} className="text-lg font-medium">
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
                        My-E-Shop
                    </Link>
                </div>

                <nav className="hidden lg:flex items-center gap-6">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleSearch}>
                        {searchOpen ? <X className="h-5 w-5" /> : <Search className="size-5" />}
                    </Button>

                    {isAdmin && (
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hidden sm:inline-flex text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Link href="/admin" aria-label="Admin Panel">
                                <ShieldAlert className="size-4 mr-1" />
                                Admin Panel
                            </Link>
                        </Button>
                    )}

                    <Link href="/cart">
                        <div className="relative mr-2">
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <Badge className="absolute -top-2 -right-2 px-1 py-0.5 text-[10px] min-w-4 h-4 flex items-center justify-center">
                                    {itemCount}
                                </Badge>
                            )}
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 ml-2">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="outline" size="sm">Sign In</Button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <UserButton
                                fallbackRedirectUrl="/"
                                userProfileMode="navigation"
                                userProfileUrl="/account"
                            />
                        </SignedIn>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hidden sm:inline-flex"
                    >
                        <Link href="/wishlist" aria-label="Wishlist">
                            <Heart className="size-5" />
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hidden sm:inline-flex"
                    >
                        <Link href="/account" aria-label="Account">
                            <User className="size-5" />
                        </Link>
                    </Button>
                </div>
            </div>

            {searchOpen && (
                <div className="border-t bg-background p-4 animate-in slide-in-from-top-5">
                    <form onSubmit={handleManualSearch} className="max-w-3xl mx-auto flex gap-2">
                        <Input
                            id="searchInput"
                            placeholder="Search for products, brands, or categories..."
                            className="flex-1"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoComplete="off"
                        />
                        <Button type="submit">Search</Button>
                    </form>
                </div>
            )}
        </header>
    );
}