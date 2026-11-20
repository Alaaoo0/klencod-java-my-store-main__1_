"use client";
import { useState, useEffect } from "react";

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // 👇 حالات جديدة لرفع الصورة
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchReviews = () => {
    fetch(`/api/reviews?productId=${productId}`)
      .then(res => res.json())
      .then(data => { setReviews(data); setLoading(false); });
  };

  useEffect(() => { 
    fetchReviews(); 
    fetch("/api/check-admin")
      .then(res => res.json())
      .then(data => {
        if (data.isAdmin) setIsAdmin(true);
      })
      .catch(() => setIsAdmin(false));
  }, [productId]);

  // 👇 دالة رفع الصورة
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert("فشل رفع الصورة");
      }
    } catch (error) {
      alert("خطأ في الاتصال أثناء رفع الصورة");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment, imageUrl }), // 👈 بنبعت الصورة
    });
    setSubmitting(false);
    
    if (res.ok) {
      setComment("");
      setRating(5);
      setImageUrl(""); // تصفير الصورة
      fetchReviews();
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;
    
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchReviews();
    } else {
      alert("فشل حذف التقييم");
    }
  };

  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">التقييمات والمراجعات</h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3">أضف تقييمك</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-gray-700">التقييم:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
              ★
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="اكتب مراجعتك هنا (اختياري)..." className="w-full border p-3 rounded text-black mb-3" rows={2}></textarea>
        
        {/* 👇 خانة رفع الصورة */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">إرفاق صورة (اختياري)</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {uploading && <p className="text-blue-600 text-xs mt-1">جاري الرفع...</p>}
          {imageUrl && (
            <div className="mt-2 relative inline-block">
              <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded border shadow-sm" />
              <button type="button" onClick={() => setImageUrl("")} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" disabled={submitting || uploading} className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400">
          {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">جاري تحميل التقييمات...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="border-b pb-4 relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-gray-800">{rev.user?.name || "زائر"}</span>
                <span className="text-yellow-500">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                <span className="text-gray-400 text-xs mr-auto">{new Date(rev.createdAt).toLocaleDateString('ar-LB')}</span>
                
                {isAdmin && (
                  <button 
                    onClick={() => handleDeleteReview(rev.id)}
                    className="text-red-500 text-xs hover:text-red-700 bg-red-50 px-2 py-1 rounded"
                  >
                    حذف 🗑️
                  </button>
                )}
              </div>
              
              {rev.comment && <p className="text-gray-600 text-sm mb-2">{rev.comment}</p>}
              
              {rev.imageUrl && (
                <div className="mt-2">
                  <img src={rev.imageUrl} alt="Review" className="w-full max-w-[200px] object-cover rounded-lg border shadow-sm" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
