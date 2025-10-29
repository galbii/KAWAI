'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const models = [
  {
    id: 'ca401',
    name: 'CA401',
    descriptor: 'Essential Wooden Action',
    price: 'From $3,199',
    image: '/images/concert-artist/ca401.jpg',
    features: ['Grand Feel Compact Action', 'SK-EX Concert Grand Sampling', '88 Wooden Keys'],
    link: '/products/ca401',
  },
  {
    id: 'ca501',
    name: 'CA501',
    descriptor: 'Premium Sound Performance',
    price: 'From $4,099',
    image: '/images/concert-artist/ca501.jpg',
    features: ['Harmonic Imaging XL', '100W Speaker System', '360° Sound Diffusion'],
    link: '/products/ca501',
  },
  {
    id: 'ca701',
    name: 'CA701',
    descriptor: 'Professional Grade Touch',
    price: 'From $5,049',
    image: '/images/concert-artist/ca701.jpg',
    features: ['Grand Feel III Action', 'SK-EX Rendering Engine', 'Extended Pivot Length'],
    link: '/products/ca701',
  },
  {
    id: 'ca901',
    name: 'CA901',
    descriptor: 'Flagship TwinDrive Sound',
    price: 'From $6,549',
    image: '/images/concert-artist/ca901.jpg',
    features: ['Genuine Spruce Soundboard', 'TwinDrive Technology', '135W Premium System'],
    link: '/products/ca901',
  },
]

export default function ModelGrid() {
  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl text-center mb-12 md:mb-16 font-serif"
          style={{ fontFamily: 'Crimson Text, serif' }}
        >
          Four Expressions
        </motion.h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Link href={model.link}>
                <div className="group relative bg-white rounded-xl shadow-lg border border-neutral-900/20 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#C41E3A]">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={model.image}
                      alt={`${model.name} - ${model.descriptor}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Model Name */}
                    <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                      {model.name}
                    </h3>

                    {/* Descriptor */}
                    <p className="text-sm text-neutral-900/60 mb-3">
                      {model.descriptor}
                    </p>

                    {/* Features */}
                    <ul className="space-y-1 mb-4">
                      {model.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="text-sm text-neutral-700 flex items-start"
                        >
                          <span className="mr-2 text-[#C41E3A]">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <p className="text-xl font-semibold text-[#C41E3A] mb-4">
                      {model.price}
                    </p>

                    {/* Explore Button (appears on hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#C41E3A] text-white font-medium rounded-md transition-colors hover:bg-[#A01828]">
                        Explore Model
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
