"use client"

import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function ImageUpload({ value = [], onChange, onRemove }) {
  
  const onUpload = (result) => {
    onChange(result.info.secure_url)
  }

  return (
    <div className="mb-4">
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-32 h-32 rounded-lg overflow-hidden border">
            <Image fill className="object-cover" alt="Product image" src={url} />
            <div className="absolute top-1 right-1 z-10">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon-sm" className="h-6 w-6">
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CldUploadWidget onSuccess={onUpload} uploadPreset="ml_default">
        {({ open }) => {
          return (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => open()}
              className="border-dashed border-2"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget >
    </div>
  )
}