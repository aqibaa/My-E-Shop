"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

import ImageUpload from "@/components/admin/ImageUpload"
import VariantUploader from "@/components/admin/VariantUploader" // THE FIX: Import the uploader
import { getProductById, updateProduct } from "@/lib/actions/product.actions"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const [images, setImages] = useState([])
  const [colors, setColors] = useState([])

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    async function fetchProduct() {
      const data = await getProductById(productId);

      if (data) {
        reset({
          name: data.name,
          description: data.description,
          brand: data.brand,
          category: data.category,
          price: data.price,
          originalPrice: data.originalPrice || "",
          stock: data.stock,
          badge: data.badge || "",
          features: data.features?.join(', ') || "",
          sizes: data.sizes?.join(', ') || "",
        });

        setImages(data.images || []);

        const parsedColors = Array.isArray(data.colors)
          ? data.colors.map((c, i) => ({
            ...c,
            _id: c._id || `existing-${i}-${c.colorCode}-${c.name}`.replace(/[^a-z0-9-]/gi, '')
          }))
          : [];

        setColors(parsedColors);
      } else {
        toast.error("Product not found");
        router.push("/admin/products");
      }
      setIsFetching(false);
    }
    fetchProduct();
  }, [productId, reset, router]);

  const onSubmit = async (data) => {
    const hasGeneralImages = images.length > 0;
    const hasVariantImages = colors.some(color => color.images && color.images.length > 0);

    if (!hasGeneralImages && !hasVariantImages) {
      toast.error("Please upload at least one image for the product or its variants.");
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
        name: data.name,
        description: data.description,
        brand: data.brand,
        category: data.category,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        stock: parseInt(data.stock, 10),
        badge: data.badge || "",
        features: featuresArray,
        sizes: sizesArray,

        image: coverImage,
        images: images,
        colors: colors,
      }

      await updateProduct(productId, finalData);

      toast.success("Product updated successfully!");
      router.refresh();
      router.back();

    } catch (error) {
      toast.error(error.message || "Failed to update product!");
      console.error("Update Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex flex-col h-[50vh] justify-center items-center">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground mb-4" />
        <p className="text-gray-500">Loading product details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-serif text-2xl font-bold text-foreground">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input {...register("name", { required: true })} className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description", { required: true })} className="rounded-xl min-h-30" />
            </div>

            <div className="space-y-2">
              <Label>Features (Comma separated)</Label>
              <Textarea {...register("features")} className="rounded-xl min-h-20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input {...register("brand", { required: true })} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input {...register("category", { required: true })} className="rounded-xl" />
              </div>
              <div className="space-y-2 mt-4">
                <Label>Product Badge (Optional)</Label>
                <Input {...register("badge")} placeholder="e.g. Sale, New Arrival, Top Seller" className="rounded-xl" />
              </div>
            </div>
          </div>

          {/* GENERAL IMAGES */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">General Product Images</h2>
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

          {/* VARIANT UPLOADER */}
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

            <div className="space-y-2">
              <Label>Selling Price ($)</Label>
              <Input type="number" step="0.01" {...register("price", { required: true })} className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Original Price (Optional)</Label>
              <Input type="number" step="0.01" {...register("originalPrice")} className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Available Stock</Label>
              <Input type="number" {...register("stock", { required: true })} className="rounded-xl" />
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label>Sizes (Comma separated)</Label>
              <Input {...register("sizes")} placeholder="e.g. S, M, L, XL" className="rounded-xl" />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} size="lg" className="w-full rounded-xl gap-2 h-12 text-md bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {isLoading ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
