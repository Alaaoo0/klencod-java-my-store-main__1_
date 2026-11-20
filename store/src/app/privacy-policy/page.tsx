import { prisma } from "@/lib/prisma";

export default async function PrivacyPolicyPage() {
  let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  const siteName = settings?.siteName || "Ali-Boss";

  return (
    <main className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-sm border border-gray-100" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">سياسة الخصوصية</h1>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>نحن في <strong>{siteName}</strong> نأخذ خصوصيتك على محمل الجد. توضح هذه السياسة كيف نقوم بجمع واستخدام وحماية معلوماتك الشخصية.</p>
        
        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">1. المعلومات التي نجمعها</h2>
        <p>نقوم بجمع المعلومات التي تقدمها لنا طواعية عند إتمام الطلب، مثل: الاسم الكامل، رقم الهاتف، وعنوان التوصيل.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">2. كيف نستخدم معلوماتك</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>لتأكيد طلبك وتوصيله إلى العنوان المطلوب.</li>
          <li>للتواصل معك بخصوص حالة طلبك.</li>
          <li>لتحسين جودة خدماتنا ومنتجاتنا.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">3. حماية البيانات</h2>
        <p>نستخدم إجراءات أمنية متقدمة لحماية بياناتك. <strong>نحن لا نبيع أو نشارك معلوماتك الشخصية مع أي طرف ثالث لأغراض تسويقية.</strong> معلوماتك تستخدم فقط من قبل فريق المتجر وشركة التوصيل لإتمام عملية الشراء.</p>
      </div>
    </main>
  );
}
