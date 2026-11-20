import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;

  const products = await prisma.product.findMany({
    where: category ? { category: category } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen bg-gray-50" dir="rtl">
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 border-r-4 border-red-500 pr-3">
          {category ? `قسم: ${category}` : "كل المنتجات"} ({products.length})
        </h1>
        <Link href="/" className="text-sm text-gray-500 hover:text-red-500 font-semibold">← العودة للرئيسية</Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">ما في منتجات بهالقسم حالياً.</h2>
          <Link href="/" className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 inline-block mt-4">ارجع للرئيسية</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((product) => {
            const isOutOfStock = product.stock <= 0;
            return (
              <Link key={product.id} href={`/product?slug=${product.slug}`} className="group block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
                <div className="relative w-full h-40 sm:h-48 bg-gray-50 overflow-hidden">
                  {product.imageUrl && <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'opacity-50' : ''}`} />}
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg z-10 shadow-sm">خصم 15%</div>
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
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
