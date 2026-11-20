"use client";

import { Suspense, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function CartContent() {
  const { cart = [], removeFromCart, cartTotal = 0, setCartFromShare, updateQuantity } = useCart() || {};
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const shared = searchParams.get("share");
    if (shared) {
      try {
        const decoded = JSON.parse(decodeURIComponent(shared));
        if (setCartFromShare && Array.isArray(decoded)) {
          setCartFromShare(decoded);
          window.history.replaceState(null, '', '/cart');
        }
      } catch (e) {
        console.error("خطأ في قراءة السلة المشتركة");
      }
    }
  }, [searchParams, setCartFromShare]);

  const handleShareCart = () => {
    if (cart.length === 0) return;
    const encodedCart = encodeURIComponent(JSON.stringify(cart));
    const shareUrl = `${window.location.origin}/cart?share=${encodedCart}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setModalMessage("تم نسخ رابط السلة! الصقه بأي مكان وابعته لصاحبك. 📋");
      setShowModal(true);
    }).catch(() => {
      setModalMessage("فشل نسخ الرابط، جرّب مرة تانية.");
      setShowModal(true);
    });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center mt-10" dir="rtl">
        <h1 className="text-3xl font-bold mb-6 text-red-600">سلة المشتريات</h1>
        <p className="text-gray-500 mb-6">السلة فاضية حالياً.</p>
        <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg font-bold inline-block hover:bg-gray-800">
          تسوق الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8" dir="rtl">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-gray-600 hover:text-black font-bold flex items-center gap-2 text-sm">
          <span>←</span> رجوع
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-600">سلة المشتريات</h1>
        <button onClick={handleShareCart} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          🔗 مشاركة السلة
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        {cart.map((item: any) => (
          <div key={item.cartItemId} className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-4 gap-4">
            <div className="flex items-center gap-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded bg-gray-50" />
              )}
              <div>
                <h2 className="font-semibold text-gray-800">{item.name}</h2>
                {item.variant && (
                  <p className="text-xs text-red-600 font-bold mt-1 bg-red-50 inline-block px-2 py-0.5 rounded">الخيار: {item.variant}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} disabled={item.stock !== undefined && item.quantity >= item.stock} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 font-bold disabled:opacity-50">+</button>
                  <span className="text-sm font-bold text-gray-700 w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} disabled={item.quantity <= 1} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 font-bold disabled:opacity-50">-</button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <p className="font-bold text-red-600">${((item.price * item.quantity) / 100).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-500 hover:text-red-700 text-sm font-medium">حذف</button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <p className="text-xl font-bold text-gray-800">المجموع:</p>
          <p className="text-2xl font-bold text-red-600">${(cartTotal / 100).toFixed(2)}</p>
        </div>
        
        <Link href="/checkout" className="block w-full text-center bg-red-600 text-white font-bold py-4 rounded-lg mt-6 hover:bg-red-700 transition-colors">إتمام الطلب</Link>
        <Link href="/" className="block w-full text-center bg-gray-100 text-gray-700 font-bold py-3 rounded-lg mt-3 hover:bg-gray-200 transition-colors">← متابعة التسوق</Link>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            <div className="bg-blue-50 p-6 flex flex-col items-center text-center">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-gray-900">تم النسخ!</h3>
              <p className="text-gray-600 mt-2">{modalMessage}</p>
            </div>
            <div className="p-4 bg-white">
              <button onClick={() => setShowModal(false)} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">حسناً</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 font-bold text-gray-500">جاري تحميل السلة...</div>}>
      <CartContent />
    </Suspense>
  );
}