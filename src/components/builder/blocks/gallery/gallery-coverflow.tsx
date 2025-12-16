"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import {
    Autoplay,
    EffectCoverflow,
    Navigation,
    Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { cn } from "@/lib/utils";

interface GalleryCoverflowProps {
    images: { id: string; url: string; alt?: string }[]
    borderRadius?: string
}

export function GalleryCoverflow({ images, borderRadius = '0.75rem' }: GalleryCoverflowProps) {
    // Defaults based on the user's "Skiper47" usage example
    const showPagination = true;
    const showNavigation = true;
    const loop = true;
    const autoplay = false; // Optional, maybe false for builder to avoid distraction? User had it in the component but usage didn't set it (default false). 
    const spaceBetween = 40;

    const css = `
  .Carousal_001 {
    padding-bottom: 40px !important;
  }
  .swiper-pagination-bullet {
    background-color: #cbd5e1 !important;
    opacity: 0.5;
  }
  .swiper-pagination-bullet-active {
    background-color: #0f172a !important;
    opacity: 1;
  }
  `;

    const prevRef = React.useRef<HTMLDivElement>(null);
    const nextRef = React.useRef<HTMLDivElement>(null);

    // Force re-render to attach refs
    const [_, setInit] = React.useState(false);
    React.useEffect(() => {
        setInit(true);
    }, []);

    if (!images || images.length === 0) return null;

    // Only loop if we have enough images to make it look smooth
    const shouldLoop = loop && images.length >= 3;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.3,
            }}
            className="w-full h-full flex items-center justify-center relative overflow-hidden"
        >
            <style>{css}</style>

            <Swiper
                spaceBetween={spaceBetween}
                // Only enable autoplay if requested, or if we want it. Defaults to false in snippet.
                autoplay={
                    autoplay
                        ? {
                            delay: 1500,
                            disableOnInteraction: false,
                        }
                        : false
                }
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                loop={shouldLoop}
                slidesPerView={'auto'} // User snippet had 2.43, but 'auto' with specific CSS width on slides is often more robust for responsive. 
                // However, let's try to respect the user's intent. 2.43 might be specific for their container width. 
                // Given we are in a responsive grid, 'auto' is safer.
                coverflowEffect={{
                    rotate: 0,
                    slideShadows: false,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                }}
                pagination={
                    showPagination
                        ? {
                            clickable: true,
                            dynamicBullets: true
                        }
                        : false
                }
                navigation={
                    showNavigation && prevRef.current && nextRef.current
                        ? {
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }
                        : undefined
                }
                onBeforeInit={(swiper) => {
                    if (typeof swiper.params.navigation !== 'boolean') {
                        const navigation = swiper.params.navigation;
                        if (navigation) {
                            navigation.prevEl = prevRef.current;
                            navigation.nextEl = nextRef.current;
                        }
                    }
                }}
                className="Carousal_001 w-full h-full"
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
            >
                {images.map((image) => (
                    <SwiperSlide
                        key={image.id}
                        className="!w-[240px] !h-[320px] sm:!w-[280px] md:!w-[340px] overflow-hidden border border-slate-200 bg-white shadow-sm"
                        // Adjusted widths to be responsiveish. User snippet had `!h-[320px] w-full`. 
                        // In a grid layout block, height is constrained by the block height.
                        // We should probably let height be 100% or close to it.
                        style={{ height: '90%', alignSelf: 'center', borderRadius }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className="h-full w-full object-cover"
                            src={image.url}
                            alt={image.alt || "Gallery Image"}
                            draggable={false}
                        />
                    </SwiperSlide>
                ))}

                {showNavigation && (
                    <>
                        <div ref={prevRef} className={cn("swiper-button-prev !text-slate-800 !w-8 !h-8 !bg-white/80 !backdrop-blur-sm !rounded-full !shadow-sm !left-2 after:!text-xs after:!content-[''] flex items-center justify-center hover:!bg-white cursor-pointer z-10 absolute top-1/2 -translate-y-1/2", !shouldLoop && "ui-disabled:opacity-50 ui-disabled:cursor-not-allowed")}>
                            <ChevronLeftIcon className="h-4 w-4" />
                        </div>
                        <div ref={nextRef} className={cn("swiper-button-next !text-slate-800 !w-8 !h-8 !bg-white/80 !backdrop-blur-sm !rounded-full !shadow-sm !right-2 after:!text-xs after:!content-[''] flex items-center justify-center hover:!bg-white cursor-pointer z-10 absolute top-1/2 -translate-y-1/2", !shouldLoop && "ui-disabled:opacity-50 ui-disabled:cursor-not-allowed")}>
                            <ChevronRightIcon className="h-4 w-4" />
                        </div>
                    </>
                )}
            </Swiper>
        </motion.div>
    );
}
