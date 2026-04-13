"use client"

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
    const pathname = usePathname();
    const [email, setEmail] = useState("");
    const [isSubscribing, setIsSubscribing] = useState(false);

    if (pathname.startsWith('/admin')) {
        return null;
    }

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter a valid email address.");
            return;
        }
        
        setIsSubscribing(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); 
            toast.success("Thank you for subscribing to our newsletter!");
            setEmail(""); 
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubscribing(false);
        }
    }

    return (
        <footer className="bg-white border-t pb-8 pt-12 mt-auto">
            <div className="wrapper max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Column 1: Brand Info */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground">My-E-Shop</h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            Curated collections for the modern lifestyle. Quality meets design. Delivering premium products globally since 2026.
                        </p>
                    </div>

                    {/* Column 2: Shop Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-foreground">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                <Link href="/product?sort=newest" className="hover:text-blue-600 transition-colors">New Arrivals</Link>
                            </li>
                            <li>
                                <Link href="/product?sort=rating" className="hover:text-blue-600 transition-colors">Best Sellers</Link>
                            </li>
                            <li>
                                <Link href="/product?category=Electronics" className="hover:text-blue-600 transition-colors">Electronics</Link>
                            </li>
                            <li>
                                <Link href="/product?category=Fashion" className="hover:text-blue-600 transition-colors">Fashion</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Support & Company */}
                    <div>
                        <h4 className="font-bold mb-4 text-foreground">Company & Support</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                <Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link>
                            </li>
                            <li>
                                <Link href="/account" className="hover:text-blue-600 transition-colors">My Account</Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="hover:text-blue-600 transition-colors">Wishlist</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h4 className="font-bold mb-4 text-foreground">Newsletter</h4>
                        <p className="text-sm text-gray-500 mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <form onSubmit={handleSubscribe} className="flex gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="email"
                                    className="border rounded-xl pl-9 pr-3 py-2 w-full text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                    placeholder="Enter your email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isSubscribing} className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors min-w-[80px]">
                                {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Join"}
                            </Button>
                        </form>
                    </div>
                </div>

                <Separator className="my-8" />
                
                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} My-E-Shop. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {["VISA", "MASTERCARD", "STRIPE", "PAYPAL"].map((badge) => (
                                <span
                                    key={badge}
                                    className="rounded-md border border-border bg-gray-50 px-2 py-1 text-[10px] font-bold text-gray-500 tracking-wider"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}