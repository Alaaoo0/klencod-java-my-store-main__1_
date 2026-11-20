import { prisma } from "@/lib/prisma";

export default async function ReturnPolicyPage() {
  let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  const siteName = settings?.siteName || "Ali-Boss";

  return (
    <main className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-sm border border-gray-100" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">سياسة الاسترجاع والاستبدال</h1>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>رضاكم هو أولويتنا القصوى في <strong>{siteName}</strong>. إذا لم تكن راضياً عن عملية الشراء، يمكنك استرجاع أو استبدال المنتج وفقاً للشروط التالية:</p>
        
        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">1. مدة الاسترجاع</h2>
        <p>يحق للعميل طلب استرجاع أو استبدال المنتج خلال <strong>3 أيام</strong> من تاريخ الاستلام.</p>
        
        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">2. شروط الاسترجاع</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>أن يكون المنتج في حالته الأصلية ومغلفاً بتغليفه الأصلي.</li>
          <li>عدم استخدام المنتج أو إتلافه.</li>
          <li>وجود الفاتورة أو إثبات الشراء.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">3. المنتجات غير القابلة للاسترجاع</h2>
        <p>لا يمكن استرجاع المنتجات التي تتعلق بالنظافة الشخصية، أو المنتجات المخصصة (التي تم تفصيلها حسب الطلب)، أو المنتجات التي تم فتحها وتلف غلافها الأصلي.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">4. تكاليف الاسترجاع</h2>
        <p>يتحمل العميل تكاليف شحن الاسترجاع في حال كان المنتج سليماً وتم تغيير الرأي بشأنه. أما إذا كان المنتج تالفاً أو غير مطابق للوصف، يتحمل المتجر كافة تكاليف الشحن.</p>
      </div>
    </main>
  );
}
