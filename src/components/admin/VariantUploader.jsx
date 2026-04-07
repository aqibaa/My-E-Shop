"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageUpload from "./ImageUpload"

export default function VariantUploader({ variants = [], onChange }) {

  const addVariant = () => {
    onChange([...variants, { name: "", colorCode: "#000000", images: [] }]);
  };

  const removeVariant = (indexToRemove) => {
    onChange(variants.filter((_, index) => index !== indexToRemove));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    onChange(newVariants);
  };

  const addImageToVariant = (index, newUrl) => {
    const newVariants = [...variants];

    if (!newVariants[index].images) {
      newVariants[index].images = [];
    }

    if (!newVariants[index].images.includes(newUrl)) {
      newVariants[index].images.push(newUrl);
      onChange(newVariants);
    }
  };

  const removeImageFromVariant = (index, urlToRemove) => {
    const newVariants = [...variants];
    if (newVariants[index].images) {
      newVariants[index].images = newVariants[index].images.filter(url => url !== urlToRemove);
      onChange(newVariants);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Color Variants & Images</Label>
        <Button type="button" variant="outline" size="sm" onClick={addVariant} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Color
        </Button>
      </div>

      {variants.length === 0 && (
        <div className="p-6 text-center border-2 border-dashed rounded-xl bg-gray-50 text-gray-500 text-sm">
          No color variants added. The product will use general images.
        </div>
      )}

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={index} 
            className="p-4 border rounded-xl bg-gray-50/50 space-y-4 relative group"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeVariant(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
              <div className="space-y-2">
                <Label className="text-xs">Color Name</Label>
                <Input
                  value={variant.name} // The Fix for Input Lock
                  onChange={(e) => updateVariant(index, "name", e.target.value)}
                  className="rounded-lg bg-white h-9"
                  placeholder="e.g. Black"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Color Code (Hex)</Label>
                <div className="flex items-center gap-2">
                  <Input type="color" value={variant.colorCode} onChange={(e) => updateVariant(index, "colorCode", e.target.value)} className="w-12 h-9 p-1 rounded-lg cursor-pointer bg-white" />
                  <Input type="text" value={variant.colorCode} onChange={(e) => updateVariant(index, "colorCode", e.target.value)} className="rounded-lg bg-white h-9 uppercase font-mono text-sm" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-xs mb-2 block text-gray-500">Images for {variant.name || "this color"} (Max 5)</Label>
              <ImageUpload
                value={variant.images || []}
                onAdd={(url) => addImageToVariant(index, url)}
                onRemove={(url) => removeImageFromVariant(index, url)}
                maxFiles={5}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}