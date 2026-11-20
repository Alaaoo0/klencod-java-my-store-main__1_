"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function OffersPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/coupons")
      .then(res => res.json())
      .then(data => {
        const activeCoupons = data.filter((c: any) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date()));
        setCoupons(activeCoupons);
        setLoading(false);
      });
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) return <p className="text-center mt-20 font-bold text-red-600">جاري تحميل العروض...</p>;

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8 mt-10 min-h-screen relative" dir="rtl">
      
      {/* خلفية خفيفة */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-red-600 to-orange-500 mb-4 flex items-center justify-center gap-2">
          <span className="text-4xl">🎁</span> العروض والكوبونات
        </h1>
        <p className="text-gray-500 text-lg">وفر أكثر مع كوبونات الخصم الحصرية. انسخ الكود واستخدمه عند الدفع!</p>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-red-50 p-10 text-center rounded-3xl shadow-sm border border-red-100 max-w-lg mx-auto relative z-10">
          <p className="text-7xl mb-4 animate-bounce">🎁</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ما في عروض حالياً</h2>
          <p className="text-gray-500 mb-6">تابعنا قريباً، نحن دائماً نحضر لك المفاجآت الحصرية!</p>
          <Link href="/" className="inline-block bg-gradient-to-l from-red-600 to-orange-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105">
            تصفح المتجر الآن
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:-translate-y-1 transition-transform duration-300 flex flex-col">
              
              {/* الجزء العلوي (قيمة الخصم) */}
              <div className="bg-gradient-to-l from-red-600 via-red-500 to-orange-500 p-6 text-white text-center relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-white opacity-20 text-6xl">✨</div>
                <span className="text-4xl font-black tracking-tight drop-shadow-md">
                  {coupon.type === "PERCENTAGE" ? `${coupon.value}% خصم` : `$${coupon.value} خصم`}
                </span>
                <p className="text-sm font-medium opacity-90 mt-1">على طلبك القادم</p>
              </div>

              {/* خط منقط (تأثير التذكرة) */}
              <div className="absolute top-[88px] left-0 right-0 flex items-center justify-between px-2">
                <div className="w-6 h-6 bg-gray-50 rounded-full -ml-3 border-r border-gray-100"></div>
                <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-2"></div>
                <div className="w-6 h-6 bg-gray-50 rounded-full -mr-3 border-l border-gray-100"></div>
              </div>

              {/* الجزء السفلي (التفاصيل والكود) */}
              <div className="p-6 pt-8 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400">الحد الأدنى</span>
                      <span className="font-bold text-gray-800">${coupon.minOrderValue}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400">الاستخدامات</span>
                      <span className="font-bold text-gray-800">{coupon.maxUses ? `${coupon.maxUses - coupon.usedCount} متبقي` : "غير محدود"}</span>
                    </div>
                    {coupon.expiresAt && (
                      <>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-400">ينتهي في</span>
                          <span className="font-bold text-red-500">{new Date(coupon.expiresAt).toLocaleDateString('ar-LB')}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* زر النسخ */}
                  <div 
                    onClick={() => copyToClipboard(coupon.code)}
                    className={`border-2 border-dashed p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      copiedCode === coupon.code 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-300 bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <span className={`text-sm font-bold ${copiedCode === coupon.code ? 'text-green-600' : 'text-red-600'}`}>
                      {copiedCode === coupon.code ? 'تم النسخ بنجاح!' : 'اضغط لنسخ الكود'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-mono font-black text-gray-900 tracking-widest bg-white px-3 py-1 rounded shadow-sm border border-gray-200">
                        {coupon.code}
                      </span>
                      <span className="text-xl">{copiedCode === coupon.code ? '✅' : '📋'}</span>
                    </div>
                  </div>
                </div>

                {/* 👈 زر تسوق الآن */}
                <Link href="/products" className="mt-4 w-full text-center bg-gray-900 text-white font-bold py-2 rounded-lg hover:bg-black transition-colors block">
                  تسوق الآن واستخدم الكود
                </Link>

              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
