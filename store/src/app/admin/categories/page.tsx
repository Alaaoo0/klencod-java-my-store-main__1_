"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = () => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => { setCategories(data); setLoading(false); });
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    });
    setNewCategory("");
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("متأكد من حذف هذا القسم؟")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleEdit = async (id: string) => {
    if (!editName) return;
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setEditingId(null);
    fetchCategories();
  };

  if (loading) return <p className="text-center mt-20 text-black">جاري التحميل...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md border" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الأقسام</h1>
        <Link href="/admin" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">رجوع</Link>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input 
          type="text" 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)} 
          placeholder="اسم القسم الجديد..." 
          className="flex-1 border p-3 rounded text-black" 
        />
        <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700">إضافة</button>
      </form>

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center border p-3 rounded bg-gray-50">
            {editingId === cat.id ? (
              <div className="flex gap-2 flex-1">
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="border p-2 rounded text-black flex-1" />
                <button onClick={() => handleEdit(cat.id)} className="bg-blue-600 text-white px-4 py-2 rounded">حفظ</button>
                <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded">إلغاء</button>
              </div>
            ) : (
              <>
                <span className="font-semibold text-gray-800">{cat.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} className="text-blue-600 hover:underline">تعديل</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">حذف</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
