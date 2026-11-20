"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart = [] } = useCart() || {};

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

      return (
          <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-gray-800">
                                  متجري
                                          </Link>
                                                  <nav className="flex items-center gap-6">
                                                            <Link href="/" className="text-gray-600 hover:text-black font-medium">
                                                                        الرئيسية
                                                                                  </Link>
                                                                                            <Link href="/cart" className="text-gray-600 hover:text-black font-medium flex items-center gap-2">
                                                                                                        🛒 السلة
                                                                                                                    {totalItems > 0 && (
                                                                                                                                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                                                                                                                  {totalItems}
                                                                                                                                                                </span>
                                                                                                                                                                            )}
                                                                                                                                                                                      </Link>
                                                                                                                                                                                              </nav>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                        </header>
                                                                                                                                                                                                          );
                                                                                                                                                                                                          }