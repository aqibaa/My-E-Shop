

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ProductImageZoom({ images = [], alt = "product" }) {
    const [current, setCurrent] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const imageRef = useRef(null);

    const safeImages = Array.isArray(images) && images.length > 0 ? images : ["/placeholder.jpg"];

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();

        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setPosition({ x, y });
    };

    const next = (e) => {
        e?.stopPropagation();
        setCurrent((prev) => (prev + 1) % safeImages.length);
    };

    const prev = (e) => {
        e?.stopPropagation();
        setCurrent((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                className="relative cursor-crosshair aspect-square w-full overflow-hidden rounded-2xl bg-secondary group"
                ref={imageRef}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setShowLightbox(true)}
            >
                <Image
                    src={safeImages[current]}
                    alt={alt}
                    fill
                    className={`object-contain p-4 transition-opacity duration-200 ${showZoom ? 'opacity-0' : 'opacity-100'}`}
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />

                <div
                    className={`absolute inset-0 w-full h-full bg-no-repeat transition-opacity duration-200 ${showZoom ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        backgroundImage: `url(${safeImages[current]})`,
                        backgroundSize: "250%",
                        backgroundPosition: `${position.x}% ${position.y}%`,
                        backgroundColor: "white",
                    }}
                />


                {/* NAV BUTTONS */}
                {safeImages.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            onMouseEnter={() => setShowZoom(false)}
                            className="absolute z-20 cursor-pointer left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"                        >
                            ◀
                        </button>
                        <button
                            onClick={next}
                            onMouseEnter={() => setShowZoom(false)}
                            className="absolute z-20 right-4 top-1/2 cursor-pointer -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"                        >
                            ▶
                        </button>
                    </>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowLightbox(true);
                    }}
                    onMouseEnter={() => setShowZoom(false)}
                    className="absolute z-20 bottom-4 right-4 bg-white/90 hover:bg-white cursor-pointer p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"                >
                    +
                </button>
            </div>

            {safeImages.length > 1 && (
                <div className="flex gap-4 m-8 pb-2 scrollbar-hide">
                    {safeImages.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`relative w-20 h-20 shrink-1 cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${current === i ? "border-black scale-105 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${i + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showLightbox && (
                    <motion.div
                        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(e, info) => {
                                if (info.offset.x > 100) prev();
                                if (info.offset.x < -100) next();
                            }}
                            className="relative w-full max-w-4xl h-[80vh] mx-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <Image
                                src={safeImages[current]}
                                alt="preview"
                                fill
                                className="object-contain"
                            />

                            <button
                                onClick={() => setShowLightbox(false)}
                                className="absolute cursor-pointer bg-white/10 hover:bg-white/20 text-white right-0 -top-12 p-2 rounded-full transition-colors"
                            >
                                <X className="size-6" />
                            </button>

                            {safeImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prev}
                                        className="absolute cursor-pointer left-2 md:-left-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                                    >
                                        ◀
                                    </button>
                                    <button
                                        onClick={next}
                                        className="absolute right-2 md:-right-12 top-1/2 cursor-pointer -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                                    >
                                        ▶
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}




