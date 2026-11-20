"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    
    if (res.ok) { 
      // 👇 هون بنظف أي سلة قديمة موجودة حالياً بالجهاز
      localStorage.removeItem("store_cart");
      localStorage.removeItem("store_wishlist");

      // 👇 وبنرجع بس السلة والمفضلة الخاصة بهالإيميل
      const savedCart = localStorage.getItem(`saved_cart_${email}`);
      if (savedCart) localStorage.setItem("store_cart", savedCart);

      const savedWishlist = localStorage.getItem(`saved_wishlist_${email}`);
      if (savedWishlist) localStorage.setItem("store_wishlist", savedWishlist);

      window.location.href = "/";
    } else { 
      const data = await res.json(); 
      setError(data.message); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12" dir="rtl">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">تسجيل الدخول</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="الإيميل" className="w-full border p-3 rounded-lg text-black" dir="ltr" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" className="w-full p-3 rounded-lg text-black" dir="ltr" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800">دخول</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">ما عندك حساب؟ <Link href="/register" className="text-red-600 font-bold hover:underline">سجل هلق</Link></p>
      </div>
    </div>
  );
}
