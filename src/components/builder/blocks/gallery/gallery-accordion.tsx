"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GalleryAccordionProps {
    images: { id: string; url: string; alt?: string }[]
    borderRadius?: string
}

export function GalleryAccordion({ images, borderRadius = '1rem' }: GalleryAccordionProps) {
    const [activeIndex, setActiveIndex] = useState(0)

    // Adaptation: Use flex-1 for inactive and flex-[3] or similar for active to responsive sizing
    // instead of fixed width rems.

    return (
        <div className="flex w-full h-full gap-2 overflow-hidden items-center justify-center p-2">
            {images.map((img, index) => (
                <motion.div
                    key={img.id}
                    layout
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                        "relative h-full overflow-hidden cursor-pointer",
                        // Base styling
                    )}
                    style={{ borderRadius }}
                    initial={false}
                    animate={{
                        flex: activeIndex === index ? 3 : 1,
                        opacity: 1 // activeIndex === index ? 1 : 0.7
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 40
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={img.url}
                        alt={img.alt || "Gallery image"}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Optional: Add a subtle overlay for inactive items */}
                    <motion.div
                        className="absolute inset-0 bg-black/20"
                        animate={{ opacity: activeIndex === index ? 0 : 0.4 }}
                    />
                </motion.div>
            ))}
        </div>
    )
}
