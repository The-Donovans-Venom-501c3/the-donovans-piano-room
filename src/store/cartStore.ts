import { bookCartItemInterface, bookInterface } from '@/interfaces/bookInterface';
import { atom, useAtom } from 'jotai';

export const addedCartItemAtom = atom<null | bookInterface>(null) 


export const addedCartItemsAtom = atom<bookCartItemInterface[]>([]);

export function useCartOperations() {
    const [cartItems, setCartItems] = useAtom(addedCartItemsAtom);
  
    // Add item to cart
    const addToCart = (item: bookInterface, quantity = 1) => {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
        
        if (existingItemIndex >= 0) {
          // Item exists, update quantity
          const newItems = [...prevItems];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity,
          };
          return newItems;
        } else {
          // Item doesn't exist, add new
          return [...prevItems, { ...item, quantity }];
        }
      });
    };
  
    // Remove item from cart
    const removeFromCart = (itemId: string) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };
  
    // Update item quantity
    const updateQuantity = (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(itemId);
        return;
      }
  
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    };
  
    // Clear cart
    const clearCart = () => {
      setCartItems([]);
    };
  
    return {
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    };
  }