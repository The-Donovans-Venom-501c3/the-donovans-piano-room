import { books } from "@/utils/general";
import BookItem from "@/components/atoms/BookItem";

export default function FrequentlyPurchasedTogether() {
  const booksList = [books[1], books[2]];

  return (
    <div className="z-50 my-[10vh] flex items-center justify-center">
      <div className="w-[84.7%]">
        <div className="text-4xl font-semibold text-primary-brown max-sm:text-center">
          Frequently purchased together
        </div>
        <div className="mt-[3vh] flex flex-col items-center justify-start gap-[2vw] sm:flex-row">
          {booksList.map((book, i) => (
            <BookItem key={i} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}
