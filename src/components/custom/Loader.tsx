import React from 'react'

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-[70vh] w-full">
            <div className="text-center">
                <div
                    className="w-20 h-20  border-dotted  rounded-full animate-ping bg-gradient-to-r from-primary to-secondary/90 mx-auto flex items-center justify-center text-white"
                >
                    CARTEL
                </div>

            </div>

        </div>
    )
}

export default Loader