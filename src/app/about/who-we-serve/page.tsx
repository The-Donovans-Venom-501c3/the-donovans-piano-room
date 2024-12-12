import ContentWrapper from '../components/ContentWrapper'
import { aboutNavigationPages, navigationPages } from '@/utils/general'
import Navbar1 from '@/components/navbars/Navbar1'
import WhoWeServeContent from './components/who-we-serve-content'
import Footer1 from '@/components/footers/Footer1'



const Page = ({}) => {
  return (
    <>
        <Navbar1 page={navigationPages.about}/>
        <ContentWrapper page={aboutNavigationPages.whoWeServe}>
            <WhoWeServeContent/>
        </ContentWrapper>
        <Footer1 />
    </>
  )
  
}

export default Page