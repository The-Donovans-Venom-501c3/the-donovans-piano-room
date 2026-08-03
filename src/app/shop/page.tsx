"use client";

import Image from "next/image";
import Navbar1 from "@/components/navbars/Navbar1";
// Import your main/homepage Navbar component when ready:
// import HomeNavbar from "@/components/navbars/Navbar"; 

import Footer1 from "@/components/footers/Footer1";
import { navigationPages } from "@/utils/general";
import Catalog from "./components/Catalog";
import AllBooks from "./components/AllBooks";
import AddedToCartPopup from "./components/AddedToCartPopup";

// =========================================================================
// DEMO SWITCHES (Flip these booleans before/during your call)
// =========================================================================
const SHOW_TEASER_VIEW = true; // true = Mockup Teaser layout | false = Full Ecommerce Store
const USE_HOMEPAGE_NAVBAR = false; // true = Home Navbar | false = Shop Navbar1
// =========================================================================

const futureMerch = [
  {
    title: "Book I",
    subtitle: "The Donovan's piano room",
    cover: "/shop/books/book-1.svg",
    description:
      "This engaging learning method instructs learners in the fundamentals of music theory, spanning rhythm, time signatures, sharps, flats, whole steps, half steps, our scale formula, pentascales, music vocabulary, and more!",
    hasAudio: false,
  },
  {
    title: "Book II",
    subtitle: "The Donovan's piano room",
    cover: "/shop/books/book-2.svg",
    description:
      "After mastering the foundational elements, students will delve into chords, inversions, complex rhythms, major & minor scales, fingering techniques, intervals, transcribing, writing music, and more! Our Musical Journal, featured in Book II, becomes their trusted companion, fostering organized practice habits.",
    hasAudio: true,
  },
  {
    title: "Book III",
    subtitle: "The Donovan's piano room",
    cover: "/shop/books/book-3.svg",
    description:
      "Students move to a higher level of musical analysis in Book III as they tackle compound and simple time signatures, The Circle of Fifths, 7 chords, melodic and harmonic minors, inversions, roman numeral analysis, advanced intervals, chord families, and more!",
    hasAudio: true,
  },
];

export default function ShopPage() {
  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-[#F5E8FF] relative overflow-x-hidden">
      {/* 1. Dynamic Navigation Bar */}
      {USE_HOMEPAGE_NAVBAR ? (
        <Navbar1 page={navigationPages.shop} />
      ) : (
        <Navbar1 page={navigationPages.shop} />
      )}

      {/* Cart Popup for full store experience */}
      {!SHOW_TEASER_VIEW && <AddedToCartPopup />}

      {/* 2. Main Content Area */}
      {SHOW_TEASER_VIEW ? (
        /* --- TEASER / COMING SOON LAYOUT (Nadiya's Mockup) --- */
        <main className="flex-1 mt-[14vh] mb-[8vh] flex flex-col items-center z-10 px-4">
          <section className="w-[85%] max-w-[1200px] text-left pt-6 pb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-brown mb-3">
              Welcome to The Donovan’s Piano Room Shop!
            </h1>
            <p className="text-lg font-medium text-primary-brown mb-1">
              The Shop will be available soon!
            </p>
            <p className="text-base text-primary-brown/80">
              In the mean time, view some of our future merchandise below!
            </p>
          </section>

          <section className="w-[85%] max-w-[1200px]">
            <h2 className="text-3xl font-bold text-primary-brown mb-8">
              Future Merchandise
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {futureMerch.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 flex flex-col justify-between relative"
                >
                  <div>
                    <div className="relative w-full h-[280px] mb-6 flex justify-center items-center">
                      <Image
                        src={item.cover}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                      {item.hasAudio && (
                        <div className="absolute bottom-2 right-2 border border-gray-300 rounded-full px-3 py-1 bg-white text-xs font-semibold text-gray-700 shadow-sm">
                          Audio
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-primary-brown">
                      {item.title}
                    </h3>
                    <p className="text-sm font-semibold text-[#8C581E] mb-4">
                      {item.subtitle}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      ) : (
        /* --- FULL E-COMMERCE STORE LAYOUT --- */
        <main className="flex-1">
          <Catalog />
          <AllBooks />
        </main>
      )}

      {/* 3. Footer & Background Graphics */}
      <div className="relative z-10">
        <Footer1 />
        <div className="absolute bottom-0 left-0">
          <div className="relative h-[12vw] w-[12vw]">
            <Image src="/shop/background/bottom-left.svg" fill alt="" />
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-[5vh] pointer-events-none">
        <div className="relative h-[16vw] w-[14vw]">
          <Image src="/shop/background/top-right.svg" fill alt="" />
        </div>
      </div>
      <div className="absolute left-[35vw] top-[52.5vh] pointer-events-none">
        <div className="relative h-[10vw] w-[10vw]">
          <Image src="/shop/background/middle.svg" fill alt="" />
        </div>
      </div>
      <div className="absolute right-0 top-[60vh] pointer-events-none">
        <div className="relative h-[8vw] w-[8vw]">
          <Image src="/shop/background/left-star.svg" fill alt="" />
        </div>
      </div>
    </div>
  );
}