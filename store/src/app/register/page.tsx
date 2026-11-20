"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState(""); 
    const [email, setEmail] = useState(""); 
      const [password, setPassword] = useState(""); 
        const [phone, setPhone] = useState(""); // 👈 ضفنا حالة الهاتف
          const [error, setError] = useState("");

            const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault(); 
                    setError("");
                        const res = await fetch("/api/auth/register", { 
                              method: "POST", 
                                    headers: { "Content-Type": "application/json" }, 
                                          body: JSON.stringify({ name, email, password, phone }) // 👈 ضفنا الهاتف هون
                                              });
                                                  
                                                      if (res.ok) {
                                                            await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
                                                                  window.location.href = "/"; 
                                                                      } else { 
                                                                            const data = await res.json(); 
                                                                                  setError(data.message); 
                                                                                      }
                                                                                        };

                                                                                          return (
                                                                                              <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12" dir="rtl">
                                                                                                    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
                                                                                                            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">إنشاء حساب جديد</h1>
                                                                                                                    <form onSubmit={handleSubmit} className="space-y-4">
                                                                                                                              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" className="w-full border p-3 rounded-lg text-black" required />
                                                                                                                                        
                                                                                                                                                  {/* 👈 ضفنا حقل الهاتف هون */}
                                                                                                                                                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف (مثال: 70123456)" className="w-full border p-3 rounded-lg text-black" dir="ltr" required />
                                                                                                                                                                      
                                                                                                                                                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="الإيميل" className="w-full border p-3 rounded-lg text-black" dir="ltr" required />
                                                                                                                                                                                          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" className="w-full border p-3 rounded-lg text-black" dir="ltr" required />
                                                                                                                                                                                                    
                                                                                                                                                                                                              {error && <p className="text-red-500 text-sm">{error}</p>}
                                                                                                                                                                                                                        <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700">تسجيل</button>
                                                                                                                                                                                                                                </form>
                                                                                                                                                                                                                                        <p className="text-center text-sm text-gray-600 mt-6">عندك حساب؟ <Link href="/login" className="text-red-600 font-bold hover:underline">سجل دخول</Link></p>
                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                    }