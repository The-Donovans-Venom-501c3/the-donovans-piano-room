"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {bookInterface} from '@/interfaces/bookInterface';
import Button3 from '@/components/atoms/Button3';
import { books } from '@/utils/general';

export default function BooksPreview() {
    const [book, setBook] = useState<bookInterface>()
    useEffect(()=>{
        const bookId = window.location.pathname.split("/").pop()
        const book: bookInterface = books[Number(bookId)]
        setBook(book)
    }, [])
    return book && (
        <div className="bg-[#ECD6FE] w-[80vw] flex rounded-2xl grid grid-cols-2">
            <div className="flex justify-end z-50">
                <div className="flex flex-col w-2/5 mr-40 mt-16 mb-20">
                    <div className="relative h-[55vh] w-[18vw] p-5">
                        <Image
                            src={book.coverImageSrc}
                            fill    
                            alt=""
                            className="rounded-xl"
                        />
                    </div>
                </div>
            </div>
            <div className="w-2/3 z-50">
                <div className="grid grid-cols-2 text-primary-brown text-2xl 3xl:text-3xl 4xl:text-4xl font-semibold border-b-2 border-secondary-purple pb-4 mt-40">
                    <div className="text-3xl 3xl:text-4xl 4xl:text-5xl py-2">
                        {book.type} | {book.title}
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-white rounded-lg text-[#C89C2A] py-2 px-3">
                            ${book.price.split('.')[0]}
                        </div>
                    </div>
                </div>
                <div className="text-primary-brown text-7xl 3xl:text-8xl 4xl:text-8xl font-semibold py-2 mb-2">
                    The Donovan&apos;s Piano Room {book.title}
                </div>
                <div className="text-2xl 3xl:text-3xl 4xl:text-4xl my-3">
                    This exciting new learning method will teach you the fundamentals of music theory and piano in a fun, digestible way!
                </div>
                <Button3 text="Add to cart" style={{ marginTop: '12px', marginBottom: '12px', width: '60%' }} />
                
            </div>
        </div>
    );
}