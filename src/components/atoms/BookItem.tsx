"use client"
import Button3 from '@/components/atoms/Button3'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import {bookInterface} from "@/interfaces/bookInterface";
import CircularProgress from '@mui/material/CircularProgress';
import { useAtom, useSetAtom } from 'jotai'
import { addedCartItemAtom, addedCartItemsAtom } from '@/utils/stores'

export default function BookItem({ book }: { book: bookInterface }) {
  const [loading, setLoading] = useState(false);
  const [addedCartItems, setAddedCartItems] = useAtom(addedCartItemsAtom); 
  const setAddedCartItem = useSetAtom(addedCartItemAtom)
  const addToCart = () => {
      setLoading(true);
      setTimeout(() => {
          setAddedCartItems([...addedCartItems, {...book, quantity: 1}]);
          setLoading(false)
          setAddedCartItem(book)
      }, 2000);
  };
  const isAdded = useMemo(()=> addedCartItems.find(item => item.id === book.id), [book, addedCartItems])
  return (
    <div className='w-[27.5%] min-h-[40vh] p-[1vw] bg-[#FEF8EE] rounded-2xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]'>
        <div className='flex justify-between w-full'>
        <div className='flex items-center gap-[2%]'>
            <div className='relative h-[2.5vh] w-[2.5vh]'>
            <Image src="/bookstore/dollar-icon.svg" fill alt=''/>
            </div>
            <p className='text-primary-brown font-semibold text-lg 3xl:text-[14px] 4xl:text-[16px]'>{book.price}</p>
        </div>
        <p className='text-lg 3xl:text-[14px] 4xl:text-[16px] font-medium px-2 py-1 rounded-md' style={{backgroundColor: book.color}}>{book.type}</p>
        </div>
        <div className='my-[5%] h-[0.2vw] bg-[#F8DCB0]'></div>
        <div className='relative h-[16vw] w-full mb-[5%]'>
        <Image src={book.imageSrc} fill alt=''/>
        </div>
        <p className='text-primary-brown text-2xl 3xl:text-3xl 4xl:text-4xl font-medium'>{book.title}</p>
        <p className='text-lg 3xl:text-xl 4xl:text-2xl font-medium mb-[5%]' style={{color: book.titleColor}}>The Donovan&apos;s piano room</p>
        <p className='text-xl 2xl:text-2xl 3xl:text-3xl'>{book.description}</p>
        <Link href={"/bookstore/"+book.id} className='flex gap-[1%] flex items-center mb-[10%]'>
        <p className='underline text-xl 2xl:text-2xl 3xl:text-3xl text-primary-purple font-semibold'>Learn more</p>
        <div className='relative h-[0.8vw] w-[0.8vw] rotate-[-90deg]'>
            <Image src='/about/FAQs/DropdownIcon.svg' fill alt=''/>
        </div>
        </Link>
        { loading ?
        (<div className='w-full bg-[#DDDADA] font-semibold py-3 2xl:py-4 3xl:py-5 text-[#564E4E] text-[1vw] rounded-full flex items-center justify-center gap-[2%]'>
          <CircularProgress size={15} sx={{color: "#564E4E",}}/>
          <p>Adding to cart</p>
        </div>) :
        isAdded ?
        (<div className='w-full border border-primary-purple font-semibold py-3 2xl:py-4 3xl:py-5 text-primary-purple text-[1vw] rounded-full flex items-center justify-center gap-[2%]'>
          <div className='relative w-[1.1vw] h-[1.1vw]'>
            <Image src="/account/notifications/mark-as-read.svg" fill alt=''/>
          </div>
          <p>Added to the cart</p>
        </div>):
         <Button3 text='Add to cart' style={{ fontSize: "1vw"}} onClick={addToCart}/> 
        }
    </div>
  )
}