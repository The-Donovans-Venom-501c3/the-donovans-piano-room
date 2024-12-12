"use client";
import Image from "next/image";
import { useState } from "react";

export default function CatalogItems() {
  const [highlightBook, setHighlightBook] = useState(2);
  const pressRight = () => {
    setHighlightBook((highlightBook % 3) + 1);
  };

  const pressLeft = () => {
    setHighlightBook(highlightBook === 1 ? 3 : highlightBook - 1);
  };
  const highlightedBook = { backgroundColor: "#6F219E", width: "3vw" };
  return (
    <div className="relative z-50 flex w-[50%] max-sm:min-h-96 items-center">
      <div className="w-[5%]">
        <div className="flex h-[2.5vw] w-[2.5vw] items-center justify-center rounded-full bg-secondary-purple">
          <div
            className="relative h-[50%] w-[40%] cursor-pointer select-none"
            onClick={pressLeft}
          >
            <Image src="/bookstore/left-arrow.svg" fill alt="" />
          </div>
        </div>
      </div>
      <div className="relative flex h-full w-full items-end justify-center">
        <div
          className="absolute h-[40vh] w-[43%] transition-all duration-300"
          style={
            highlightBook === 1
              ? {
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 30,
                  top: "-21vh",
                }
              : highlightBook === 2
                ? { left: "5vw", top: "-19vh", height: "35vh" }
                : { right: "5vw", top: "-19vh", height: "35vh" }
          }
        >
          <Image src="/bookstore/books/book-2.svg" fill alt="" />
        </div>
        <div
          className="absolute h-[40vh] w-[43%] transition-all duration-300"
          style={
            highlightBook === 3
              ? {
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 30,
                  top: "-21vh",
                }
              : highlightBook === 1
                ? { left: "5vw", top: "-19vh", height: "35vh" }
                : { right: "5vw", top: "-19vh", height: "35vh" }
          }
        >
          <Image src="/bookstore/books/book-3.svg" fill alt="" />
        </div>
        <div
          className="absolute h-[40vh] w-[43%] transition-all duration-300"
          style={
            highlightBook === 2
              ? {
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 30,
                  top: "-21vh",
                }
              : highlightBook === 3
                ? { left: "5vw", top: "-19vh", height: "35vh" }
                : { right: "5vw", top: "-19vh", height: "35vh" }
          }
        >
          <Image src="/bookstore/books/book-1.svg" fill alt="" />
        </div>
        <div className="absolute right-[40%] top-[21vh] flex h-[2vh] w-[15%] items-center justify-between gap-x-[0.2vh]">
          <div
            className="h-[0.8vh] w-[0.8vh] rounded-full bg-[#B457F5]"
            style={highlightBook === 1 ? highlightedBook : {}}
          />
          <div
            className="h-[0.8vh] w-[0.8vh] rounded-full bg-[#B457F5]"
            style={highlightBook === 2 ? highlightedBook : {}}
          />
          <div
            className="h-[0.8vh] w-[0.8vh] rounded-full bg-[#B457F5]"
            style={highlightBook === 3 ? highlightedBook : {}}
          />
        </div>
      </div>
      <div className="w-[5%]">
        <div className="flex h-[2.5vw] w-[2.5vw] items-center justify-center rounded-full bg-secondary-purple">
          <div
            className="relative h-[50%] w-[40%] cursor-pointer select-none"
            onClick={pressRight}
          >
            <Image src="/bookstore/right-arrow.svg" fill alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
