"use client";
import { useState } from "react";
import Image from "next/image"
import ReaderPortal from "./ReaderPortal";


const ebooks = [
    {
        id: "1",
        title: "Book I",
        url: process.env.NEXT_PUBLIC_EBOOK1,
        imgsrc: "/bookstore/books/book-1.svg"
    },
    {
        id: "2",
        title: "Book II",
        url: process.env.NEXT_PUBLIC_EBOOK2,
        imgsrc: "/bookstore/books/book-2.svg"
    },
    {
        id: "3",
        title: "Book III",
        url: process.env.NEXT_PUBLIC_EBOOK3,
        imgsrc: "/bookstore/books/book-3.svg"
    }
]
function EbooksComponent() {
    const [selected, setSelected] = useState<number>(0);
    const [read, setRead] = useState(false);
    const handleRead = () => {
        setRead(read => !read);
    }
    const handleBack = () => {
        setRead(read => !read);
    }
    return (
        <>
            <h2 className="text-4xl font-medium text-primary-brown mb-4">
                E-books
            </h2>
            <div className={`${read ? "hidden" : ""}`}>
                <div className="flex gap-10 mb-10">
                    {
                        ebooks.map((book, i) => {
                            return (
                                <div key={book.id} className="w-[250px] h-[350px]">
                                    <Image
                                        className="cursor-pointer"
                                        onClick={() => setSelected(i)} src={book.imgsrc}
                                        alt="ebook image" width={250} height={250} objectFit="contain" />
                                </div>)
                        })
                    }
                </div>
                <div className="flex gap-8 p-10 bg-secondary-purple items-center rounded-lg">
                    <div className="min-w-[160px]">
                        <Image src="/lessons/Cat.svg" alt="Cat" width={160} height={136} />
                    </div>
                    <div className="flex-[2]">
                        <h2 className="text-4xl font-medium text-primary-brown">{ebooks[selected].title}</h2>
                        <p className="text-2xl text-primary-gray leading-[24px]">
                            Learn anytime, anywhere from your computer or mobile device with our interactive, digital copy of Book II. Learners dive deeper into musical mastery as they explore chords, inversions, complex rhythms, major & minor scales, fingering techniques, intervals, transcribing, writing music, and more!
                        </p>
                    </div>
                    <div className="flex-[1]">
                        <button
                            className="bg-primary-purple text-white text-xl block mx-auto my-4 px-10 py-3 rounded-3xl"
                            onClick={handleRead}
                        >
                            Read & Practice
                        </button>
                    </div>

                </div>
            </div>
            {
                read && <div>
                    <button onClick={handleBack}>Go Back to All Books</button>
                    <ReaderPortal onClose={() => setRead(false)}>
                        <iframe
                            src={ebooks[selected].url}
                            className="w-full min-h-[100vh] rounded-lg"
                            sandbox="allow-same-origin allow-scripts"
                            title={ebooks[selected].title}
                        />
                    </ReaderPortal>
                </div>
            }

        </>

    )
}

export default EbooksComponent