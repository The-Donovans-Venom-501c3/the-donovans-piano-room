"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { bookInterface } from "@/interfaces/bookInterface";
import Button3 from "@/components/atoms/Button3";
import { books } from "@/utils/general";

export default function BooksPreview() {
  const [book, setBook] = useState<bookInterface>();
  useEffect(() => {
    const bookId = window.location.pathname.split("/").pop();
    const book: bookInterface = books[Number(bookId)];
    setBook(book);
  }, []);
  return (
    book && (
      <div className=" flex flex-col-reverse sm:flex-row w-[full] rounded-2xl bg-[#ECD6FE] max-sm:pl-5 pr-5 md:px-20">
        <div className="z-50 flex-1 flex justify-center">
          <div className="sm:mb-20 mt-16 flex w-full justify-center">
            <div className="relative h-[400px] sm:h-[460px] w-[250px] py-x sm:p-5">
              <Image
                src={book.coverImageSrc}
                fill
                alt=""
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
        <div className="z-50 flex-1 w-[300px] lg:w-[400px]">
          <div className=" mt-10 sm:mt-40 grid grid-cols-2 border-b-2 border-secondary-purple pb-4 text-2xl font-semibold text-primary-brown 3xl:text-3xl 4xl:text-4xl">
            <div className="py-2 text-3xl 3xl:text-4xl 4xl:text-5xl">
              {book.type} | {book.title}
            </div>
            <div className="flex justify-end">
              <div className="rounded-lg bg-white px-3 py-2 text-[#C89C2A]">
                ${book.price.split(".")[0]}
              </div>
            </div>
          </div>
          <div className="mb-2 py-2 text-7xl font-semibold text-primary-brown 3xl:text-8xl 4xl:text-8xl">
            The Donovan&apos;s Piano Room {book.title}
          </div>
          <div className="my-3 text-2xl 3xl:text-3xl 4xl:text-4xl">
            This exciting new learning method will teach you the fundamentals of
            music theory and piano in a fun, digestible way!
          </div>
          <Button3
            text="Add to cart"
            style={{ marginTop: "12px", marginBottom: "12px", width: "60%" }}
          />
        </div>
      </div>
    )
  );
}
