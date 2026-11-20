"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return alert("عبّي العنوان والمحتوى");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("✅ " + data.message);
        setTitle("");
        setBody("");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ صار خطأ بالاتصال بالسيرفر");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-sm border border-gray-100" dir="rtl">
      <div className="mb-6">
        <Link href="/admin" className="text-gray-600 hover:text-black font-bold flex items-center gap-2">
          <span>←</span> رجوع للوحة التحكم
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">🔔 إرسال إشعار للزبائن</h1>

      <form onSubmit={handleSend} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الإشعار</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-3 rounded-lg text-black" placeholder="مثال: عرض خاص!" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">نص الإشعار</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className="w-full border p-3 rounded-lg text-black" placeholder="خصم 20% على جميع المنتجات..." required></textarea>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">الرابط عند الضغط (اختياري)</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full border p-3 rounded-lg text-black" placeholder="/products" dir="ltr" />
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors">
          {loading ? "جاري الإرسال..." : "إرسال الإشعار الآن"}
        </button>
      </form>

      {message && <p className={`mt-4 text-sm font-bold text-center ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
    </div>
  );
}
