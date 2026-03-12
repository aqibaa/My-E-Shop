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
import { createProduct } from "@/lib/actions/product.actions"

export default function AddProductPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm()


    useEffect(() => {
        const savedDraft = localStorage.getItem("my-product-draft");

        if (savedDraft) {
            const parsedDraft = JSON.parse(savedDraft);
            reset(parsedDraft);
            if (parsedDraft.images) setImages(parsedDraft.images);
        }

        setIsLoaded(true);
    }, [reset]);

    // const deleteDraftManually = () => {
    //     const currentData = getValues();
    //     const draftToSave = { ...currentData, images: images };

    //     localStorage.setItem("my-product-draft", JSON.stringify(draftToSave)); // Save kardo
    //     toast.success("Draft saved successfully!");
    // }

    const saveDraftManually = () => {
        const currentData = getValues();
        const draftToSave = { ...currentData, images: images };

        localStorage.setItem("my-product-draft", JSON.stringify(draftToSave)); // Save kardo
        toast.success("Draft saved successfully!");
    }


    const onSubmit = async (data) => {
        if (images.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }

        setIsLoading(true);
        try {
            const finalData = {
                ...data,
                images: images,
                price: Number(data.price),
                originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
                stock: parseInt(data.stock, 10),
            }

            await createProduct(finalData);

            localStorage.removeItem("my-product-draft");

            toast.success("Product created!");
            router.push("/admin/products");
            router.refresh();

        } catch (error) {
            toast.error(error.message || "Error saving product.");
        } finally {
            setIsLoading(false);
        }
    }



    if (!isLoaded) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-gray-500">Loading draft...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/products">
                        <Button variant="outline" size="icon" className="rounded-xl">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="font-serif text-2xl font-bold text-foreground">Add New Product</h1>
                </div>
                <Button onClick={saveDraftManually} className="rounded-xl gap-2">
                    <SaveAll className="h-4 w-4" /> Save as Draft
                </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">Basic Information</h2>

                        <div className="space-y-2">
                            <Label>Product Name</Label>
                            <Input {...register("name", { required: true })} placeholder="e.g. Wireless Headphones" className="rounded-xl" />
                            {errors.name && <span className="text-xs text-red-500">Name is required</span>}
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea {...register("description", { required: true })} placeholder="Describe the product..." className="rounded-xl min-h-[120px]" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Brand</Label>
                                <Input {...register("brand", { required: true })} placeholder="e.g. Sony" className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input {...register("category", { required: true })} placeholder="e.g. Electronics" className="rounded-xl" />
                            </div>
                        </div>
                    </div>
                    {/* <Button onClick={deleteDraftManually} className="rounded-xl gap-2">
                        <SaveAll className="h-4 w-4" /> Save as Draft
                    </Button> */}

                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">Product Images</h2>
                        <p className="text-sm text-muted-foreground mb-4">Upload high-quality images. The first image will be the main cover.</p>

                        <ImageUpload
                            value={images}
                            onChange={(url) => setImages([...images, url])}
                            onRemove={(url) => setImages(images.filter((val) => val !== url))}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">Pricing & Stock</h2>

                        <div className="space-y-2">
                            <Label>Selling Price ($)</Label>
                            <Input type="number" step="0.01" {...register("price", { required: true })} placeholder="0.00" className="rounded-xl" />
                        </div>

                        <div className="space-y-2">
                            <Label>Original Price (Optional)</Label>
                            <Input type="number" step="0.01" {...register("originalPrice")} placeholder="0.00" className="rounded-xl" />
                        </div>

                        <div className="space-y-2">
                            <Label>Available Stock</Label>
                            <Input type="number" {...register("stock", { required: true })} placeholder="0" className="rounded-xl" />
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} size="lg" className="w-full rounded-xl gap-2 h-12 text-md">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {isLoading ? "Saving..." : "Save Product"}
                    </Button>
                </div>

            </form>
        </div>
    )
}