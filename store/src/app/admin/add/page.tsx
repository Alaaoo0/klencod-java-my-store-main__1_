"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", weight: "500", imageUrl: "", category: "", description: "", variants: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, category: data[0].name }));
        setFetchingCategories(false);
      })
      .catch(() => setFetchingCategories(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, imageUrl: data.url });
        alert("تم رفع الصورة بنجاح!");
      } else { alert("فشل رفع الصورة"); }
    } catch (error) { alert("صار خطأ أثناء الرفع"); }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) return alert("الرجاء اختيار قسم");
    
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("تم إضافة المنتج بنجاح! 🎉");
        window.location.href = "/admin"; 
      } else {
        alert("فشل إضافة المنتج.");
        setLoading(false);
      }
    } catch (error) {
      alert("صار خطأ بالاتصال.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md border" dir="rtl">
      <div className="mb-6">
        <Link href="/admin" className="text-gray-600 hover:text-black font-bold flex items-center gap-2 text-sm">
          <span>←</span> رجوع للوحة التحكم
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-900">إضافة منتج جديد</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="اسم المنتج" required />
        
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border p-3 rounded text-black bg-white" required disabled={fetchingCategories || categories.length === 0}>
          {fetchingCategories ? <option value="">جاري تحميل الأقسام...</option> : categories.map((cat: any) => <option key={cat.id} value={cat.name} className="text-black">{cat.name}</option>)}
        </select>

        <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="معلومات ووصف المنتج (اختياري)" rows={3}></textarea>

        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
          <label className="block text-sm font-bold text-blue-900 mb-1">خيارات المنتج (مقاسات أو ألوان)</label>
          <input 
            type="text" 
            value={formData.variants} 
            onChange={(e) => setFormData({...formData, variants: e.target.value})} 
            className="w-full border p-2 rounded text-black" 
            placeholder="مثال: أحمر, أزرق, أخضر (افصل بينهم بفاصلة)" 
          />
        </div>

        <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="السعر بالدولار" required />
        <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="المخزون" required />
        <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="الوزن بالغرام" required />
                
        <div className="border p-4 rounded bg-gray-50">
          <label className="block text-sm font-bold text-gray-700 mb-2">صورة المنتج</label>
          <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full border p-2 rounded text-black mb-2" placeholder="أو الصق رابط الصورة هنا..." />
          <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-sm text-gray-500" />
          {uploading && <p className="text-blue-600 text-sm mt-2">جاري رفع الصورة...</p>}
        </div>

        <button type="submit" disabled={loading || uploading || categories.length === 0} className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400 mt-4">
          {loading ? "جاري الحفظ..." : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
}