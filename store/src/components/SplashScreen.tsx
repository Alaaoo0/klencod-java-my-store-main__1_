"use client";
import { useState, useEffect } from "react";

export default function SplashScreen({ siteName }: { siteName: string }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // بعد ثانيتين ونص، بنبلش نخفي الشاشة
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    // بعد 3 ثواني، بنشيلها نهائياً من الشاشة
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      dir="rtl"
    >
      {/* دوائر إضاءة بالخلفية */}
      <div className="absolute w-64 h-64 bg-red-600 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
      
      {/* اللوجو والحركة */}
      <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 tracking-tighter mb-4 animate-pulse">
          {siteName || "متجري"}
        </h1>
        
        {/* خط تحميل صغير */}
        <div className="w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
}
