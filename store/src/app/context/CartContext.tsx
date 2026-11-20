"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("store_cart");
    if (saved) setCart(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("store_cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const cartItemId = product.variant ? `${product.id}-${product.variant}` : product.id;
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      
      const addQty = product.quantity || 1;
      const maxStock = product.stock || 99;

      if (existing) {
        const newQty = existing.quantity + addQty;
        if (newQty > maxStock) {
          alert(`عذراً، الكمية المتوفرة في المخزون هي ${maxStock} فقط.`);
          return prev;
        }
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { ...product, quantity: Math.min(addQty, maxStock), cartItemId }];
    });
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const maxStock = item.stock !== undefined ? item.stock : 99;
          if (newQty > maxStock) {
            alert(`عذراً، الكمية المتوفرة في المخزون هي ${maxStock} فقط.`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}