"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.back()} 
      className="text-gray-600 hover:text-black font-bold flex items-center gap-2 text-sm mb-4"
    >
      <span>←</span> رجوع
    </button>
  );
}
