import React from 'react'
import ContentWrapper from '../components/ContentWrapper'
import Navbar1 from '@/components/navbars/Navbar1'
import Link from 'next/link'
import WhyChooseUsContent from './components/why-choose-us-content'
import { aboutNavigationPages, navigationPages } from '@/utils/general'
import Footer1 from '@/components/footers/Footer1'

export default function WhyChooseUs() {
  return (
    <>
    <Navbar1 page={navigationPages.about} />
    <ContentWrapper page={aboutNavigationPages.whyChooseUs}>
      <WhyChooseUsContent/>
    </ContentWrapper>
    <Footer1 />
    </>
  )
}
