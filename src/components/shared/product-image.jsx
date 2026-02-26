"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProductImages({ images, name }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-gray-50">
        <Image 
            src={images[current]} 
            alt={name} 
            fill 
            className="object-contain p-4"
            priority
        />
      </div>
      <div className="flex gap-4 overflow-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "relative w-20 h-20 rounded-md overflow-hidden border-2 shrink-0 bg-white",
              current === index ? "border-blue-600" : "border-gray-200"
            )}
          >
            <Image src={img} alt="thumbnail" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}