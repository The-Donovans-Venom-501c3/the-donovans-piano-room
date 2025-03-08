"use client";
import Button3 from "@/components/atoms/Button3";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { bookInterface } from "@/interfaces/bookInterface";
import CircularProgress from "@mui/material/CircularProgress";
import { useAtom, useSetAtom } from "jotai";
import { addedCartItemAtom, addedCartItemsAtom, useCartOperations } from "@/store/cartStore";


export default function BookItem({ book }: { book: bookInterface }) {
  const [loading, setLoading] = useState(false);
  const [addedCartItems] = useAtom(addedCartItemsAtom);
  const { addToCart } = useCartOperations();
  const setAddedCartItem = useSetAtom(addedCartItemAtom);
  const handleAddToCart = () => {
    setLoading(true);
    setTimeout(() => {
      addToCart(book, 1);
      setLoading(false);
      setAddedCartItem(book);
    }, 2000);
  };
  const isAdded = useMemo(
    () => addedCartItems.find((item) => item.id === book.id),
    [book, addedCartItems],
  );
  return (
    <div className="min-h-[40vh] w-[250px] rounded-2xl bg-[#FEF8EE] px-5 pb-3 shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] shadow-[#AC7A2280]">
      <div className="flex w-full justify-between pt-1">
        <div className="flex items-center gap-[2%]">
          <div className="relative h-[2.5vh] w-[2.5vh]">
            <Image src="/bookstore/dollar-icon.svg" fill alt="" />
          </div>
          <p className="text-lg font-semibold text-primary-brown 3xl:text-[14px] 4xl:text-[16px]">
            {book.price}
          </p>
        </div>
        <p
          className="rounded-md px-2 py-1 text-lg font-medium 3xl:text-[14px] 4xl:text-[16px]"
          style={{ backgroundColor: book.color }}
        >
          {book.type}
        </p>
      </div>
      <div className="my-[5%] h-[0.2vw] bg-[#F8DCB0]"></div>
      <div className="relative mb-[5%] h-[200px] w-[225px]">
        <Image src={book.imageSrc} fill alt="" />
      </div>
      <p className="text-2xl font-semibold text-primary-brown 3xl:text-3xl 4xl:text-4xl">
        {book.title}
      </p>
      <p
        className="mb-[5%] text-lg font-semibold 3xl:text-xl 4xl:text-2xl"
        style={{ color: book.titleColor }}
      >
        The Donovan&apos;s piano room
      </p>
      <p className="text-xl 2xl:text-2xl 3xl:text-3xl">{book.description}</p>
      <Link
        href={"/bookstore/" + book.id}
        className="mb-[10%] flex items-center gap-[1%]"
      >
        <p className="text-xl font-bold text-primary-purple underline 2xl:text-2xl 3xl:text-3xl">
          Learn more
        </p>
        <div className="relative h-[0.8vw] w-[0.8vw] rotate-[-90deg]">
          <Image src="/about/FAQs/DropdownIcon.svg" fill alt="" />
        </div>
      </Link>
      {loading ? (
        <div className="flex w-full items-center justify-center gap-[2%] rounded-full bg-[#DDDADA] py-3 text-[1vw] font-semibold text-[#564E4E] 2xl:py-4 3xl:py-5">
          <CircularProgress size={15} sx={{ color: "#564E4E" }} />
          <p>Adding to cart</p>
        </div>
      ) : isAdded ? (
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
  );
}
