"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"; 
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldAlert, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const ADMIN_EMAILS = ["aaqib.codes@gmail.com"];

const CATEGORY_LINKS = [
    { label: "New Arrivals", href: "/product?sort=newest" },
    { label: "Electronics", href: "/product?category=Electronics" },
    { label: "Fashion", href: "/product?category=Fashion" },
    { label: "Footwear", href: "/product?category=Footwear" },
];

const PAGE_LINKS = [
    { label: "About Us", href: "/about" },
    { label: "Contact Support", href: "/contact" },
];

export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { isLoaded, user } = useUser();
    const isAdmin = isLoaded && user && ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress?.toLowerCase());

    const items = useCartStore((state) => state.items)
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

    const [searchOpen, setSearchOpen] = useState(false);
    const initialSearch = searchParams.get('search') || "";
    const [inputValue, setInputValue] = useState(initialSearch);

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
                    if (searchParams.has('search')) {
                        router.push('/product');
                    }
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
        if (searchOpen && !pathname.includes('/product')) setInputValue("");
        else if (!searchOpen) setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
    };

    if (pathname.startsWith('/admin')) return null;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="bg-primary text-primary-foreground py-2 text-center text-xs font-medium tracking-wide">
                Free shipping on orders over $100 — Shop Now
            </div>

            <div className="wrapper flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">

                {/* --- MOBILE MENU (HAMBURGER) --- */}
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col p-0">
                            <div className="p-6 border-b bg-gray-50/50">
                                <SheetTitle className="font-serif text-2xl mb-4">My-E-Shop</SheetTitle>

                                {/* Mobile User Profile Area */}
                                <SignedIn>
                                    <div className="flex items-center gap-3">
                                        <UserButton afterSignOutUrl="/" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">{user?.firstName || "User"}</span>
                                            <span className="text-xs text-gray-500 truncate max-w-[180px]">{user?.primaryEmailAddress?.emailAddress}</span>
                                        </div>
                                    </div>
                                    <Link href="/account" className="mt-4 flex items-center justify-between w-full p-2 bg-white rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors">
                                        View My Account <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </Link>
                                    {isAdmin && (
                                        <Button variant="ghost" size="sm" asChild className=" text-red-600 hover:text-red-700 hover:bg-red-50 mr-2">
                                            <Link href="/admin" className="mt-4 flex items-center justify-between w-full p-2 bg-white rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors" aria-label="Admin Panel">
                                                <ShieldAlert className="size-4 mr-1.5" /> Admin Panel
                                            </Link>
                                        </Button>
                                    )}
                                </SignedIn>

                                <SignedOut>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm text-gray-500 mb-2">Sign in to view your orders and profile.</p>
                                        <SignInButton mode="modal">
                                            <Button className="w-full">Sign In / Register</Button>
                                        </SignInButton>
                                    </div>
                                </SignedOut>
                            </div>

                            {/* Mobile Navigation Links */}
                            <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Shop Categories</h4>
                                    <div className="flex flex-col gap-4">
                                        {CATEGORY_LINKS.map((link) => (
                                            <Link key={link.href} href={link.href} className="text-base font-medium text-gray-700 hover:text-primary">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Information</h4>
                                    <div className="flex flex-col gap-4">
                                        {PAGE_LINKS.map((link) => (
                                            <Link key={link.href} href={link.href} className="text-base font-medium text-gray-700 hover:text-primary">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="font-serif text-lg sm:text-2xl font-bold tracking-tight">
                        My-E-Shop
                    </Link>
                </div>

                {/* --- DESKTOP NAVIGATION --- */}
                <nav className="hidden lg:flex items-center gap-6">
                    {CATEGORY_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-1 sm:gap-2">

                    {/* Admin Button (Desktop Only) */}
                    {isAdmin && (
                        <Button variant="ghost" size="sm" asChild className="hidden lg:inline-flex text-red-600 hover:text-red-700 hover:bg-red-50 mr-2">
                            <Link href="/admin" aria-label="Admin Panel">
                                <ShieldAlert className="size-4 mr-1.5" /> Admin Panel
                            </Link>
                        </Button>
                    )}

                    <Button variant="ghost" size="icon" onClick={toggleSearch} className="h-9 w-9 sm:h-10 sm:w-10">
                        {searchOpen ? <X className="size-4 sm:size-5" /> : <Search className="size-4 sm:size-5" />}
                    </Button>

                    <Button variant="ghost" size="icon" asChild className="sm:inline-flex h-9 w-9 sm:h-10 sm:w-10">
                        <Link href="/Wishlist" aria-label="Wishlist">
                            <Heart className="size-4 sm:size-5" />
                        </Link>
                    </Button>

                    <Link href="/cart" className="mx-1 sm:mx-2">
                        <div className="relative p-2 hover:bg-gray-100 rounded-md transition-colors">
                            <ShoppingBag className="size-4 sm:size-5" />
                            {itemCount > 0 && (
                                <Badge className="absolute top-0 right-0 px-1 py-0.5 text-[10px] min-w-4 h-4 flex items-center justify-center translate-x-1 -translate-y-1">
                                    {itemCount}
                                </Badge>
                            )}
                        </div>
                    </Link>

                    {/* Desktop Auth/User Profile */}
                    <div className="hidden lg:flex items-center ml-1">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="outline" size="sm" className="h-9">Sign In</Button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <div className="flex items-center gap-5">
                                <Link href="/account">
                                    <User className="size-5" />
                                </Link>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>

            {/* Search Bar Dropdown */}
            {searchOpen && (
                <div className="border-t bg-background p-4 animate-in slide-in-from-top-2">
                    <form onSubmit={handleManualSearch} className="max-w-3xl mx-auto flex gap-2">
                        <Input
                            id="searchInput"
                            placeholder="Search products, brands, or categories..."
                            className="flex-1 rounded-xl"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoComplete="off"
                        />
                        <Button type="submit" className="rounded-xl">Search</Button>
                    </form>
                </div>
            )}
        </header>
    );
}
