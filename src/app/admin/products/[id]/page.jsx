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

import ImageUpload from "@/components/admin/ImageUpload"
import { getProductById, updateProduct } from "@/lib/actions/product.actions"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id 

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [images, setImages] = useState([])

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
        });
        setImages(data.images || []);
      } else {
        toast.error("Product not found");
        router.push("/admin/products");
      }
      setIsFetching(false);
    }
    fetchProduct();
  }, [productId, reset, router]);

  // 2. Submit Logic (Update)
  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    setIsLoading(true);
    try {
      const finalData = {
        name: data.name,
        description: data.description,
        brand: data.brand,
        category: data.category,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        stock: parseInt(data.stock, 10),
        images: images,
      }

      await updateProduct(productId, finalData);
      
      toast.success("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();

    } catch (error) {
      toast.error("Failed to update product!");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="outline" size="icon" className="rounded-xl">
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
              <Textarea {...register("description", { required: true })} className="rounded-xl min-h-[120px]" />
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
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Product Images</h2>
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
          </div>

          <Button type="submit" disabled={isLoading} size="lg" className="w-full rounded-xl gap-2 h-12 text-md">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {isLoading ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}