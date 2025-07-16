// "use client"
import React from 'react'
import HeroPage from './_components/sections/HeroPage'
import Products from './_components/sections/Products'
import WeWork from './_components/sections/we-work'
import OurStoryPage from './_components/sections/OurStory'
import { IApiResponse } from '@/types/ApiResponse'
import { IProduct } from '@/schemas/productsSchema'
import { fetchProducts } from '@/services/product.services'
import ScrollLine from '@/components/custom/ScrollLine'
import { fetchSettings } from '@/services/settings.services'
import { ISettings } from '@/schemas/settingsSchema'

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // 

const Page = async () => {
    const { data: Settings }: IApiResponse<ISettings[]> = await fetchSettings();
    const { data: Banner }: IApiResponse<IProduct[]> = await fetchProducts({ isBanner: true, isActive: true, getAll: true });
    const { data: products }: IApiResponse<IProduct[]> = await fetchProducts({ isHighlighted: true, isActive: true, getAll: true });
    return (
        <>
            <div className='relative overflow-clip'>
                <HeroPage heroSection={Settings?.[0]?.heroSection} banners={Banner} />
                <Products highlightedProducts={products} />
                <ScrollLine />
                <OurStoryPage ourStory={Settings?.[0]?.ourStorySection} />
                <WeWork weWorkAcross={Settings?.[0]?.weWorkAcross} />
            </div>
        </>
    )
}

export default Page