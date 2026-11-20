"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: "", type: "PERCENTAGE", value: "", minOrderValue: "0", maxUses: "", expiresAt: ""
  });
  const [saving, setSaving] = useState(false);

  const fetchCoupons = () => {
    fetch("/api/coupons")
      .then(res => res.json())
      .then(data => { setCoupons(data); setLoading(false); });
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setSaving(false);
    setFormData({ code: "", type: "PERCENTAGE", value: "", minOrderValue: "0", maxUses: "", expiresAt: "" });
    fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("متأكد من الحذف؟")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">إدارة الكوبونات</h1>
        <Link href="/admin" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">رجوع</Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border">
        <h2 className="text-xl font-bold mb-4">إضافة كوبون جديد</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="كود الخصم (مثال: WELCOME10)" className="border p-3 rounded text-black w-full" required />
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="border p-3 rounded text-black w-full">
            <option value="PERCENTAGE">نسبة مئوية (%)</option>
            <option value="FIXED">مبلغ ثابت ($)</option>
          </select>
          <input type="number" step="0.01" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} placeholder="قيمة الخصم" className="border p-3 rounded text-black w-full" required />
          <input type="number" step="0.01" value={formData.minOrderValue} onChange={e => setFormData({...formData, minOrderValue: e.target.value})} placeholder="الحد الأدنى للسلة ($)" className="border p-3 rounded text-black w-full" />
          <input type="number" value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: e.target.value})} placeholder="أقصى عدد استخدامات" className="border p-3 rounded text-black w-full" />
          <input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="border p-3 rounded text-black w-full" />
          <button type="submit" disabled={saving} className="md:col-span-3 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
            {saving ? "جاري الحفظ..." : "إضافة الكوبون"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border">
        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 border-b">الكود</th>
              <th className="p-4 border-b">النوع</th>
              <th className="p-4 border-b">القيمة</th>
              <th className="p-4 border-b">الحد الأدنى</th>
              <th className="p-4 border-b">الاستخدامات</th>
              <th className="p-4 border-b">الحالة</th>
              <th className="p-4 border-b">خيارات</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4 border-b font-bold text-gray-800">{c.code}</td>
                <td className="p-4 border-b">{c.type === "PERCENTAGE" ? "نسبة %" : "مبلغ ثابت"}</td>
                <td className="p-4 border-b text-red-600 font-bold">{c.type === "PERCENTAGE" ? `${c.value}%` : `$${c.value}`}</td>
                <td className="p-4 border-b">${c.minOrderValue}</td>
                <td className="p-4 border-b">{c.usedCount} / {c.maxUses || "غير محدود"}</td>
                <td className="p-4 border-b text-green-600">{c.isActive ? "مفعل" : "معطل"}</td>
                <td className="p-4 border-b">
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p className="text-center p-6 text-gray-500">ما في كوبونات حالياً.</p>}
      </div>
    </div>
  );
}
