import { bookCartItemInterface, bookInterface } from "@/interfaces/bookInterface";
import type { CouponResponse } from "@/lib/api/couponService";
import { atom, useAtom } from "jotai";

export const addedCartItemAtom = atom<null | bookInterface>(null);

export const addedCartItemsAtom = atom<bookCartItemInterface[]>([]);

export function useCartOperations() {
  const [cartItems, setCartItems] = useAtom(addedCartItemsAtom);

  const addToCart = (item: bookInterface, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex >= 0) {
        const newItems = [...prevItems];

        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
          appliedCoupon: undefined,
          discountAmount: 0,
        };

        return newItems;
      }

      return [
        ...prevItems,
        {
          ...item,
          quantity,
          appliedCoupon: undefined,
          discountAmount: 0,
        },
      ];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              appliedCoupon: undefined,
              discountAmount: 0,
            }
          : item
      )
    );
  };

  const applyCouponToItem = (
    itemId: string,
    coupon: CouponResponse,
    discountAmount: number
  ) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              appliedCoupon: coupon,
              discountAmount,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isAdded = (book: bookInterface) => {
    return cartItems.find((item) => item.id === book.id);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCouponToItem,
    clearCart,
    isAdded,
  };
}