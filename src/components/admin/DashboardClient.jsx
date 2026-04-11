// "use client"

// import { useState } from "react"
// import { DollarSign, ShoppingCart, Users, TrendingUp, Search, MoreHorizontal, ArrowUpRight, ArrowDownRight, Eye, Pencil, Trash2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import Link from "next/link"

// function getStatusVariant(status) {
//     switch (status) {
//         case "Delivered":
//         case "Active": return "default"
//         case "Processing":
//         case "In Transit": return "secondary"
//         case "Pending":
//         case "Out of Stock": return "destructive"
//         default: return "outline"
//     }
// }

// export default function DashboardClient({ stats, recentOrders, products }) {
//     const [activeView, setActiveView] = useState("orders")
//     const [searchTerm, setSearchTerm] = useState("")

//     const [orderStatusFilter, setOrderStatusFilter] = useState("all")
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 8;


//     const handleViewChange = (view) => {
//         setActiveView(view);
//         setSearchTerm("");
//         setCurrentPage(1);
//     };

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//         setCurrentPage(1);
//     };

//     const filteredOrders = recentOrders.filter((o) => {
//         const matchesSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             o.id.toLowerCase().includes(searchTerm.toLowerCase());

//         let matchesStatus = true;
//         if (orderStatusFilter === "active") {
//             matchesStatus = o.status !== "Delivered";
//         } else if (orderStatusFilter === "pending") {
//             matchesStatus = o.status === "Pending";
//         }

//         return matchesSearch && matchesStatus;
//     });

//     const filteredProducts = products.filter((p) =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.sku.toLowerCase().includes(searchTerm.toLowerCase())
//     )


//     const activeDataLength = activeView === "orders" ? filteredOrders.length : filteredProducts.length;
//     const totalPages = Math.ceil(activeDataLength / itemsPerPage) || 1;

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
//     const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

//     const statsCards = [
//         { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, change: "+12.5%", trend: "up", icon: DollarSign },
//         { label: "Active Orders", value: stats.totalOrders, change: "+8.2%", trend: "up", icon: ShoppingCart },
//         { label: "Total Customers", value: stats.totalCustomers, change: "+5.1%", trend: "up", icon: Users },
//         { label: "Conversion Rate", value: "3.24%", change: "-0.4%", trend: "down", icon: TrendingUp },
//     ]

//     return (
//         <div>
//             <h1 className="mb-8 text-2xl font-bold text-foreground">Dashboard Overview</h1>

//             {/* Stats Cards */}
//             <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//                 {statsCards.map((card) => {
//                     const Icon = card.icon
//                     return (
//                         <div key={card.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
//                             <div className="mb-3 flex items-center justify-between">
//                                 <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
//                                 <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                                     <Icon className="size-4" />
//                                 </div>
//                             </div>
//                             <p className="text-2xl font-bold text-foreground">{card.value}</p>
//                         </div>
//                     )
//                 })}
//             </div>

//             <div className="rounded-2xl border border-border bg-card shadow-sm">
//                 <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border-b">
//                     <div className="flex items-center gap-2">
//                         <Button variant={activeView === "orders" ? "default" : "secondary"} size="sm" className="rounded-xl" onClick={() => { setActiveView("orders"); setSearchTerm("") }}>
//                             Recent Orders
//                         </Button>
//                         <Button variant={activeView === "products" ? "default" : "secondary"} size="sm" className="rounded-xl" onClick={() => { setActiveView("products"); setSearchTerm("") }}>
//                             Products
//                         </Button>
//                     </div>
//                     <div className="flex flex-col md:flex-row  gap-5">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//                             <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className=" w-55 md:w-64 rounded-xl pl-9" />
//                         </div>
//                         {activeView === "orders" && (
//                             <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
//                                 <SelectTrigger className="w-32 rounded-xl">
//                                     <SelectValue placeholder="Status" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">All Orders</SelectItem>
//                                     <SelectItem value="active">Active (Processing)</SelectItem>
//                                     <SelectItem value="pending">Pending</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         )}
//                     </div>
//                 </div>

//                 {/* Orders Table */}
//                 {activeView === "orders" && (
//                     <Table>
//                         <TableHeader>
//                             <TableRow className="bg-gray-50/50">
//                                 <TableHead className="pl-5">Order ID</TableHead>
//                                 <TableHead>Customer</TableHead>
//                                 <TableHead>Date</TableHead>
//                                 <TableHead>Total</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead className="w-10 pr-5" />
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {paginatedOrders.length > 0 ? (
//                                 paginatedOrders.map((order) => (
//                                     <TableRow key={order.id}>
//                                         <TableCell className="pl-5 font-mono text-sm">#{order.id.slice(-6).toUpperCase()}</TableCell>
//                                         <TableCell>
//                                             <div>
//                                                 <p className="text-sm font-medium">{order.customer}</p>
//                                                 <p className="text-xs text-muted-foreground">{order.email}</p>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
//                                         <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
//                                         <TableCell><Badge variant={getStatusVariant(order.status)} className="rounded-lg">{order.status}</Badge></TableCell>
//                                         <TableCell className="pr-5">
//                                             {/* Eye icon ab Order details page par le jayega */}
//                                             <Link href={`/order/${order.id}`} target="_blank">
//                                                 <Button variant="ghost" size="icon"><Eye className="size-4" /></Button>
//                                             </Link>                                    </TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
//                                         No orders found matching this filter.
//                                     </TableCell>
//                                 </TableRow>
//                             )}

//                         </TableBody>
//                     </Table>
//                 )}

//                 {
//                     activeView === "products" && (
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead className="pl-5">Product</TableHead>
//                                     <TableHead>SKU</TableHead>
//                                     <TableHead>Price</TableHead>
//                                     <TableHead>Stock</TableHead>
//                                     <TableHead>Status</TableHead>
//                                     <TableHead className="w-10 pr-5" />
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {paginatedProducts.map((product) => (
//                                     <TableRow key={product.id}>
//                                         <TableCell className="pl-5 font-medium text-foreground">
//                                             {product.name}
//                                         </TableCell>
//                                         <TableCell className="text-muted-foreground">
//                                             {product.sku}
//                                         </TableCell>
//                                         <TableCell className="font-medium text-foreground">
//                                             ${product.price.toFixed(2)}
//                                         </TableCell>
//                                         <TableCell className="text-muted-foreground">
//                                             {product.stock}
//                                         </TableCell>
//                                         <TableCell>
//                                             <Badge
//                                                 variant={getStatusVariant(product.status)}
//                                                 className="rounded-lg text-[10px]"
//                                             >
//                                                 {product.status}
//                                             </Badge>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     )
//                 }

//                 {/* Table footer */}
//                 <div className="flex items-center justify-between p-5 text-xs text-muted-foreground">
//                     <span>
//                         Showing page {currentPage} of {totalPages} ({activeDataLength} total records)

//                     </span>
//                     <div className="flex items-center gap-2">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="rounded-xl"
//                             disabled={currentPage === 1}
//                             onClick={() => setCurrentPage(prev => prev - 1)}
//                         >
//                             Previous
//                         </Button>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="rounded-xl"
//                             disabled={currentPage === totalPages}
//                             onClick={() => setCurrentPage(prev => prev + 1)}
//                         >
//                             Next
//                         </Button>
//                     </div>
//                 </div>
//             </div >
//         </div >
//     )
// }


"use client"

import { useState } from "react"
import { DollarSign, ShoppingCart, Users, PackageSearch, Search, Eye } from "lucide-react"
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
    // --- 1. STATES ---
    const [activeView, setActiveView] = useState("orders")
    const [searchTerm, setSearchTerm] = useState("")
    const [orderStatusFilter, setOrderStatusFilter] = useState("all")

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleViewChange = (view) => {
        setActiveView(view);
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

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
    );

    const activeDataLength = activeView === "orders" ? filteredOrders.length : filteredProducts.length;
    const totalPages = Math.ceil(activeDataLength / itemsPerPage) || 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const statsCards = [
        { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
        { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart },
        { label: "Total Customers", value: stats.totalCustomers, icon: Users },
        { label: "Total Products", value: products.length, icon: PackageSearch }, // Changed from Conversion Rate to Real Products count
    ]

    return (
        <div>
            <h1 className="mb-8 font-serif text-2xl font-bold text-foreground">Dashboard Overview</h1>

            {/* STATS CARDS */}
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

                {/* TOOLBAR */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border-b">
                    <div className="flex items-center gap-2">
                        <Button variant={activeView === "orders" ? "default" : "secondary"} size="sm" className="rounded-xl" onClick={() => handleViewChange("orders")}>
                            Recent Orders
                        </Button>
                        <Button variant={activeView === "products" ? "default" : "secondary"} size="sm" className="rounded-xl" onClick={() => handleViewChange("products")}>
                            Products
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search..." value={searchTerm} onChange={handleSearchChange} className="w-64 rounded-xl pl-9" />
                        </div>

                        {activeView === "orders" && (
                            <Select value={orderStatusFilter} onValueChange={(val) => { setOrderStatusFilter(val); setCurrentPage(1); }}>
                                <SelectTrigger className="w-32 rounded-xl">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Orders</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                {/* ORDERS TABLE */}
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
                            {paginatedOrders.length > 0 ? (
                                paginatedOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="pl-5 font-mono text-sm">#{order.id.slice(-8).toUpperCase()}</TableCell>
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
                                            <Link href={`/order/${order.id}`} target="_blank">
                                                <Button variant="ghost" size="icon"><Eye className="size-4" /></Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}

                {/* PRODUCTS TABLE */}
                {activeView === "products" && (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50">
                                <TableHead className="pl-5">Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedProducts.length > 0 ? (
                                paginatedProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="pl-5 font-medium text-foreground">{product.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                                        <TableCell className="font-medium text-foreground">${product.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-muted-foreground">{product.stock}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(product.status)} className="rounded-lg text-[10px]">{product.status}</Badge></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}

                {/* PAGINATION FOOTER */}
                <div className="flex items-center justify-between p-5 text-xs text-muted-foreground border-t">
                    <span>
                        Showing page {currentPage} of {totalPages} ({activeDataLength} total records)
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}