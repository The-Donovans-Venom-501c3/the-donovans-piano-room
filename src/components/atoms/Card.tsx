import React from 'react'

interface CardProps {
    width?: number;
    height?: number;
    children: React.ReactNode;
}

function Card({ width = 350, height = 380, children }: CardProps) {
    return (

        <div className={`bg-secondary-purple w-[${width}px] border-2 rounded-2xl flex pb-5
         border-secondary-purple hover:bg-primary-purple hover:border-primary-purple cursor-pointer`}>
            <div className={`bg-white min-h-[${height}px] rounded-2xl hover:bg-secondary-purple flex flex-col p-8 `}>
                {children}
            </div>
        </div>
    )
}

export default Card