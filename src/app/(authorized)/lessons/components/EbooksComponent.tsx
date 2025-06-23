"use client";
import { useState } from "react";
import Image from "next/image"
import ReaderPortal from "./ReaderPortal";
import Card from "@/components/atoms/Card";


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
interface CardProps {
    width?: number;
    height?: number;
    children: React.ReactNode;
}
function SelectedCard({ width = 350, height = 380, children }: CardProps) {
    return (
        <div
            className={`group bg-primary-purple w-[${width}px] border-2 rounded-3xl flex pb-[10px]
             border-primary-purple cursor-pointer`}
        >
            <div
                className={` min-h-[${height}px] rounded-3xl flex flex-col p-8
                bg-secondary-purple`}
            >
                {children}
            </div>
        </div>
    )
}


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
                <div className="flex gap-10 mb-10 items-center">
                    {ebooks.map((book, i) => (
                        <div
                            key={book.id}
                            className={`
                                relative 
                                transition-all duration-300
                                
                            `}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelected(i)}
                        >
                            {
                                selected==i?<SelectedCard width={210} height={210}>
                                <Image
                                    className="object-contain w-[210px] h-[210px] transition-all duration-300"
                                    src={book.imgsrc}
                                    alt="ebook image"
                                    width={210}
                                    height={210}
                                />
                            </SelectedCard>:<Image
                                    className="object-contain w-[210px] h-[210px] transition-all duration-300"
                                    src={book.imgsrc}
                                    alt="ebook image"
                                    width={210}
                                    height={210}
                                />
                            }
                            
                        </div>
                    ))}
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