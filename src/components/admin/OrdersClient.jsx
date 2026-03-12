"use client"

import { useState } from "react"
import { Search, Eye, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"
import { updateOrderStatus } from "@/lib/actions/order.actions"



export default function OrdersClient({ orders }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [loadingId, setLoadingId] = useState(null) // Kaunsa order update ho raha hai uski ID

    const filteredOrders = orders.filter((order) => {
        const address = JSON.parse(order.shippingAddress || '{}');
        const customerName = `${address.firstName || ''} ${address.lastName || ''}`.toLowerCase();

        return (
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerName.includes(searchTerm.toLowerCase())
        );
    });

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

                <div className="p-5 border-b flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by Order ID or Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-xl pl-9 bg-white"
                        />
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Truck className="size-4" /> Total: {orders.length} Orders
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
                        {filteredOrders.map((order) => {
                            const address = JSON.parse(order.shippingAddress || '{}');
                            const customerName = `${address.firstName || 'Guest'} ${address.lastName || ''}`;

                            return (
                                <TableRow key={order.id}>
                                    <TableCell className="pl-5 font-mono text-sm font-medium">
                                        #{order.id.slice(-8).toUpperCase()}
                                    </TableCell>

                                    <TableCell>
                                        <p className="text-sm font-medium text-foreground">{customerName}</p>
                                        <p className="text-xs text-muted-foreground">{address.email || 'No email'}</p>
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        ${order.totalPrice.toFixed(2)}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                defaultValue={order.status}
                                                onValueChange={(val) => handleStatusChange(order.id, val)}
                                                disabled={loadingId === order.id}
                                            >
                                                <SelectTrigger className={`w-[130px] h-8 text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''
                                                    }`}>
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
                                                <Eye className="mr-2 size-3" /> View Detail
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                {filteredOrders.length === 0 && (
                    <div className="p-10 text-center text-muted-foreground">
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    )
}