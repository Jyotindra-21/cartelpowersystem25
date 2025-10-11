import React from 'react'
import { headers } from 'next/headers';
import ProductCard from '../_components/sections/_components/product-card'
import Title from '../_components/title'
import Link from 'next/link';
import { IProduct } from '@/schemas/productsSchema';
import { fetchProducts } from '@/services/product.services';
import { IApiResponse } from '@/types/ApiResponse';

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // 

const ProductPage = async () => {
    headers();
    const { data: products }: IApiResponse<IProduct[]> = await fetchProducts<IProduct[]>({ isActive: true, getAll: true });
    if (!products) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-medium mb-4">Product not found</h2>
                    {/* <p className="text-gray-600 mb-4">{data}</p> */}
                    <Link href="/product" className="text-blue-600 hover:underline">
                        Browse all products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {products && products?.length > 0 ? (<>
                <section className=' max-w-[1200px] px-2 py-5 m-auto '>
                    <Title title='All Products' />
                    <div className="relative h-full w-full bg-blue-0 grid md:grid-cols-2 lg:grid-cols-3  justify-items-center gap-y-5">
                        {products && products?.map((product: IProduct, index: number) => (
                            <ProductCard key={index} product={product} />
                        ))}

                    </div>
                </section>
            </>) : (<>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-xl font-medium mb-4">Product not found</h2>
                        {/* <Link href="/product" className="text-blue-600 hover:underline">
                            Browse all products
                        </Link> */}
                    </div>
                </div></>)}
        </>
    )
}
export default ProductPage