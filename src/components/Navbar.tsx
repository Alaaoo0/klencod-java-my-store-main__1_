"use client";
import Link from "next/link";
import { useCart } from "../app/context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ siteName }: { siteName: string }) {
  const { cart = [] } = useCart() || {};
  const { wishlist = [] } = useWishlist() || {};
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"error" | "success">("error");

  const showModal = (message: string, type: "error" | "success" = "error") => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  useEffect(() => {
    setMounted(true);
    
    fetch("/api/auth/me", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));

    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));

    if (document.cookie.includes('admin_session=true')) {
      setIsAdmin(true);
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch((err) => console.error('Service Worker Error:', err));
    }
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const delayDebounceFn = setTimeout(() => {
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => {
            setSuggestions(data);
            setShowSuggestions(true);
          });
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      showModal('متصفحك ما بيدعم الإشعارات.', "error");
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      showModal('مفتاح VAPID العام مش موجود بالإعدادات.', "error");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        showModal('لازم تسمح بالإشعارات من إعدادات المتصفح.', "error");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      });

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      if (!res.ok) throw new Error('السيرفر ما قدر يحفظ الاشتراك');

      showModal('تم تفعيل الإشعارات بنجاح! 🔔', "success");
    } catch (error: any) {
      showModal('صار خطأ: ' + (error.message || 'خطأ غير معروف'), "error");
    }
  };

  const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
  const totalWishlist = wishlist.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null); 
    window.location.href = "/"; 
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200 flex flex-col">
        
        <div className="max-w-7xl mx-auto w-full px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter block cursor-pointer transition-transform duration-300 hover:scale-105">
            {siteName}
          </Link>
          
          <div className="flex-1 max-w-xl relative">
            <form onSubmit={handleSearch} className="flex">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="ابحث عن منتج..." 
                className="w-full border-2 border-red-600 rounded-l-full px-4 py-2 outline-none text-black text-sm" 
              />
              <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-r-full font-bold hover:bg-red-700 transition-colors">بحث</button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((item) => (
                  <li key={item.id}>
                    <Link 
                      href={`/product?slug=${item.slug}`}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 border-b last:border-0"
                      onClick={() => setShowSuggestions(false)}
                    >
                      {item.imageUrl && <img src={item.imageUrl} className="w-8 h-8 rounded object-cover" />}
                      <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-4">
            
            {/* ✅ زر الأدمن هنا - بيظهر بس للأدمن */}
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors font-bold text-sm" title="لوحة التحكم">
                <span>⚙️</span> الإدارة
              </Link>
            )}

            <button onClick={subscribeToPush} className="text-gray-700 hover:text-red-600 transition-colors relative" title="تفعيل الإشعارات">
              <span className="text-2xl">🔔</span>
            </button>
            <Link href="/wishlist" className="relative flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors">
              <span className="text-2xl">❤️</span>
              {mounted && totalWishlist > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{totalWishlist}</span>}
            </Link>
            <Link href="/cart" className="relative flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors">
              <span className="text-2xl">🛒</span>
              {mounted && totalItems > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{totalItems}</span>}
            </Link>

            <div className="border-r pr-4 mr-2 flex items-center gap-3">
              {mounted && user ? (
                <div className="flex items-center gap-3">
                  <Link href="/orders" className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors hidden sm:block">طلباتي</Link>
                  <Link href="/profile" className="text-sm font-bold text-gray-800 hover:text-red-600 transition-colors hidden sm:block">أهلاً، {user.name}</Link>
                  <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-600 transition-colors">خروج</button>
                </div>
              ) : (
                <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-red-600 flex items-center gap-1">
                  <span className="text-xl">👤</span> دخول
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center items-center gap-8">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 font-bold text-gray-800 hover:text-red-600 transition-colors"
            >
              <span className="text-xl">☰</span> المتجر
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-gray-800 hover:text-red-600 transition-colors"
            >
              <span className="text-xl">🏠</span> الصفحة الرئيسية
            </Link>
          </div>
        </div>

        {isMenuOpen && (
          <div className="bg-white border-t border-gray-200 shadow-lg absolute top-full left-0 w-full z-50">
            <div className="max-w-7xl mx-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 bg-gray-50 rounded-lg text-center font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-100"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

      </header>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6" dir="rtl">
            <div className="text-center mb-4 text-5xl">
              {modalType === 'error' ? '⚠️' : '✅'}
            </div>
            <p className="text-center text-lg font-bold text-gray-800 mb-6">{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-colors ${
                modalType === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
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
