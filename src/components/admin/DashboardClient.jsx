"use client"

import { useState } from "react"
import { DollarSign, ShoppingCart, Users, TrendingUp, Search, MoreHorizontal, ArrowUpRight, ArrowDownRight, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

function getStatusVariant(status) {
    switch (status) {
        case "Delivered":
        case "Active": return "default"
        case "Processing":
        case "In Transit": return "secondary"
        case "Pending":
        case "Out of Stock": return "destructive"
        default: return "outline"
    }
}

export default function DashboardClient({ stats, recentOrders, products }) {
    const [activeView, setActiveView] = useState("orders")
    const [searchTerm, setSearchTerm] = useState("")

    const [orderStatusFilter, setOrderStatusFilter] = useState("all")

    const filteredOrders = recentOrders.filter((o) => {
        const matchesSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.id.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (orderStatusFilter === "active") {
            matchesStatus = o.status !== "Delivered";
        } else if (orderStatusFilter === "pending") {
            matchesStatus = o.status === "Pending";
        }

        return matchesSearch && matchesStatus;
    });

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const statsCards = [
        { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, change: "+12.5%", trend: "up", icon: DollarSign },
        { label: "Active Orders", value: stats.totalOrders, change: "+8.2%", trend: "up", icon: ShoppingCart },
        { label: "Total Customers", value: stats.totalCustomers, change: "+5.1%", trend: "up", icon: Users },
        { label: "Conversion Rate", value: "3.24%", change: "-0.4%", trend: "down", icon: TrendingUp },
    ]

    return (
        <div>
            <h1 className="mb-8 text-2xl font-bold text-foreground">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statsCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div key={card.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
                                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Icon className="size-4" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{card.value}</p>
                        </div>
                    )
                })}
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border-b">
                    <div className="flex items-center gap-2">
                        <Button variant={activeView === "orders" ? "default" : "secondary"} size="sm" className="rounded-xl" onClick={() => { setActiveView("orders"); setSearchTerm("") }}>
                            Recent Orders
                        </Button>
                        <Button variant={activeView === "products" ? "default" : "secondary"} size="sm" className="rounded-xl" onClick={() => { setActiveView("products"); setSearchTerm("") }}>
                            Products
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 rounded-xl pl-9" />
                        </div>
                        {activeView === "orders" && ( // Dropdown sirf orders view me dikhega
                            <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                                <SelectTrigger className="w-32 rounded-xl">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Orders</SelectItem>
                                    <SelectItem value="active">Active (Processing)</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                {/* Orders Table */}
                {activeView === "orders" && (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50">
                                <TableHead className="pl-5">Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-10 pr-5" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="pl-5 font-mono text-sm">#{order.id.slice(-6).toUpperCase()}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium">{order.customer}</p>
                                                <p className="text-xs text-muted-foreground">{order.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                                        <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(order.status)} className="rounded-lg">{order.status}</Badge></TableCell>
                                        <TableCell className="pr-5">
                                            {/* Eye icon ab Order details page par le jayega */}
                                            <Link href={`/order/${order.id}`} target="_blank">
                                                <Button variant="ghost" size="icon"><Eye className="size-4" /></Button>
                                            </Link>                                    </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No orders found matching this filter.
                                    </TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>
                )}

                {
                    activeView === "products" && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-5">Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-10 pr-5" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="pl-5 font-medium text-foreground">
                                            {product.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {product.sku}
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">
                                            ${product.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {product.stock}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getStatusVariant(product.status)}
                                                className="rounded-lg text-[10px]"
                                            >
                                                {product.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )
                }

                {/* Table footer */}
                <div className="flex items-center justify-between p-5 text-xs text-muted-foreground">
                    <span>
                        Showing{" "}
                        {activeView === "orders"
                            ? filteredOrders.length
                            : filteredProducts.length}{" "}
                        results
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl" disabled>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl">
                            Next
                        </Button>
                    </div>
                </div>
            </div >
        </div >
    )
}