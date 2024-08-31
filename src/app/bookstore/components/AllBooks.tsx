"use client"
import { books } from '@/utils/general'
import { useEffect, useState } from 'react'
import {bookInterface, booksByType} from "@/interfaces/bookInterface";
import BookItem from "@/components/atoms/BookItem";
import { WillMountEffect } from '@/utils/customHooks';
import * as bookAPI from "../../../utils/APIs/bookAPIs"
export default function AllBooks() {
  const [booksList, setBooksList] = useState<booksByType[]>([])
  function fetchBooks (){
    (async()=>{
      try{

        const booksList = await bookAPI.getAllBooksByTypes() as booksByType[]
        setBooksList(booksList)
      }catch(err){
        console.log(err)
      }

    })()
  }
  WillMountEffect(fetchBooks)
  return (
    <div className='min-h-[50.9vh] my-[6vh] flex justify-center'>
        <div className='w-[84.7%]'>
            {booksList.map((type, i)=>(
              <div key={i}>

              <h5 className='text-3xl text-primary-brown font-semibold mb-[2%]'>{type.name}</h5>
                <div className='flex justify-between'>
                  {type.books.map((book, i) => (
                    <BookItem key={i} book={book}/>
                  ))}
                </div>
              </div>
              ))}
        </div>
    </div>
  )
}
