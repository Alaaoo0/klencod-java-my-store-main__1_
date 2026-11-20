"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  useEffect(() => {
    if (query) {
      // جلب المنتجات يلي بتطابق البحث
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [query]);

  // استخراج الأقسام الفريدة من نتائج البحث للفلترة
  const categories = ["الكل", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === "الكل" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) return <p className="text-center mt-20 text-lg font-bold">جاري البحث...</p>;

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen bg-gray-50" dir="rtl">
      
      {/* عنوان الصفحة */}
      <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">
          نتائج البحث عن: <span className="text-red-600">"{query}"</span>
        </h1>
        <p className="text-gray-500 mt-1">تم العثور على {products.length} منتج</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* فلترة جانبية للأقسام (إذا في نتائج) */}
        {products.length > 0 && (
          <aside className="w-full md:w-56 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">تصفية حسب القسم</h3>
              <ul className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-2 md:pb-0 scrollbar-hide">
                {categories.map((cat: any) => (
                  <li key={cat} className="shrink-0">
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-right px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${selectedCategory === cat ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {/* شبكة المنتجات */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <p className="text-6xl mb-4">🔍</p>
              <h2 className="text-xl font-bold text-gray-800 mb-2">ما لقينا أي منتج!</h2>
              <p className="text-gray-500 mb-6">جرب تدور بكلمة تانية أو تأكد من الإملاء.</p>
              <Link href="/" className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700">
                ارجع للمتجر
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                return (
                  <Link key={product.id} href={`/product?slug=${product.slug}`} className="group block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
                    <div className="relative w-full h-40 sm:h-48 bg-gray-50 overflow-hidden">
                      {product.imageUrl && <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'opacity-50' : ''}`} />}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">نفدت الكمية</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2 sm:p-3">
                      <h2 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 leading-tight h-9">{product.name}</h2>
                      <div className="mt-1 flex items-baseline gap-1 flex-wrap">
                        <p className="text-base sm:text-lg font-black text-red-600">${(product.price / 100).toFixed(2)}</p>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-[10px] text-green-600 font-bold bg-green-50 px-1 rounded">شحن مجاني</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
