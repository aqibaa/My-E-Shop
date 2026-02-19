"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const NAV_LINKS = [
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Women", href: "/products?category=women" },
    { label: "Men", href: "/products?category=men" },
    { label: "Electronics", href: "/products?category=electronics" },
];

export default function Header() {
    const [searchOpen, setSearchOpen] = useState(false);
    const cartCount = 0; 

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="bg-primary text-primary-foreground py-2 text-center text-xs font-medium tracking-wide">
                Free shipping on orders over $100 — Shop Now
            </div>

            <div className="wrapper flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
                {/* Mobile Menu  */}
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
                    <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
                        {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                    </Button>
                    
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {cartCount > 0 && (
                                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                    {cartCount}
                                </Badge>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>
            {searchOpen && (
                <div className="border-t bg-background p-4 animate-in slide-in-from-top-5">
                    <div className="max-w-3xl mx-auto flex gap-2">
                        <Input placeholder="Search products..." className="flex-1" autoFocus />
                        <Button>Search</Button>
                    </div>
                </div>
            )}
        </header>
    );
}