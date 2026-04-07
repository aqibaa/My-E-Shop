"use client"

import { useState, useCallback } from "react"
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { deleteProduct } from "@/lib/actions/product.actions"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { toast } from "sonner"




export default function ProductsClient({ data, totalPages, currentPage, totalCount, currentSearch }) {
    const [searchTerm, setSearchTerm] = useState(currentSearch || "")
    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();



    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const updateUrl = useCallback(
        debounce((value) => {
            const current = new URLSearchParams(Array.from(searchParams.entries()));

            if (value.trim() !== "") {
                current.set("search", value.trim());
            } else {
                current.delete("search");
            }

            current.set("page", "1");

            router.push(`${pathname}?${current.toString()}`);
        }, 500),
        [searchParams, pathname, router]
    );

    const handleInputChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val); 
        updateUrl(val);    
    };



    const handlePageChange = (newPage) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("page", newPage);
        router.push(`${pathname}?${current.toString()}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            try {
                await deleteProduct(id);
                toast.success("Product deleted successfully");
                router.refresh();
            } catch (error) {
                toast.error("Failed to delete product");
            }
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-foreground">
                    Products Management
                </h1>
                <Link href="/admin/products/new">
                    <Button className="rounded-xl gap-2">
                        <Plus className="size-4" /> Add New Product
                    </Button>
                </Link>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="p-5 border-b flex items-center gap-3 justify-between bg-gray-50/50">

                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleInputChange}
                            className="rounded-xl pl-9 bg-white"
                            autoComplete="off"
                        />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total: {totalCount} Products
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-16 pl-5">Image</TableHead>
                            <TableHead>Product Details</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right pr-5">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="pl-5">
                                    <div className="relative size-12 rounded-lg overflow-hidden bg-secondary border">
                                        <Image
                                            src={product.images[0] || "/placeholder.jpg"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium text-foreground line-clamp-1 max-w-62.5">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">ID: {product.id.slice(-6).toUpperCase()}</p>
                                </TableCell>

                                <TableCell>
                                    <Badge variant="secondary" className="rounded-lg">{product.category}</Badge>
                                </TableCell>

                                <TableCell className="font-medium">
                                    ${Number(product.price).toFixed(2)}
                                </TableCell>

                                <TableCell>
                                    {product.stock > 10 ? (
                                        <span className="text-green-600 font-medium">{product.stock} in stock</span>
                                    ) : product.stock > 0 ? (
                                        <span className="text-orange-500 font-medium">Low: {product.stock}</span>
                                    ) : (
                                        <Badge variant="destructive" className="rounded-lg">Out of Stock</Badge>
                                    )}
                                </TableCell>

                                <TableCell className="text-right pr-5">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon-sm">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/product/${product.slug}`} target="_blank">
                                                    <Eye className="mr-2 size-4" /> View in Store
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <Pencil className="mr-2 size-4" /> Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(product.id)}
                                                className="text-destructive focus:text-destructive">
                                                <Trash2 className="mr-2 size-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {data.length === 0 &&  (
                    <div className="p-10 text-center text-muted-foreground">
                        No products found matching your search.
                    </div>
                )}
                <div className="flex items-center justify-between p-5 text-xs text-muted-foreground border-t">
                    <span>
                        Showing page {currentPage} of {totalPages} ({data.length} items on this page)
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