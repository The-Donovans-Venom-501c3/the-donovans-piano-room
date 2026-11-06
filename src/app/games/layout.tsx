import Footer4 from '@/components/footers/Footer4';
import Navbar1 from '@/components/navbars/Navbar1';
import { navigationPages } from '@/utils/general';
import React from 'react'

const GameLayout = ({ children }: {
    children: React.ReactNode;
}) => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar1 page={navigationPages.games} />
            {children}
            <Footer4 />
        </div>
    )
}

export default GameLayout;