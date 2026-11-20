"use client";
import { useWishlist } from "../../context/WishlistContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { wishlist } = useWishlist() || {};
    const [mounted, setMounted] = useState(false);

      useEffect(() => setMounted(true), []);
        if (!mounted) return null;

          if (!wishlist || wishlist.length === 0) {
              return (
                    <div className="max-w-4xl mx-auto p-8 text-center mt-10" dir="rtl">
                            <h1 className="text-3xl font-bold mb-6 text-red-600">مفضلتي</h1>
                                    <p className="text-gray-500 mb-6">ما في منتجات بالمفضلة.</p>
                                            <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg font-bold inline-block">تسوق الآن</Link>
                                                  </div>
                                                      );
                                                        }

                                                          return (
                                                              <div className="max-w-6xl mx-auto p-4 mt-8" dir="rtl">
                                                                    <h1 className="text-3xl font-bold mb-8 text-red-600">مفضلتي ({wishlist.length})</h1>
                                                                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                                  {wishlist.map((product: any) => (
                                                                                            <Link key={product.id} href={`/product?slug=${product.slug}`} className="bg-white rounded-lg shadow-sm border p-3 hover:shadow-md transition-shadow">
                                                                                                         <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-md mb-2" />
                                                                                                                      <h2 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</h2>
                                                                                                                                   <p className="text-red-600 font-bold mt-1">${(product.price / 100).toFixed(2)}</p>
                                                                                                                                             </Link>
                                                                                                                                                     ))}
                                                                                                                                                           </div>
                                                                                                                                                               </div>
                                                                                                                                                                 );
                                                                                                                                                                 }