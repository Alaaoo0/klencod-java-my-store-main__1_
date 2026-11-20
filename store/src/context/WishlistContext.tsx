"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

      useEffect(() => {
          const saved = localStorage.getItem("store_wishlist");
              if (saved) setWishlist(JSON.parse(saved));
                  setIsLoaded(true);
                    }, []);

                      useEffect(() => {
                          if (isLoaded) localStorage.setItem("store_wishlist", JSON.stringify(wishlist));
                            }, [wishlist, isLoaded]);

                              const toggleWishlist = (product: any) => {
                                  setWishlist((prev) => {
                                        const exists = prev.find((item) => item.id === product.id);
                                              if (exists) return prev.filter((item) => item.id !== product.id);
                                                    return [...prev, product];
                                                        });
                                                          };

                                                            const isInWishlist = (id: string) => wishlist.some((item) => item.id === id);

                                                              return (
                                                                  <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
                                                                        {children}
                                                                            </WishlistContext.Provider>
                                                                              );
                                                                              }

                                                                              export function useWishlist() {
                                                                                return useContext(WishlistContext);
                                                                                }