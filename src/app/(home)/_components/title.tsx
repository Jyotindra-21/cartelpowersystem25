import React from 'react'

interface titleProps {
    title: string
}

const Title = ({ title }: titleProps) => {
    return (
        // <span className="inline-block text-xs font-medium text-green-600 uppercase tracking-wider border border-green-600 rounded-full pl-7 pr-4 py-1 mb-3 relative">
        //                                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-600 rounded-full"></span>
        //                                 Our Story
        //                             </span>
        <div className='text-center'>
            <h1 className='inline-block text-2xl  font-bold text-primary uppercase tracking-wider border border-primary rounded-full pl-7 pr-4 py-1 mb-3 relative'>
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></span>
                {title}
            </h1>
        </div>
    )
}

export default Title