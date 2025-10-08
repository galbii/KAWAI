"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { trackBundleDealerClick } from './lib/tracking';

interface PromotionalPopupProps {
  show: boolean;
  onClose: () => void;
}

const carouselImages = [
  {
    src: '/images/hml-3/designerbundle2.png',
    alt: 'HML-3 Designer Stand'
  },
  {
    src: '/images/hml-3/designerbundle.png',
    alt: 'ES60 Piano with HML-3 Designer Stand'
  },
  {
    src: '/images/hml-3/desingerbundle3.png',
    alt: 'ES60 Piano with HML-3 Designer Stand - Full Setup'
  }
];

export function PromotionalPopup({ show, onClose }: PromotionalPopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleClose = () => {
    onClose();
  };

  // Handle dealer link click from bundle popup
  const handleDealerClick = () => {
    trackBundleDealerClick('es60_bundle_popup');
    handleClose();
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* Popup Container */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.5
            }}
            className="fixed bottom-0 left-0 right-0 z-[101] mx-auto max-w-4xl px-4 pb-4 md:bottom-8 md:left-1/2 md:-translate-x-1/2"
          >
            <div className="relative bg-[#F5F5F0] border-4 border-black shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-10 p-2 bg-black hover:bg-gray-800 transition-colors duration-200"
                aria-label="Close promotional popup"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Two-column layout: Image left, Content right */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Column - Image Carousel */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  className="relative h-64 md:h-auto md:border-r-2 md:border-black/10 flex items-center justify-center p-6 md:p-8"
                >
                  {/* Carousel Container */}
                  <div className="relative w-full h-full">
                    <AnimatePresence mode="wait">
                      {carouselImages[currentImageIndex] && (
                        <motion.div
                          key={currentImageIndex}
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3 }}
                          className="relative w-full h-full"
                        >
                          <Image
                            src={carouselImages[currentImageIndex].src}
                            alt={carouselImages[currentImageIndex].alt}
                            fill
                            className="object-contain"
                            priority={currentImageIndex === 0}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black transition-colors duration-200 z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black transition-colors duration-200 z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {carouselImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentImageIndex
                              ? 'bg-black w-6'
                              : 'bg-black/30'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Right Column - Content */}
                <div className="relative p-6 md:p-8 text-center flex flex-col justify-center">
                  {/* Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                    className="inline-block mb-4"
                  >
                    <div className="bg-black px-4 py-2 border-2 border-black">
                      <span className="text-white font-bold text-sm md:text-base tracking-wide">
                        🇨🇦 CANADA EXCLUSIVE
                      </span>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mb-6"
                  >
                    <h2 className="text-2xl md:text-4xl font-bold text-black mb-2">
                      Designer Stand Bundle
                    </h2>
                    <p className="text-sm md:text-base text-black/70">
                      ES60 Stands normally sold separately.
                    </p>
                  </motion.div>

                  {/* Pricing */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mb-6"
                  >
                    {/* Mobile: Single line layout */}
                    <div className="flex flex-col md:hidden items-center gap-3">
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-black">$999</p>
                            <p className="text-xs text-black/70">Kawai ES60</p>
                          </div>
                          <p className="text-xl font-bold text-black">+</p>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-black">$189</p>
                            <p className="text-xs text-black/70">HML-3 Designer Stand</p>
                          </div>
                        </div>

                        {/* Red Horizontal Strikethrough */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6, duration: 0.5 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <svg
                            className="absolute w-full h-full"
                            style={{ width: '120%', height: '100%', left: '-10%' }}
                          >
                            <motion.line
                              x1="0%"
                              y1="40%"
                              x2="100%"
                              y2="40%"
                              stroke="#DC2626"
                              strokeWidth="3"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 1.6, duration: 0.6 }}
                            />
                          </svg>
                        </motion.div>
                      </div>

                      {/* "Only $799 until December 1st" reveal */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.4, duration: 0.6, type: "spring" }}
                        className="text-center"
                      >
                        <p className="text-3xl md:text-4xl font-bold text-red-600">
                          Only $799
                        </p>
                        <p className="text-sm md:text-base text-black mt-1">
                          until December 1st
                        </p>
                      </motion.div>
                    </div>

                    {/* Desktop: Horizontal layout */}
                    <div className="hidden md:flex md:flex-col items-center gap-3">
                      <div className="relative">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-black">$999</p>
                            <p className="text-sm text-black/70">Kawai ES60</p>
                          </div>
                          <p className="text-2xl font-bold text-black">+</p>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-black">$189</p>
                            <p className="text-sm text-black/70">HML-3 Designer Stand</p>
                          </div>
                        </div>

                        {/* Red Horizontal Strikethrough */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6, duration: 0.5 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <svg
                            className="absolute w-full h-full"
                            style={{ width: '110%', height: '100%', left: '-5%' }}
                          >
                            <motion.line
                              x1="0%"
                              y1="40%"
                              x2="100%"
                              y2="40%"
                              stroke="#DC2626"
                              strokeWidth="4"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 1.6, duration: 0.6 }}
                            />
                          </svg>
                        </motion.div>
                      </div>

                      {/* "Only $799 until December 1st" reveal */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.4, duration: 0.6, type: "spring" }}
                        className="text-center"
                      >
                        <p className="text-4xl md:text-5xl font-bold text-red-600">
                          Only $799
                        </p>
                        <p className="text-sm md:text-base text-black mt-1">
                          until December 1st
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 3.0, duration: 0.6 }}
                  >
                    <Button
                      size="lg"
                      className="w-full md:w-auto px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-2xl transform hover:scale-105 transition-all duration-300"
                      asChild
                    >
                      <a
                        href="https://kawaius.com/find-a-dealer/acoustic-digital/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleDealerClick}
                      >
                        Find a Dealer
                      </a>
                    </Button>
                  </motion.div>

                  {/* Fine Print */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.6, duration: 0.6 }}
                    className="mt-4 text-black/60 text-xs md:text-sm leading-relaxed"
                  >
                    Limited time offer available at your local Kawai Piano Dealer. Contact your dealer for details. Ends December 2025
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
