import Footer1 from "@/components/footers/Footer1";
import Navbar5 from "@/components/navbars/Navbar5";
import { books, navigationPages } from "@/utils/general";
import Image from "next/image";
import BooksPreview from "./components/BooksPreview";
import FrequentlyPurchasedTogether from "../../../components/atoms/FrequentlyPurchasedTogether";
export default function Page() {
  return (
    <div className="absolute min-h-[100vh] w-full bg-[#F5E8FF]">
      <Navbar5 page={navigationPages.bookstore} />
      <div className="relative mt-[15vh] flex justify-center">
        <div className="relative z-10">
          <BooksPreview />
          <div className="absolute right-0 lg:right-[-4vw] top-[25vh] mix-blend-color-dodge">
            <div className="relative h-[55vw] w-[65vw]">
              <Image src="/bookstore/background/middle-s.svg" fill alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="z-50 grid">
        <FrequentlyPurchasedTogether />
      </div>

      <div className="relative">
        <Footer1 />

        {/* background images */}

        <div className="absolute bottom-0 left-0">
          <div className="relative h-[12vw] w-[12vw]">
            <Image src="/bookstore/background/bottom-left.svg" fill alt="" />
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-[75vh] z-20">
        <div className="relative h-[8vw] w-[8vw]">
          <Image src="/bookstore/background/left-star.svg" fill alt="" />
        </div>
      </div>
      <div className="absolute bottom-[30vh] right-[15vw]">
        <div className="relative h-[5vw] w-[5vw]">
          <Image src="/bookstore/background/bottom-right.svg" fill alt="" />
        </div>
      </div>
    </div>
  );
}
