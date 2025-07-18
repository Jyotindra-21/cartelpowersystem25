
"use client"
import React from 'react'
import Title from '../title'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { IWeWorkAcrossSection } from '@/schemas/settingsSchema';
import Slider from 'react-slick'




interface WeWorkProps {
    weWorkAcross?: IWeWorkAcrossSection
}
const WeWork = ({ weWorkAcross }: WeWorkProps) => {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        arrows: false,
        autoplaySpeed: 2000,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className='w-full py-12 '>
            <div className="max-w-[1200px] mx-auto px-4">
                <Title title={`We Work Across ${weWorkAcross?.workAcross}`} />
                <p className="text-center text-gray-600 mb-8">
                    Serving major cities with our innovative ARD solutions
                </p>
                <div className="slider-container bg-white rounded-xl shadow-sm p-4 bg-gradient-to-br from-primary via-primary-dark to-primary-darker">
                    <Slider {...settings}>
                        {weWorkAcross?.workAcrossCities?.map((item, index) => (
                            <div key={index} className='px-2'>
                                <div className="bg-white p-4 rounded-lg border border-gray-500 hover:shadow-md transition-shadow bg-white/5 backdrop-blur-sm  border-white/10">
                                    <div className="relative h-32 w-32 mx-auto mb-3">
                                        <Image
                                            unoptimized
                                            fill
                                            src={item.cityImage}
                                            alt={item.atl || `city-images-${index}`}
                                            
                                            className="object-contain"
                                        />
                                    </div>
                                    <h2 className='text-center font-semibold text-primary flex items-center justify-center'>
                                        <MapPin className="h-4 w-4 mr-1 text-black" />
                                        {item.cityName}
                                    </h2>
                                </div>
                            </div>
                        )
                        )}
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default WeWork