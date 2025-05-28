import BookItem from "@/components/atoms/BookItem";
import { bookInterface } from "@/interfaces/bookInterface";

export default function FrequentlyPurchasedTogether() {

  const books: bookInterface[] = [
    {
      "id": "b001",
      "title": "BOOK I",
      "price": 15,
      "color": "#F6AD69",
      "titleColor": "#B5511A",
      "imageSrc": "https://raw.githubusercontent.com/The-Donovans-Venom-501c3/svg-image-server/main/tdpr/books/with-bg/softCover-books/softCover-Book-1.svg",
      "coverImageSrc": "https://raw.githubusercontent.com/The-Donovans-Venom-501c3/svg-image-server/main/tdpr/books/without-bg/soft-cover-books/book-1.svg",
      "description": "This engaging learning method instructs learners in the fundamentals of music theory, spanning rhythm, time signatures, sharps, flats, whole steps, half steps, our scale formula, pentascales, music vocabulary, and more!",
      "type": "Soft cover"
    },
    {
      "id": "b002",
      "title": "BOOK II",
      "price": 15,
      "color": "#F9D867",
      "titleColor": "#BC8212",
      "imageSrc": "https://raw.githubusercontent.com/The-Donovans-Venom-501c3/svg-image-server/main/tdpr/books/with-bg/softCover-books/softCover-Book-2.svg",
      "coverImageSrc": "https://raw.githubusercontent.com/The-Donovans-Venom-501c3/svg-image-server/main/tdpr/books/without-bg/soft-cover-books/book-2.svg",
      "description": "After mastering the foundational elements, students will delve into chords, inversions, complex rhythms, major & minor scales, fingering techniques, intervals, transcribing, writing music, and more! Our Musical Journal, featured in Book II, becomes their trusted companion, fostering organized practice habits.",
      "type": "Soft cover"
    },
  ];

  return (
    <div className="z-20 my-[10vh] flex items-center justify-center">
      <div className="w-[84.7%]">
        <div className="text-4xl font-semibold text-primary-brown max-sm:text-center">
          Frequently purchased together
        </div>
        <div className="mt-[3vh] flex flex-col justify-start gap-[2vw] sm:flex-row">
          {books.map((book, i) => (
            <BookItem key={i} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}
