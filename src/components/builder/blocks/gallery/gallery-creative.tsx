"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCreative, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { cn } from "@/lib/utils";

interface GalleryCreativeProps {
    images: { id: string; url: string; alt?: string }[]
    borderRadius?: string
}

export function GalleryCreative({ images, borderRadius = '1.5rem' }: GalleryCreativeProps) {
    // Defaults
    const showPagination = true;
    const showNavigation = true;
    const loop = true;
    const autoplay = false;
    const spaceBetween = 0;

    const css = `
  .Carousal_004 {
    width: 100%;
    height: 100%;
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

    // Force re-render after refs are attached so Swiper can pick them up
    // Swiper's navigation prop needs the DOM elements, which are null on first render
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
                autoplay={
                    autoplay
                        ? {
                            delay: 1500,
                            disableOnInteraction: true,
                        }
                        : false
                }
                effect="creative"
                grabCursor={true}
                slidesPerView="auto"
                centeredSlides={true}
                loop={shouldLoop}
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
                // Update navigation after init ensures refs are bound
                onBeforeInit={(swiper) => {
                    if (typeof swiper.params.navigation !== 'boolean') {
                        const navigation = swiper.params.navigation;
                        if (navigation) {
                            navigation.prevEl = prevRef.current;
                            navigation.nextEl = nextRef.current;
                        }
                    }
                }}
                className="Carousal_004"
                creativeEffect={{
                    limitProgress: 2,
                    prev: {
                        shadow: false,
                        translate: ["-20%", 0, -200],
                        rotate: [0, 0, -5],
                    },
                    next: {
                        shadow: false,
                        translate: ["20%", 0, -200],
                        rotate: [0, 0, 5],
                    },
                }}
                modules={[EffectCreative, Pagination, Autoplay, Navigation]}
            >
                {images.map((image) => (
                    <SwiperSlide key={image.id} className="!w-[240px] !h-[320px] sm:!w-[280px] md:!w-[340px] overflow-hidden bg-white shadow-sm border border-slate-100" style={{ alignSelf: 'center', borderRadius }}>
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
                        <div ref={prevRef} className="swiper-button-prev !text-slate-800 !w-8 !h-8 !bg-white/80 !backdrop-blur-sm !rounded-full !shadow-sm !left-2 after:!text-xs after:!content-[''] flex items-center justify-center hover:!bg-white cursor-pointer z-10 absolute top-1/2 -translate-y-1/2">
                            <ChevronLeftIcon className="h-4 w-4" />
                        </div>
                        <div ref={nextRef} className="swiper-button-next !text-slate-800 !w-8 !h-8 !bg-white/80 !backdrop-blur-sm !rounded-full !shadow-sm !right-2 after:!text-xs after:!content-[''] flex items-center justify-center hover:!bg-white cursor-pointer z-10 absolute top-1/2 -translate-y-1/2">
                            <ChevronRightIcon className="h-4 w-4" />
                        </div>
                    </>
                )}
            </Swiper>
        </motion.div>
    );
};
