"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date()); // ✅ لمعرفة وقت آخر تحديث

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/all-orders", { cache: 'no-store' });
      const data = await res.json();
      setOrders(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ التحديث التلقائي كل 60 ثانية
  useEffect(() => {
    fetchOrders(); // جلب أول مرة
    
    const interval = setInterval(() => {
      fetchOrders();
    }, 60000); // 60000 ميلي ثانية = دقيقة واحدة

    return () => clearInterval(interval); // تنظيف المؤقت لما نسكر الصفحة
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const exportToCSV = () => {
    if (orders.length === 0) return alert("لا توجد طلبات لتصديرها");
    const headers = ["رقم الطلب", "اسم الزبون", "رقم الهاتف", "العنوان", "المجموع ($)", "الحالة", "تأكيد الزبون", "التاريخ"];
    
    const rows = orders.map(order => [
      `#${order.id.slice(-6).toUpperCase()}`,
      order.customerName,
      order.phone,
      order.address,
      (order.total / 100).toFixed(2),
      order.status === 'pending' ? 'قيد المعالجة' : order.status === 'shipped' ? 'تم الشحن' : 'تم التوصيل',
      order.customerConfirmed ? 'نعم' : 'لا',
      new Date(order.createdAt).toLocaleDateString('ar-LB')
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="text-center mt-20 text-black font-bold">جاري تحميل الطلبات...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
          {/* ✅ عرض وقت آخر تحديث */}
          <p className="text-xs text-gray-500 mt-1">
            آخر تحديث: {lastUpdated.toLocaleTimeString('ar-LB')} (يتم التحديث تلقائياً)
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={exportToCSV} className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 font-bold flex items-center justify-center gap-2">
            📥 تصدير الطلبات (CSV)
          </button>
          <Link href="/admin" className="flex-1 md:flex-none bg-gray-800 text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 font-bold flex items-center justify-center">
            رجوع
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border">
        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 border-b">رقم الطلب</th>
              <th className="p-4 border-b">الزبون</th>
              <th className="p-4 border-b">المجموع</th>
              <th className="p-4 border-b">تأكيد الزبون</th>
              <th className="p-4 border-b">حالة الطلب</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 border-b font-mono text-sm font-bold text-gray-800">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="p-4 border-b">
                  <p className="font-semibold text-gray-800">{order.customerName}</p>
                  <p className="text-xs text-gray-500" dir="ltr">{order.phone}</p>
                </td>
                <td className="p-4 border-b text-red-600 font-bold">${(order.total / 100).toFixed(2)}</td>
                <td className="p-4 border-b">
                  {order.customerConfirmed ? (
                    <span className="text-green-600 font-bold flex items-center gap-1"><span>✅</span> تم الاستلام</span>
                  ) : (
                    <span className="text-gray-400 text-sm">بانتظار الزبون</span>
                  )}
                </td>
                <td className="p-4 border-b">
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`p-2 rounded-lg font-bold text-sm border-none outline-none cursor-pointer ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                      'bg-green-100 text-green-700'
                    }`}
                  >
                    <option value="pending">قيد المعالجة</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التوصيل</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center p-6 text-gray-500">ما في طلبات حالياً.</p>}
      </div>
    </div>
  );
}
