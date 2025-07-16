'use client'
import Link from 'next/link'
import { Shield, Star, ArrowRight, BadgePercent } from 'lucide-react'
import React from 'react'
import { formatIndianCurrency } from '@/lib/helper'
import { IProduct } from '@/schemas/productsSchema'
import Image from 'next/image'

interface ProductCardProps {
    product: IProduct
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link href={`/product/${product?.basicInfo.slug}`} className="group relative">
            <div className="relative z-10 h-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-200 hover:border-blue-500 w-[350px]">
                {/* Sale Badge */}
                {product?.pricing.hasDiscount ? <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-bold px-3 py-1 rounded-full z-20 flex items-center">
                    <BadgePercent className="h-4 w-4 mr-1" />
                    <span>{product?.pricing.discountPercentage}% OFF</span>
                </div> : ""}


                {/* Rating Badge */}
                {product?.ratingsAndReview?.rating ? (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-yellow-600 text-sm font-medium px-2 py-1 rounded-full z-20 flex items-center shadow-sm">
                        <Star className="h-4 w-4 fill-yellow-400 mr-1" />
                        <span>{product?.ratingsAndReview?.rating}</span>
                    </div>
                ) : ""}

                {/* Product Image */}
                {product?.media?.mainImage && (
                    <div className="relative h-60 bg-gray-100 overflow-hidden">
                        <Image
                            unoptimized
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105 p-4"
                            src={product.media?.mainImage || ""}
                            alt={product.basicInfo?.slug || ""}
                        />
                        {/* Quick view overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium flex items-center shadow-lg">
                                <span>Quick View</span>
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Product Info */}
                <div className="p-5">
                    <div className="mb-2">
                        <span className="text-sm text-blue-600 font-medium">{product?.basicInfo.brand}</span>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {product?.basicInfo.name}
                        </h3>
                    </div>

                    {/* Features */}
                    <ul className="mb-4 space-y-1">
                        {product?.featuresSection?.keyFeatures?.slice(0, 3)?.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                                <Shield className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between mt-4">
                        <div>
                            {product?.pricing?.oldPrice && <span className="text-lg line-through text-gray-500">{formatIndianCurrency(product?.pricing?.oldPrice)}</span>}

                            <span className="ml-2 text-2xl font-bold text-gray-900">{
                                formatIndianCurrency(product?.pricing.price)
                            }</span>
                        </div>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                            onClick={(e) => {
                                e.preventDefault()
                                // Add to cart logic here
                            }}
                        >
                            {/* <ShoppingCart className="h-4 w-4 mr-2" /> */}
                            <span>View</span>
                        </button>
                    </div>
                </div>
                {/* Hover effect border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-xl pointer-events-none transition-all duration-300 z-20" />
            </div>
        </Link>
    )
}

export default ProductCard