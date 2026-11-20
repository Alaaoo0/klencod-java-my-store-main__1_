import Link from "next/link";

export default function Footer({ whatsapp, email, siteName }: { whatsapp: string, email: string, siteName: string }) {
  return (
    <footer className="bg-gray-900 text-white mt-16 py-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-black mb-4 text-red-500 tracking-tighter">{siteName}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">أفضل المنتجات بأفضل الأسعار. شحن سريع لجميع المناطق اللبنانية. تسوق بثقة وأمان.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/about" className="hover:text-red-500 transition-colors">من نحن</Link></li>
            <li><Link href="/track" className="hover:text-red-500 transition-colors text-white font-bold">📦 تتبع الطلب</Link></li> {/* 👈 ضفنا هاد */}
            <li><Link href="/return-policy" className="hover:text-red-500 transition-colors">سياسة الاسترجاع</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-red-500 transition-colors">سياسة الخصوصية</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
          <p className="text-sm text-gray-400 mb-2" dir="ltr">واتساب: {whatsapp}</p>
          <p className="text-sm text-gray-400">إيميل: {email}</p>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-10 pt-6 border-t border-gray-800">
        © 2026 {siteName}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
