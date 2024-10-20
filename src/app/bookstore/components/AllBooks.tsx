"use client"
import { useEffect, useState } from 'react';
import { getAllBooks } from '../../../lib/api/bookService'
import { bookInterface } from "@/interfaces/bookInterface";
import BookItem from "@/components/atoms/BookItem";

export default function AllBooks() {
  const [booksList, setBooksList] = useState<[bookInterface[], bookInterface[], bookInterface[]]>([[], [], []]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    const fetchBooks = async () => {
      try {
        const response = await getAllBooks(); 

        let booksList: [bookInterface[], bookInterface[], bookInterface[]] = [[], [], []];

        response.forEach((category) => {
          category.books.forEach((book) => {
            const mappedBook = {
              id: book.id || "N/A",
              title: book.title || "No title",
              color: book.color || "#FFFFFF",
              imageSrc: book.picture || "",
              coverImageSrc: book.picture2 || "",
              titleColor: book.tdprColor || "#000000",
              type: book.comments || "Unknown type",
              price: book.price || 0,
              description: book.intro || "No description",
              level: book.level || "Unknown level",
            };

            switch (mappedBook.type) {
              case "Soft cover":
                booksList[0].push(mappedBook);
                break;
              case "E-book":
                booksList[1].push(mappedBook);
                break;
              case "Audio book":
                booksList[2].push(mappedBook);
                break;
              default:
                console.warn(`Unknown book type: ${mappedBook.type}`);
            }
          });
        });

        setBooksList(booksList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to load books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading books...</div>;
  }

  return (
    <div className="min-h-[50.9vh] my-[6vh] flex justify-center">
      <div className="w-[84.7%]">
        <h5 className="text-3xl text-primary-brown font-semibold mb-[2%]">Soft cover books</h5>
        <div className="flex justify-between">
          {booksList[0].length > 0 ? (
            booksList[0].map((book, i) => (
              <BookItem key={i} book={book} />
            ))
          ) : (
            <p>No Soft cover books available.</p>
          )}
        </div>

        <h5 className="text-3xl text-primary-brown font-semibold my-[2%]">E-Books</h5>
        <div className="flex justify-between">
          {booksList[1].length > 0 ? (
            booksList[1].map((book, i) => (
              <BookItem key={i} book={book} />
            ))
          ) : (
            <p>No E-Books available.</p>
          )}
        </div>

        <h5 className="text-3xl text-primary-brown font-semibold my-[2%]">Audio books</h5>
        <div className="flex justify-between">
          {booksList[2].length > 0 ? (
            booksList[2].map((book, i) => (
              <BookItem key={i} book={book} />
            ))
          ) : (
            <p>No Audio books available.</p>
          )}
        </div>
      </div>
    </div>
  );
}