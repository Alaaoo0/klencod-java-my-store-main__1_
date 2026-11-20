import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AddToCartButton from "./AddToCartButton";
import { WishlistButton } from "../../components/WishlistButton";
import ReviewSection from "../../components/ReviewSection";
import BackButton from "../../components/BackButton";
import { prisma } from "@/lib/prisma";

export const instant = false;

async function ProductDetails({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { slug } = await searchParams;
  if (!slug) notFound();

  const product = await prisma.product.findFirst({
    where: { OR: [{ slug: slug }, { id: slug }] }
  });

  if (!product) notFound();

  const isOutOfStock = product.stock <= 0;
  const relatedProducts = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id }, stock: { gt: 0 } },
    take: 4,
  });

  return (
    <div className="space-y-8">
      <BackButton />
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-100 relative">
        <div>
          <div className="w-full h-80 md:h-[450px] bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-100 relative group">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-contain ${isOutOfStock ? 'opacity-50' : ''}`} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">لا توجد صورة</div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
                <span className="bg-red-600 text-white px-6 py-2 rounded-full text-lg font-bold transform -rotate-12">نفدت الكمية</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <WishlistButton product={product} />
            </div>

            {product.description && (
              <p className="text-gray-600 text-sm mt-2 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">{product.description}</p>
            )}

            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500 text-lg">★★★★★</span>
              <span className="text-gray-500 text-sm">(124 تقييم)</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="text-4xl font-black text-red-600">${(product.price / 100).toFixed(2)}</p>
              <p className="text-sm text-green-600 font-bold mt-2">شحن مجاني</p>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-600"><strong className="text-gray-900">الوزن:</strong> {product.weight} غرام</p>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">المخزون:</strong> 
                <span className={isOutOfStock ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                  {isOutOfStock ? ' غير متوفر' : ` ${product.stock} قطعة`}
                </span>
              </p>
            </div>
          </div>

          <AddToCartButton product={product} variants={product.variants} />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-r-4 border-red-500 pr-3">منتجات قد تعجبك</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rp) => (
              <Link key={rp.id} href={`/product?slug=${rp.slug}`} className="group block bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                <div className="w-full h-32 bg-gray-50 overflow-hidden">
                  <img src={rp.imageUrl || ''} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{rp.name}</h3>
                  <p className="text-red-600 font-bold mt-2">${(rp.price / 100).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <ReviewSection productId={product.id} />
    </div>
  );
}

export default function ProductPage({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  return (
    <main className="max-w-5xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen" dir="rtl">
      <Suspense fallback={<p className="text-center mt-20 text-gray-500">جاري تحميل المنتج...</p>}>
        <ProductDetails searchParams={searchParams} />
      </Suspense>
    </main>
  );
}