import Navbar1 from '@/components/navbars/Navbar1'
import { aboutNavigationPages, navigationPages } from '@/utils/general'
import React from 'react'
import ContentWrapper from '../components/ContentWrapper'
import MembershipContent from './components/MembershipContent'
import Footer1 from '@/components/footers/Footer1'

export default function Page() {
  return (
    <>
        <Navbar1 page={navigationPages.about}/>
        <ContentWrapper page={aboutNavigationPages.membership}>
            <MembershipContent/>
        </ContentWrapper>
        <Footer1 />
    </>
  )
}
