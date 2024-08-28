"use client"
import BookItem from "@/components/atoms/BookItem";
import { useAtom } from 'jotai';
import { frequentlyPurchasedTogetherBooksAtom } from '@/utils/stores';
import * as bookAPI from "../../utils/APIs/bookAPIs"
import { bookInterface } from '@/interfaces/bookInterface';
import { WillMountEffect } from '@/utils/customHooks';

export default function FrequentlyPurchasedTogether() {
    const [frequentlyPurchasedTogetherBooks, setFrequentlyPurchasedTogetherBooks] = useAtom(frequentlyPurchasedTogetherBooksAtom)
    const getFPTB = () => {
        if(!frequentlyPurchasedTogetherBooks.length){
            (async()=>{
               const books = await bookAPI.getFrequentlyPurchasedTogether() as bookInterface[]
               setFrequentlyPurchasedTogetherBooks(books)
            })()
        }
    }
    WillMountEffect(getFPTB)
    return (
        <div className='flex items-center justify-center my-[10vh] z-50'>
            <div className='w-[84.7%]'>
                <div className='text-primary-brown text-4xl font-semibold'>
                    Frequently purchased together
                </div>
                <div className='flex justify-start gap-[2vw] mt-[3vh]'>
                    {frequentlyPurchasedTogetherBooks.map((book, i) => (
                        <BookItem key={i} book={book}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
