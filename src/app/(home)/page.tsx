import React from 'react'
import HeroPage from './_components/sections/HeroPage'
import Products from './_components/sections/Products'
import WeWork from './_components/sections/we-work'
import OurStoryPage from './_components/sections/OurStory'
import { IProduct } from '@/schemas/productsSchema'
import { fetchProducts } from '@/services/product.services'
import ScrollLine from '@/components/custom/ScrollLine'
import { fetchSettings } from '@/services/settings.services'
import { fetchTestimonials } from '@/services/testimonialService'
import { ITestimonial } from '@/schemas/testimonialSchema'
export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // 

const Page = async () => {


    const [
        { data: settings },
        // { data: bannerProducts },
        { data: products },
        { data: testimonials }
    ] = await Promise.all([
        fetchSettings(),
        fetchProducts<IProduct[]>({ isHighlighted: true, isBanner: true, isActive: true, getAll: true }),
        // fetchProducts<IProduct[]>({ isHighlighted: true, isActive: true, getAll: true }),
        fetchTestimonials<ITestimonial[]>({ getAll: true, status: true })
    ]);
    return (
        <>
            <div className='relative overflow-clip'>
                <HeroPage heroSection={settings?.heroSection} banners={products?.filter((products) => products.flags?.isBanner)} />
                <Products highlightedProducts={products?.filter((products) => products.flags?.isHighlighted)} />
                {/* <ScrollLine /> */}
                <OurStoryPage ourStory={settings?.ourStorySection} testimonials={testimonials || []} />
                <WeWork weWorkAcross={settings?.weWorkAcross} />
            </div>
        </>
    )
}

export default Page