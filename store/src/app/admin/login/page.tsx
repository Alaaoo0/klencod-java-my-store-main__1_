"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "كلمة المرور غلط!");
      }
    } catch (err) {
      setError("صار خطأ بالاتصال بالسيرفر.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900">دخول الإدارة</h1>
          <p className="text-sm text-gray-500 mt-1">أدخل كلمة المرور للوصول للوحة التحكم</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full border-2 border-gray-200 p-3 rounded-xl text-black focus:border-red-500 outline-none transition-colors text-center tracking-widest"
            dir="ltr"
            required
          />
          
          {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-lg">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
