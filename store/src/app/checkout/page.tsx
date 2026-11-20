"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart = [], cartTotal = 0, clearCart } = useCart() || {};
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null); 
  
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [storeWhatsapp, setStoreWhatsapp] = useState("96170000000");
  const [whatsappMessage, setWhatsappMessage] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"error" | "success">("error");

  const router = useRouter();
  
  const totalShipping = cart.reduce((total: number, item: any) => total + ((item.shippingCost || 0) * 100 * item.quantity), 0);
  const finalTotal = cartTotal + totalShipping - (appliedCoupon?.discountAmount || 0);

  const showModal = (message: string, type: "error" | "success" = "error") => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  useEffect(() => {
    fetch("/api/auth/me", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setIsUserLoggedIn(true);
          setName(data.user.name);
          setUserBalance(data.user.walletBalance || 0);
        } else {
          setIsUserLoggedIn(false);
          router.push("/login");
        }
      })
      .catch(() => {
        setIsUserLoggedIn(false);
        router.push("/login");
      });

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp) setStoreWhatsapp(data.whatsapp);
      })
      .catch(() => {});
  }, [router]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCheckingCoupon(true);
    setCouponError("");
    setAppliedCoupon(null);

    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, cartTotal }),
    });

    const data = await res.json();
    setCheckingCoupon(false);

    if (res.ok && data.valid) {
      setAppliedCoupon(data);
    } else {
      setCouponError(data.message || "كود غير صالح");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.length === 0) return showModal("السلة فاضية!");
    if (!name || !phone || !address) return showModal("عبّي كل الحقول من فضلك");

    if (userBalance !== null && userBalance < (finalTotal / 100)) {
      return showModal(`عذراً، رصيد محفظتك غير كافٍ. المطلوب: $${(finalTotal / 100).toFixed(2)}. لديك: $${userBalance.toFixed(2)}`);
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customerName: name, 
          phone, 
          address, 
          items: cart, 
          total: finalTotal,
          couponId: appliedCoupon?.couponId || null,
          discountAmount: appliedCoupon?.discountAmount || 0
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        
        let msg = `طلب جديد\n\nالاسم: ${name}\nالهاتف: ${phone}\nالعنوان: ${address}\n\nالطلبات:\n`;
        cart.forEach((item: any) => { msg += `- ${item.name} × ${item.quantity} = $${((item.price * item.quantity) / 100).toFixed(2)}\n`; });
        if (appliedCoupon) msg += `\nالخصم (${appliedCoupon.code}): -$${(appliedCoupon.discountAmount / 100).toFixed(2)}`;
        if (totalShipping > 0) msg += `\nالشحن: $${(totalShipping / 100).toFixed(2)}`;
        msg += `\nالمجموع النهائي: $${(finalTotal / 100).toFixed(2)}`;
        
        const encodedMsg = encodeURIComponent(msg);
        setWhatsappMessage(encodedMsg);

        window.dispatchEvent(new Event('refreshNavbar'));

        if (clearCart) clearCart();

        setTimeout(() => {
          window.open(`https://wa.me/${storeWhatsapp}?text=${encodedMsg}`, "_blank");
        }, 1000);

      } else {
        showModal(data.message || "فشل الطلب، حاول مرة تانية.");
      }
    } catch (error) {
      showModal("صار خطأ بالاتصال بالسيرفر");
    }
    setLoading(false);
  };

  if (isUserLoggedIn === null || userBalance === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <p className="text-lg font-bold text-gray-600">جاري التحقق من الحساب والرصيد...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-20 text-center bg-white rounded-2xl shadow-sm border" dir="rtl">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-600 mb-8">تم خصم المبلغ من محفظتك، ورح نتواصل معك قريباً للتأكيد.</p>
        
        <a 
          href={`https://wa.me/${storeWhatsapp}?text=${whatsappMessage}`}
          target="_blank"
          className="w-full bg-green-600 text-white font-bold text-lg py-4 rounded-xl mb-4 hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <span>📱</span> إرسال تفاصيل الطلب عبر واتساب
        </a>

        <Link href="/" className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-bold inline-block hover:bg-gray-200 w-full transition-colors">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-4 md:p-6 mt-8 bg-gray-50 min-h-screen" dir="rtl">
        <div className="flex items-center justify-center mb-10 text-sm font-bold">
          <div className="flex items-center text-gray-400"><span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">1</span><span className="mx-2">السلة</span></div>
          <div className="w-16 h-1 bg-red-600 mx-2"></div>
          <div className="flex items-center text-red-600"><span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center border-2 border-red-600">2</span><span className="mx-2">إتمام الطلب</span></div>
          <div className="w-16 h-1 bg-gray-200 mx-2"></div>
          <div className="flex items-center text-gray-400"><span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">3</span><span className="mx-2">تأكيد</span></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-900">معلومات التوصيل</h2>
            
            {/* 👇 شكل جديد وحلو لصندوق الرصيد والخصم */}
            <div className="bg-gradient-to-l from-green-50 to-white border border-green-200 p-5 rounded-xl mb-6 shadow-sm">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-green-100">
                <span className="text-gray-700 font-bold flex items-center gap-1"><span>💳</span> رصيدك الحالي:</span>
                <span className="text-2xl font-black text-green-700">${userBalance.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">المبلغ المطلوب:</span>
                <span className="font-bold text-red-600">${(finalTotal / 100).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 mt-2 border-t border-green-100">
                <span className="text-gray-800 font-bold">الرصيد المتبقي:</span>
                <span className={`text-xl font-black ${userBalance - (finalTotal / 100) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  ${(userBalance - (finalTotal / 100)).toFixed(2)}
                </span>
              </div>
              
              {userBalance >= (finalTotal / 100) ? (
                <p className="text-xs text-green-600 font-bold mt-3 text-center bg-green-100 py-1 rounded">سيتم خصم ${(finalTotal / 100).toFixed(2)} من محفظتك عند تأكيد الطلب.</p>
              ) : (
                <p className="text-xs text-red-600 font-bold mt-3 text-center bg-red-100 py-1 rounded">رصيدك غير كافٍ. <Link href="/wallet" className="underline">اشحن رصيدك هلق</Link></p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-black focus:ring-2 focus:ring-red-500 outline-none" placeholder="أدخل اسمك الثلاثي" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-black focus:ring-2 focus:ring-red-500 outline-none text-left" placeholder="مثال: 70123456" dir="ltr" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">العنوان بالتفصيل</label><textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg p-3 text-black focus:ring-2 focus:ring-red-500 outline-none" placeholder="المدينة، الشارع..."></textarea></div>
              <button type="submit" disabled={loading || userBalance < (finalTotal / 100)} className="w-full bg-red-600 text-white font-bold text-lg py-4 rounded-xl mt-4 hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                {loading ? "جاري تأكيد الطلب..." : userBalance < (finalTotal / 100) ? "الرصيد غير كافٍ" : `تأكيد الطلب - $${(finalTotal / 100).toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold mb-4 border-b pb-2 text-gray-900">ملخص الطلب</h2>
              <div className="max-h-60 overflow-y-auto mb-4">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <div className="flex flex-col"><span className="font-semibold text-gray-800">{item.name}</span><span className="text-gray-500">الكمية: {item.quantity}</span></div>
                    <span className="font-bold text-gray-800">${((item.price * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mb-4 pt-4 border-t">
                <label className="block text-sm font-bold text-gray-700 mb-2">كود الخصم</label>
                <div className="flex gap-2">
                  <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="أدخل الكود هنا" className="w-full border p-2 rounded text-black uppercase" />
                  <button type="button" onClick={handleApplyCoupon} disabled={checkingCoupon} className="bg-gray-800 text-white px-4 py-2 rounded font-bold hover:bg-gray-900 disabled:bg-gray-400">
                    {checkingCoupon ? "..." : "تطبيق"}
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                {appliedCoupon && <p className="text-green-600 text-xs mt-1 font-bold">تم تطبيق الكود: -${(appliedCoupon.discountAmount / 100).toFixed(2)}</p>}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-gray-800 font-semibold"><span>المجموع الفرعي</span><span>${(cartTotal / 100).toFixed(2)}</span></div>
                {appliedCoupon && <div className="flex justify-between text-green-600 font-bold"><span>الخصم</span><span>-${(appliedCoupon.discountAmount / 100).toFixed(2)}</span></div>}
                
                <div className="flex justify-between text-gray-800 font-semibold">
                  <span>الشحن</span>
                  <span>{totalShipping > 0 ? `$${(totalShipping / 100).toFixed(2)}` : "مجاني"}</span>
                </div>
                
                <div className="flex justify-between font-black text-xl text-red-600 mt-4 pt-4 border-t"><span>الإجمالي:</span><span>${(finalTotal / 100).toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all" dir="rtl">
            <div className="text-center mb-4 text-6xl">
              {modalType === 'error' ? '⚠️' : '✅'}
            </div>
            <h3 className="text-center text-xl font-bold text-gray-900 mb-2">
              {modalType === 'error' ? 'عذراً!' : 'نجاح!'}
            </h3>
            <p className="text-center text-gray-600 font-medium mb-6 leading-relaxed">
              {modalMessage}
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className={`w-full py-3 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 ${
                modalType === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'
              }`}
            >
              {modalType === 'error' ? 'تمام، فهمت' : 'يلا نكمل'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
