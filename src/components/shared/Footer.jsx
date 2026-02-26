import { Separator } from "@/components/ui/separator";

export default function Footer() {
    return (
        <footer className="bg-white border-t pb-8">
            <div className="wrapper max-w-7xl mx-auto px-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-serif text-xl font-bold mb-4">My-E-Shop</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Curated collections for the modern lifestyle. Quality meets design.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>New Arrivals</li>
                            <li>Best Sellers</li>
                            <li>Sale</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Help Center</li>
                            <li>Returns</li>
                            <li>Shipping Info</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Newsletter</h4>
                        <p className="text-sm text-gray-500 mb-4">Subscribe to get special offers.</p>
                        <div className="flex gap-2">
                            <input className="border rounded px-3 py-2 w-full text-sm" placeholder="Email" />
                            <button className="bg-black text-white px-4 py-2 rounded text-sm">Join</button>
                        </div>
                    </div>
                </div>
                <Separator className="my-8" />
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} My-E-Shop. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        {["VISA", "MASTERCARD", "STRIPE", "PAYPAL"].map((badge) => (
                            <span
                                key={badge}
                                className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold text-muted-foreground"
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