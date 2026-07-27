"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { backendBookInterface, bookInterface } from "@/interfaces/bookInterface";
import Button3 from "@/components/atoms/Button3";
import { getBookById } from "@/lib/api/bookService";
import { useParams } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import { addedCartItemAtom, addedCartItemsAtom, useCartOperations } from "@/store/cartStore";
import { CircularProgress } from "@mui/material";
import { mapBackendToFrontend } from "@/utils/general";

export default function BooksPreview() {
  const [book, setBook] = useState<bookInterface>();
  const [loading, setLoading] = useState(false);
  const setAddedCartItem = useSetAtom(addedCartItemAtom);
  const { addToCart, isAdded } = useCartOperations();
  const params = useParams();

  const handleAddToCart = () => {
    if (!book) return;
    setLoading(true);
    setTimeout(() => {
      addToCart(book, 1);
      setLoading(false);
      setAddedCartItem(book);
    }, 2000);
  }

  useEffect(() => {
    const fetchBook = async () => {
      const bookId: string = params.id as string;
      if (!bookId) {
        console.error("No book ID found in URL");
        return;
      }
      const response: backendBookInterface = await getBookById(bookId);
      setBook(mapBackendToFrontend(response));
    };
    fetchBook();
  }, [params.id]);

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
                ${book.price}
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

          {loading ? (
            <div className="flex w-full items-center justify-center gap-[2%] rounded-full bg-[#DDDADA] py-3 text-[1vw] font-semibold text-[#564E4E] 2xl:py-4 3xl:py-5">
              <CircularProgress size={15} sx={{ color: "#564E4E" }} />
              <p>Adding to cart</p>
            </div>
          ) : isAdded(book) ? (
            <div className="flex w-full items-center justify-center gap-[2%] rounded-full border border-primary-purple py-3 text-[1vw] font-semibold text-primary-purple 2xl:py-4 3xl:py-5">
              <div className="relative h-[1.1vw] w-[1.1vw]">
                <Image src="/account/notifications/mark-as-read.svg" fill alt="" />
              </div>
              <p>Added to the cart</p>
            </div>
          ) : (
            <Button3
              text="Add to cart"
              style={{ fontSize: "12px" }}
              onClick={handleAddToCart}
            />
          )}
        </div>
      </div>
    )
  );
}