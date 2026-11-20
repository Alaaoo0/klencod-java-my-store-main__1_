import Link from "next/link";
import { prisma } from "@/lib/prisma";

// 👈 شلنا سطر export const dynamic يلي كان بيعمل خطأ

export default async function AboutPage() {
  let settings = null;
  try {
    settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  } catch (e) {
    console.error("Error fetching settings for About page:", e);
  }
  
  const siteName = settings?.siteName || "متجرنا";

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 mt-10 min-h-screen" dir="rtl">
      <div className="bg-gradient-to-l from-red-600 to-red-400 rounded-3xl p-10 md:p-16 text-center text-white mb-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4">قصتنا مع {siteName}</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            نحن لسنا مجرد متجر إلكتروني، نحن وجهتك الأولى للتسوق بثقة وأمان في لبنان. جئنا لنغير مفهوم التسوق عبر الإنترنت.
          </p>
        </div>
        <span className="text-9xl opacity-20 absolute -bottom-10 -left-10">🛍️</span>
      </div>

      <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">لماذا يختارنا آلاف الزبائن؟</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🚚</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">توصيل سريع</h3>
          <p className="text-gray-500 leading-relaxed">نوصل طلبك لباب بيتك بأسرع وقت ممكن لجميع المناطق اللبنانية، مع إمكانية الدفع عند الاستلام.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🛡️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">جودة مضمونة</h3>
          <p className="text-gray-500 leading-relaxed">نختار منتجاتنا بعناية فائقة من أفضل الموردين، ونضمن لك جودة عالية بأسعار تنافسية لا تقبل المنافسة.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🤝</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">دعم 24/7</h3>
          <p className="text-gray-500 leading-relaxed">فريق خدمة العملاء جاهز للرد على استفساراتك ومساعدتك عبر الواتساب في أي وقت طوال أيام الأسبوع.</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-3xl p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">جاهز تبدأ تجربة التسوق؟</h2>
        <p className="text-gray-400 mb-8">اكتشف آلاف المنتجات واستفد من العروض الحصرية.</p>
        <Link href="/" className="inline-block bg-red-600 text-white font-bold px-10 py-4 rounded-full hover:bg-red-700 transition-colors shadow-lg text-lg">
          تصفح المتجر الآن
        </Link>
      </div>
    </main>
  );
}