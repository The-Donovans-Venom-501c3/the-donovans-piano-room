import React from 'react'

interface CardProps {
    width?: number;
    height?: number;
    children: React.ReactNode;
}

function Card({ width = 350, height = 380, children }: CardProps) {
    return (
        <div
            className={`group bg-secondary-purple w-[${width}px] border-2 rounded-3xl flex pb-[10px]
             border-secondary-purple hover:bg-primary-purple hover:border-primary-purple cursor-pointer`}
        >
            <div
                className={`bg-white min-h-[${height}px] rounded-3xl flex flex-col p-8
                group-hover:bg-secondary-purple`}
            >
                {children}
            </div>
        </div>
    )
}

export default Card