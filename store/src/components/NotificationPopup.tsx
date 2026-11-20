"use client";
import { useState, useEffect } from "react";

export default function NotificationPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // منستنى 3 ثواني وبعدها منطلع النافذة (إذا ما كان مفعل من قبل)
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        const timer = setTimeout(() => setShowPopup(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const subscribe = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });

        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });
        setStatus("success");
        setTimeout(() => setShowPopup(false), 2000);
      } else {
        setShowPopup(false);
      }
    } catch (error) {
      setStatus("error");
    }
    setLoading(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 w-80 animate-fade-in-up" dir="rtl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔔</span>
          <h3 className="font-bold text-gray-900">لا تفوت العروض!</h3>
        </div>
        <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-black">✕</button>
      </div>
      
      {status === "success" ? (
        <p className="text-green-600 text-sm font-bold text-center py-2">تم تفعيل الإشعارات بنجاح! ✅</p>
      ) : status === "error" ? (
        <p className="text-red-500 text-sm text-center py-2">صار خطأ، جرب تاني.</p>
      ) : (
        <>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            فعّل الإشعارات عشان يوصلك كل جديد وعروض حصرية أول بأول.
          </p>
          <button
            onClick={subscribe}
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 text-sm"
          >
            {loading ? "جاري التفعيل..." : "نعم، فعّل الإشعارات"}
          </button>
        </>
      )}
    </div>
  );
}
