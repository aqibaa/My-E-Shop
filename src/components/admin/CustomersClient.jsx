"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, User, Mail, Calendar, ShoppingBag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "../ui/button"

export default function CustomersClient({ customers, totalPages, currentPage, totalCount, currentSearch }) {
    const [searchTerm, setSearchTerm] = useState(currentSearch || "")
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSearch = (e) => {
        e.preventDefault();
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (searchTerm.trim()) {
            current.set("search", searchTerm);
        } else {
            current.delete("search");
        }

        current.set("page", 1); 
        router.push(`${pathname}?${current.toString()}`);
    }

    const handlePageChange = (newPage) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("page", newPage);
        router.push(`${pathname}?${current.toString()}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-foreground">Customers Directory</h1>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="p-5 border-b flex flex-col gap-5 md:flex-row md:items-center md:justify-between bg-gray-50/50">
                    <form onSubmit={handleSearch} className="relative w-full max-w-sm flex gap-2">

                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-xl pl-9 bg-white"
                            />
                        </div>
                        <Button type="submit" variant="secondary" className="rounded-xl">Search</Button>
                    </form>

                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="size-4" /> Total: {customers.length} Customers
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="pl-5">Customer</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>Joined Date</TableHead>
                            <TableHead className="text-center">Total Orders</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="pl-5">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-10 border">
                                                <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-foreground">{customer.name}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="size-3" />
                                            <span className="text-sm">{customer.email}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <Calendar className="size-3" />
                                            {new Date(customer.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                                            <ShoppingBag className="size-3 text-gray-500" />
                                            {customer.totalOrders}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between p-5 text-xs text-muted-foreground border-t bg-gray-50/50">
                    <span>
                        Showing page {currentPage} of {totalPages} ({customers.length} items on this page)
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline" size="sm" className="rounded-xl"
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline" size="sm" className="rounded-xl"
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}