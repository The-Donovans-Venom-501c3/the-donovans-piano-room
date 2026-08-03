"use client";
import { useEffect, useState } from 'react';
import { getAllBooks } from '../../../lib/api/bookService';
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
        let categorizedBooks: [bookInterface[], bookInterface[], bookInterface[]] = [[], [], []];

        response.forEach((category: any) => {
          category.books?.forEach((book: any) => {
            const mappedBook: bookInterface = {
              id: book.id || "N/A",
              title: book.title || "No title",
              color: book.color || "#FFFFFF",
              imageSrc: book.picture || "",
              coverImageSrc: book.picture2 || "",
              titleColor: book.tdprColor || "#000000",
              type: category.name || "Unknown type",
              price: book.price || 0,
              description: book.intro || "No description",
            };

            // Normalize category string for robust case-insensitive matching
            const categoryType = mappedBook.type.trim().toLowerCase();

            switch (categoryType) {
              case "soft cover books":
              case "soft cover":
              case "softcover":
                categorizedBooks[0].push(mappedBook);
                break;
              case "e-books":
              case "ebooks":
              case "e book":
                categorizedBooks[1].push(mappedBook);
                break;
              case "audio books":
              case "audiobooks":
              case "audio book":
                categorizedBooks[2].push(mappedBook);
                break;
              default:
                console.warn(`Unknown book type: ${mappedBook.type}`);
            }
          });
        });

        setBooksList(categorizedBooks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center my-10">
        <div className="text-primary-purple font-semibold text-lg">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center my-10">
        <div className="text-primary-purple font-medium text-lg">Loading books...</div>
      </div>
    );
  }

  const renderEmptyState = (categoryName: string) => (
    <div className="w-full py-8 text-center rounded-xl bg-white/40 border border-primary-purple/20">
      <p className="text-primary-brown text-lg font-medium">
        No {categoryName} available at the moment.
      </p>
    </div>
  );

  return (
    <div className="min-h-[50.9vh] my-[6vh] flex justify-center">
      <div className="w-[84.7%]">
        {/* Soft cover books */}
        <h5 className="text-3xl text-primary-brown font-semibold mb-[2%]">Soft cover books</h5>
        <div className="flex flex-wrap gap-6 justify-start mb-8">
          {booksList[0].length > 0 ? (
            booksList[0].map((book, i) => (
              <BookItem key={book.id || i} book={book} />
            ))
          ) : (
            renderEmptyState("Soft cover books")
          )}
        </div>

        {/* E-Books */}
        <h5 className="text-3xl text-primary-brown font-semibold my-[2%]">E-Books</h5>
        <div className="flex flex-wrap gap-6 justify-start mb-8">
          {booksList[1].length > 0 ? (
            booksList[1].map((book, i) => (
              <BookItem key={book.id || i} book={book} />
            ))
          ) : (
            renderEmptyState("E-Books")
          )}
        </div>

        {/* Audio books */}
        <h5 className="text-3xl text-primary-brown font-semibold my-[2%]">Audio books</h5>
        <div className="flex flex-wrap gap-6 justify-start">
          {booksList[2].length > 0 ? (
            booksList[2].map((book, i) => (
              <BookItem key={book.id || i} book={book} />
            ))
          ) : (
            renderEmptyState("Audio books")
          )}
        </div>
      </div>
    </div>
  );
}