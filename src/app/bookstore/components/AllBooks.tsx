"use client"
import { books } from '@/utils/general'
import { useEffect, useState } from 'react'
import {bookInterface} from "@/interfaces/bookInterface";
import BookItem from "@/components/atoms/BookItem";

export default function AllBooks() {
  const [booksList, setBooksList] = useState<[bookInterface[], bookInterface[], bookInterface[]]>([[], [], []])

  useEffect(()=>{
    let booksList: [bookInterface[], bookInterface[], bookInterface[]] = [[], [], []]
    for(let i in books) {
      const book = books[i]
      switch(book.type){
        case "Soft cover":
          booksList[0].push(book)
          break;
        case "E-book":
          booksList[1].push(book)
          break
        case "Audio book":
          booksList[2].push(book)
          break;
      }
    }
    setBooksList(booksList)
  }, [])
  return (
    <div className='min-h-[50.9vh] my-[6vh] flex justify-center'>
        <div className='w-[84.7%]'>
            <h5 className='text-3xl text-primary-brown font-semibold mb-[2%]'>Soft cover books</h5>
            <div className='flex justify-between'>
              {booksList[0].map((book, i) => (
                <BookItem key={i} book={book}/> 
              ))}
              </div>
            
            <h5 className='text-3xl text-primary-brown font-semibold my-[2%]'>E-Books</h5>
            <div className='flex justify-between'>
              {booksList[1].map((book, i) => (
                <BookItem key={i} book={book}/>
              ))}
            </div>
            <h5 className='text-3xl text-primary-brown font-semibold my-[2%]'>Audio books</h5>
            <div className='flex justify-between'>
              {booksList[2].map((book, i) => (
                <BookItem key={i} book={book}/>
              ))}
            </div>
        </div>
    </div>
  )
}
