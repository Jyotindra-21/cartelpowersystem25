
import React from 'react'
import Title from '../title'
import ProductCard from './_components/product-card'
import { IProduct } from '@/schemas/productsSchema'

interface ProductProps {
    highlightedProducts: IProduct[] | undefined
}
const Products = ({ highlightedProducts }: ProductProps) => {
    return (
        <section className=' max-w-[1200px] px-2 py-5 m-auto '>
            <Title title='Rescue Device' />
            <div className="relative h-full w-full bg-blue-0 grid md:grid-cols-2 lg:grid-cols-3  justify-items-center gap-y-5">
                {highlightedProducts && highlightedProducts?.map((product: IProduct, index: number) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </section>
    )
}

export default Products