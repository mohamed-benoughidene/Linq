"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface GalleryStackProps {
    images: { id: string; url: string; alt?: string }[];
    borderRadius?: string;
}

export function GalleryStack({ images, borderRadius = '0.75rem' }: GalleryStackProps) {
    const [activeImage, setActiveImage] = useState<number | null>(0);

    if (!images || images.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.3,
            }}
            className="w-full h-full flex flex-col items-center justify-center p-2 relative overflow-hidden"
        >
            <div className="flex w-full flex-col items-center justify-center gap-1">
                {images.map((image, index) => (
                    <motion.div
                        key={image.id}
                        className="group relative cursor-pointer overflow-hidden w-full border border-slate-200 bg-white"
                        style={{ borderRadius }}
                        initial={{ height: "40px" }}
                        animate={{
                            // Auto-adjust height based on active state. 
                            // "flex-1" or similar might be better for responsiveness, but framer motion likes absolute values or %. 
                            // Let's try to simulate the Skiper53 logic but responsive.
                            height: activeImage === index ? "200px" : "40px",
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onClick={() => setActiveImage(index)}
                        onHoverStart={() => setActiveImage(index)}
                    >
                        <AnimatePresence>
                            {activeImage === index && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute h-full w-full bg-gradient-to-t from-black/50 to-transparent z-10"
                                />
                            )}
                        </AnimatePresence>

                        <img
                            src={image.url}
                            className="h-full w-full object-cover"
                            alt={image.alt || "Gallery Image"}
                            draggable={false}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
