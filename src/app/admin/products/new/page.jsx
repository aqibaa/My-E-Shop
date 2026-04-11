"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { ArrowLeft, Save, Loader2, SaveAll } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"
import ImageUpload from "@/components/admin/ImageUpload"
import VariantUploader from "@/components/admin/VariantUploader"
import { createProduct } from "@/lib/actions/product.actions"
import { Separator } from "@/components/ui/separator"

export default function AddProductPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    const [images, setImages] = useState([])

    const [colors, setColors] = useState([])

    const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm()

    useEffect(() => {
        const savedDraft = localStorage.getItem("my-product-draft");

        if (savedDraft) {
            const parsedDraft = JSON.parse(savedDraft);
            reset(parsedDraft);
            if (parsedDraft.images) setImages(parsedDraft.images);
            if (parsedDraft.colors) setColors(parsedDraft.colors);
        }

        setIsLoaded(true);
    }, [reset]);

    const saveDraftManually = () => {
        const currentData = getValues();
        const draftToSave = { ...currentData, images: images, colors: colors };

        localStorage.setItem("my-product-draft", JSON.stringify(draftToSave));
        toast.success("Draft saved successfully!");
    }

    const onSubmit = async (data) => {
        const hasGeneralImages = images.length > 0;
        const hasVariantImages = colors.some(color => color.images && color.images.length > 0);

        if (!hasGeneralImages && !hasVariantImages) {
            toast.error("Please upload at least one image for the product.");
            return;
        }

        setIsLoading(true);
        try {
            const featuresArray = data.features
                ? data.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
                : [];

            const sizesArray = data.sizes
                ? data.sizes.split(',').map(s => s.trim()).filter(s => s.length > 0)
                : [];


            let coverImage = "/placeholder.jpg";
            if (hasGeneralImages) {
                coverImage = images[0];
            } else if (hasVariantImages) {
                const firstColorWithImage = colors.find(c => c.images && c.images.length > 0);
                if (firstColorWithImage) {
                    coverImage = firstColorWithImage.images[0];
                }
            }

            const finalData = {
                ...data,
                price: Number(data.price),
                originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
                stock: parseInt(data.stock, 10),
                features: featuresArray,
                sizes: sizesArray,
                badge: data.badge,

                image: coverImage,
                images: images,
                colors: colors,
            }

            await createProduct(finalData);

            localStorage.removeItem("my-product-draft");

            toast.success("Product created!");
            router.refresh();
            router.back();

        } catch (error) {
            toast.error(error.message || "Error saving product.");
            console.error("Submit Error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    if (!isLoaded) return <div className="p-20 text-center">Loading draft...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/products">
                        <Button variant="outline" size="icon" className="rounded-xl" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="font-serif text-2xl font-bold text-foreground">Add New Product</h1>
                </div>
                <Button onClick={saveDraftManually} variant="secondary" className="rounded-xl gap-2"><SaveAll className="h-4 w-4" /> Save as Draft</Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">Basic Information</h2>
                        <div className="space-y-2">
                            <Label>Product Name</Label>
                            <Input {...register("name", { required: true })} placeholder="e.g. Wireless Headphones" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea {...register("description", { required: true })} className="rounded-xl min-h-[100px]" />
                        </div>
                        <div className="space-y-2">
                            <Label>Features (Comma separated)</Label>
                            <Textarea {...register("features")} placeholder="e.g. Wireless, Noise Cancellation, 40h Battery" className="rounded-xl min-h-[80px]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Brand</Label><Input {...register("brand", { required: true })} className="rounded-xl" /></div>
                            <div className="space-y-2"><Label>Category</Label><Input {...register("category", { required: true })} className="rounded-xl" /></div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <Label>Product Badge (Optional)</Label>
                            <Input {...register("badge")} placeholder="e.g. Sale, New Arrival, Top Seller" className="rounded-xl" />
                            <p className="text-xs text-muted-foreground">Leave blank if you don't want a custom text badge.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">General Product Images</h2>
                        <p className="text-sm text-muted-foreground mb-4">Upload general images (like packaging or lifestyle shots). The first image will be the main cover.</p>
                        <ImageUpload
                            value={images}
                            onAdd={(url) => setImages(prev => {
                                if (prev.includes(url)) return prev;
                                return [...prev, url];
                            })}
                            onRemove={(urlToRemove) => setImages(prev => prev.filter((url) => url !== urlToRemove))}
                            maxFiles={1}
                        />

                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <VariantUploader
                            variants={colors}
                            onChange={(newVariants) => setColors(newVariants)}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">Pricing, Stock & Sizes</h2>
                        <div className="space-y-2"><Label>Selling Price ($)</Label><Input type="number" step="0.01" {...register("price", { required: true })} className="rounded-xl" /></div>
                        <div className="space-y-2"><Label>Original Price (Optional)</Label><Input type="number" step="0.01" {...register("originalPrice")} className="rounded-xl" /></div>
                        <div className="space-y-2"><Label>Available Stock</Label><Input type="number" {...register("stock", { required: true })} className="rounded-xl" /></div>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                            <Label>Sizes (Comma separated)</Label>
                            <Input {...register("sizes")} placeholder="e.g. S, M, L, XL" className="rounded-xl" />
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} size="lg" className="w-full rounded-xl gap-2 h-12 text-md bg-blue-600 hover:bg-blue-700 text-white">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {isLoading ? "Publishing..." : "Publish Product"}
                    </Button>
                </div>
            </form>
        </div>
    )
}