"use client"
import { highlightBookAtom } from "@/utils/stores";
import { useAtom } from "jotai";
import Image from "next/image";
import { useState } from "react";

export default function CatalogItems() {

    // const [highlightBook, setHighlightBook] = useState(2)
    const [highlightBook, setHighlightBook]= useAtom(highlightBookAtom);
    console.log(highlightBook)
    const pressRight = () => {
        setHighlightBook((highlightBook % 3) + 1);
    };
    
    const pressLeft = () => {
        setHighlightBook(highlightBook === 1 ? 3 : highlightBook - 1);
    };
    const highlightedBook = {backgroundColor:"#6F219E", width: "3vw"}
  return (
    
    <div className="relative w-[50%] flex z-50">
    <div className="w-[5%]">
        <div className="h-[2.5vw] w-[2.5vw] bg-secondary-purple rounded-full flex items-center justify-center">
            <div className="relative w-[40%] h-[50%] select-none cursor-pointer" onClick={pressLeft}>
                <Image src="/bookstore/left-arrow.svg" fill alt=""/>
            </div>
        </div>
    </div>

    <div className="relative w-full h-full flex items-end justify-center">
        {/* Book 1 */}
        <div
          className="absolute w-[43%] h-[40vh] transition-all duration-300"
          style={
            highlightBook === 1
              ? { left: "50%", transform: "translateX(-50%)", zIndex: 30, top: "-21vh" }
              : highlightBook === 2
              ? { left: "5vw", top: "-19vh", height: "35vh" }
              : { right: "5vw", top: "-19vh", height: "35vh" }
          }
        >
          <Image src="/bookstore/books/book-1.svg" fill alt="" />
        </div>

        {/* Book 2 */}
        <div
          className="absolute w-[43%] h-[40vh] transition-all duration-300"
          style={
            highlightBook === 2
              ? { left: "50%", transform: "translateX(-50%)", zIndex: 30, top: "-21vh" }
              : highlightBook === 3
              ? { left: "5vw", top: "-19vh", height: "35vh" }
              : { right: "5vw", top: "-19vh", height: "35vh" }
          }
        >
          <Image src="/bookstore/books/book-2.svg" fill alt="" />
        </div>

        {/* Book 3 */}
        <div
          className="absolute w-[43%] h-[40vh] transition-all duration-300"
          style={
            highlightBook === 3
              ? { left: "50%", transform: "translateX(-50%)", zIndex: 30, top: "-21vh" }
              : highlightBook === 1
              ? { left: "5vw", top: "-19vh", height: "35vh" }
              : { right: "5vw", top: "-19vh", height: "35vh" }
          }
        >
          <Image src="/bookstore/books/book-3.svg" fill alt="" />
        </div>
    <div className="absolute w-[15%] h-[2vh] right-[40%] top-[21vh] flex items-center justify-between gap-x-[0.2vh]">
        <div className="h-[0.8vh] w-[0.8vh] bg-[#B457F5] rounded-full" style={highlightBook === 1 ? highlightedBook : {}} />
        <div className="h-[0.8vh] w-[0.8vh] bg-[#B457F5] rounded-full" style={highlightBook === 2 ? highlightedBook : {}} />
        <div className="h-[0.8vh] w-[0.8vh] bg-[#B457F5] rounded-full" style={highlightBook === 3 ? highlightedBook : {}} />
    </div>
</div>;

    <div className="w-[5%]">
        <div className="h-[2.5vw] w-[2.5vw] bg-secondary-purple rounded-full flex items-center justify-center">
            <div className="relative w-[40%] h-[50%] select-none cursor-pointer" onClick={pressRight}>
                <Image src="/bookstore/right-arrow.svg" fill alt=""/>
            </div>
        </div>
    </div>
</div>
  )
}
