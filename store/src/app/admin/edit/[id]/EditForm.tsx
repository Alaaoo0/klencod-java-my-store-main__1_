"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditForm({ id }: { id: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", weight: "", imageUrl: "", shippingCost: "0" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          name: data.name || "",
          price: (data.price / 100).toString() || "",
          stock: data.stock?.toString() || "",
          weight: data.weight?.toString() || "",
          imageUrl: data.imageUrl || "",
          shippingCost: (data.shippingCost || 0).toString(), // ✅ نعرض تكلفة الشحن
        });
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push("/admin");
      } else {
        const err = await res.json();
        alert(`فشل التعديل: ${err.message || 'حاول مرة تانية'}`);
        setSaving(false); // ✅ نرجع الزر لحالته عشان ما يعلق
      }
    } catch (error) {
      alert("صار خطأ بالاتصال بالسيرفر");
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md border" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">تعديل المنتج</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="اسم المنتج" required />
        <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="السعر بالدولار" required />
        <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="المخزون" required />
        
        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
          <label className="block text-sm font-bold text-blue-800 mb-2">تكلفة الشحن (بالدولار)</label>
          <input type="number" step="0.01" value={formData.shippingCost} onChange={(e) => setFormData({...formData, shippingCost: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="0" />
        </div>

        <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="الوزن بالغرام" required />
        <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="رابط الصورة" />
        
        <button type="submit" disabled={saving} className="w-full bg-black text-white p-3 rounded font-bold hover:bg-gray-800 disabled:bg-gray-400">
          {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
        <Link href="/admin" className="block w-full text-center bg-gray-200 text-gray-700 p-3 rounded font-bold hover:bg-gray-300 transition-colors mt-3">
          ← رجوع للوحة التحكم
        </Link>
      </form>
    </div>
  );
}
