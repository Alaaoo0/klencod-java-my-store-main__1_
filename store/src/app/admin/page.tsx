"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const router = useRouter();

  const fetchData = () => {
    Promise.all([
      fetch("/api/products").then(res => res.json()),
      fetch("/api/admin/stats", { cache: 'no-store' }).then(res => res.json())
    ]).then(([productsData, statsData]) => {
      setProducts(productsData);
      setStats(statsData);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("متأكد إنك بدك تحذف هالمنتج؟")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("خطأ في الاتصال");
    }
    setImporting(false);
    e.target.value = '';
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) return <p className="text-center mt-20 text-black font-bold">جاري تحميل لوحة التحكم...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-red-600">إدارة المتجر</h1>
          <button onClick={handleLogout} className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">
            خروج
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/orders" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            📦 الطلبات
          </Link>
          <Link href="/admin/coupons" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            🎟️ الكوبونات
          </Link>
          <Link href="/admin/categories" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
            📁 إدارة الأقسام
          </Link>
          <Link href="/admin/wallet" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
            💳 المحفظة
          </Link>
          {/* 👈 ضفنا زر الإشعارات هون */}
          <Link href="/admin/notifications" className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
            🔔 الإشعارات
          </Link>
          <Link href="/admin/settings" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
            ⚙️ الإعدادات
          </Link>
          <Link href="/admin/add" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            + إضافة منتج جديد
          </Link>
          
          <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer flex items-center justify-center">
            {importing ? "جاري الاستيراد..." : "📥 استيراد CSV"}
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm p-6 border-r-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-bold mb-2">إجمالي المبيعات</h3>
            <p className="text-3xl font-black text-gray-900">${((stats.totalSales || 0) / 100).toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-r-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-bold mb-2">إجمالي الطلبات</h3>
            <p className="text-3xl font-black text-gray-900">{stats.totalOrders || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-r-4 border-orange-500">
            <h3 className="text-gray-500 text-sm font-bold mb-2">إجمالي المنتجات</h3>
            <p className="text-3xl font-black text-gray-900">{stats.totalProducts || 0}</p>
          </div>
        </div>
      )}

      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md mb-10 overflow-hidden border border-gray-100">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">آخر الطلبات</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 font-semibold hover:underline">مشاهدة الكل</Link>
          </div>
          <table className="w-full text-right border-collapse">
            <thead className="text-gray-600 text-sm">
              <tr>
                <th className="p-4 border-b">اسم الزبون</th>
                <th className="p-4 border-b">الهاتف</th>
                <th className="p-4 border-b">المجموع</th>
                <th className="p-4 border-b">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.slice(0, 5).map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 border-b font-semibold text-gray-800">{order.customerName}</td>
                  <td className="p-4 border-b text-gray-600" dir="ltr">{order.phone}</td>
                  <td className="p-4 border-b text-red-600 font-bold">${(order.total / 100).toFixed(2)}</td>
                  <td className="p-4 border-b text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString('ar-LB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-4">المنتجات</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 border-b">الصورة</th>
              <th className="p-4 border-b">الاسم</th>
              <th className="p-4 border-b">السعر</th>
              <th className="p-4 border-b">المخزون</th>
              <th className="p-4 border-b">الخيارات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4 border-b">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  )}
                </td>
                <td className="p-4 border-b font-semibold text-gray-800">{product.name}</td>
                <td className="p-4 border-b text-green-600">${(product.price / 100).toFixed(2)}</td>
                <td className="p-4 border-b text-gray-800">{product.stock}</td>
                <td className="p-4 border-b flex gap-4">
                  <Link href={`/admin/edit/${product.id}`} className="text-blue-600 hover:underline">تعديل</Link>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center p-6 text-gray-500">ما في منتجات حالياً.</p>}
      </div>
    </div>
  );
}
