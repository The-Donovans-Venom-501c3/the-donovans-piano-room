'use client';
import Button3 from "@/components/atoms/Button3";
import Button4 from "@/components/atoms/Button4";
import CatalogItems from "./CatalogItems";
import { highlightBookAtom } from "@/utils/stores";
import { useAtom } from "jotai";
import { addedCartItemAtom, useCartOperations } from "@/store/cartStore";
import { bookInterface } from "@/interfaces/bookInterface";

export default function Catalog() {
  const [highlightBook] = useAtom(highlightBookAtom);
  const [, setAddedCartItem] = useAtom(addedCartItemAtom);
  const { addToCart } = useCartOperations();

  const handleAddToCart = () => {
    const selectedBookNumber = highlightBook || 1;

    // Catalog item mapping aligned strictly with bookInterface
    const catalogItem: bookInterface = {
      id: `catalog-book-${selectedBookNumber}`,
      title: `Book ${selectedBookNumber}`,
      price: 20,
      type: "Soft cover",
      color: "#FFFFFF",
      imageSrc: `/shop/books/book-${selectedBookNumber}.svg`,
      coverImageSrc: `/shop/books/book-${selectedBookNumber}.svg`,
      titleColor: "#000000",
      description: "For a limited time, purchase the book and audio book together for $20!",
    };

    addToCart(catalogItem, 1);
    setAddedCartItem(catalogItem);
  };

  const scrollToBooks = () => {
    window.scrollTo({
      top: window.innerHeight * 0.75,
      behavior: 'smooth',
    });
  };

  return (
    <div className="mt-[8.8vh] flex w-full h-full justify-center bg-white">
      <div className="mt-[30px] flex max-sm:flex-col h-fit sm:h-[50vh] w-[95%] md:w-[84.7%] items-center justify-around">
        <div className="flex h-full [@media(max-width:356px)]:w-[90%] w-[70%] sm:w-[47%] items-center">
          <div className="h-[90%] w-[90%] md2:w-[70%] xl:w-[50%]">
            <p className="text-xl font-medium text-primary-brown 3xl:text-2xl 4xl:text-3xl">
              Soft cover | Book I
            </p>
            <h2 className="my-6 text-6xl font-medium text-primary-brown 3xl:text-7xl 4xl:text-8xl max-sm:text-center">
              The Donovan&apos;s piano room
            </h2>
            <p
              className="max-sm:text-center text-xl 3xl:text-2xl 4xl:text-3xl"
              style={{ lineHeight: "2.4vh" }}
            >
              For a limited time, 20 people can purchase the book (plus free
              shipping) and the audio book together for only $20!
            </p>
            <div>
              <Button3
                text="Add to cart"
                style={{ marginTop: "12px", marginBottom: "12px" }}
                onClick={handleAddToCart}
              />
              <Button4
                text="Browse all soft cover books"
                style={{ paddingTop: "6px", paddingBottom: "6px" }}
                onClick={scrollToBooks}
              />
            </div>
          </div>
        </div>
        <CatalogItems />
      </div>
    </div>
  );
}