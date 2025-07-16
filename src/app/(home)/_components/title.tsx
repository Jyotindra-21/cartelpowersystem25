import React from 'react'

interface titleProps {
    title: string
}

const Title = ({ title }: titleProps) => {
    return (
        <h2  className='text-3xl text-gray-700 mb-12 z-10 font-extrabold capitalize text-center'>{title}</h2>
    )
}

export default Title