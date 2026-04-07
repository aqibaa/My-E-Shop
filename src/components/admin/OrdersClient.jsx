"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import { Search, Eye, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"
import { updateOrderStatus } from "@/lib/actions/order.actions"



export default function OrdersClient({ orders, totalPages, currentPage, totalCount, currentSearch, currentStatus }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [loadingId, setLoadingId] = useState(null)
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


    const handleStatusFilterChange = (value) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("status", value);
        current.set("page", 1);
        router.push(`${pathname}?${current.toString()}`);
    }

    const handlePageChange = (newPage) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("page", newPage);
        router.push(`${pathname}?${current.toString()}`);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setLoadingId(orderId);
        try {
            const response = await updateOrderStatus(orderId, newStatus);
            if (response && response.success) {
                toast.success(`Order successfully marked as ${newStatus}`);
            }
        } catch (error) {
            console.error("Frontend caught error:", error);
            toast.error(error.message || "Failed to update order status");
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">

                <div className="p-5 border-b flex flex-col gap-5 md:flex-row md:items-center md:justify-between bg-gray-50/50">
                    <form onSubmit={handleSearch} className="relative w-full max-w-sm flex gap-2">

                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by Order ID or Customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-xl pl-9 bg-white"
                            />
                        </div>
                        <Button type="submit" variant="secondary" className="rounded-xl">Search</Button>
                    </form>


                    <div className="flex items-center  sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-sm text-muted-foreground flex items-center sm:gap-2">
                            <Truck className="size-4" /> Total: {totalCount} Orders
                        </div>

                        <Select value={currentStatus} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="w-[160px] rounded-xl bg-white">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Orders</SelectItem>
                                <SelectItem value="active">Active (Processing)</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="pl-5">Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Update Status</TableHead>
                            <TableHead className="text-right pr-5">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => {
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell className="pl-5 font-mono text-sm font-medium">#{order.id.slice(-8).toUpperCase()}</TableCell>
                                        <TableCell>
                                            <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                                            <p className="text-xs text-muted-foreground">{order.email}</p>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="font-medium">${order.totalPrice.toFixed(2)}</TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    defaultValue={order.status}
                                                    onValueChange={(val) => handleStatusChange(order.id, val)}
                                                    disabled={loadingId === order.id}
                                                >
                                                    <SelectTrigger className={`w-[130px] h-8 text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}`}>
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Pending">Pending</SelectItem>
                                                        <SelectItem value="Processing">Processing</SelectItem>
                                                        <SelectItem value="Shipped">Shipped</SelectItem>
                                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {loadingId === order.id && <span className="text-xs text-gray-400">Saving...</span>}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right pr-5">
                                            <Link href={`/order/${order.id}`} target="_blank">
                                                <Button variant="outline" size="sm" className="rounded-xl h-8">
                                                    <Eye className="mr-2 size-3" /> View
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between p-5 text-xs text-muted-foreground border-t bg-gray-50/50">
                    <span>
                        Showing page {currentPage} of {totalPages} ({orders.length} items on this page)
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
        </div >
    )
}