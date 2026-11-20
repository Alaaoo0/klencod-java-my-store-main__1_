import { Suspense } from "react";
import EditForm from "./EditForm";

// هالسطر بيمنع Next.js من عمل كاش للصفحة وبيحل الخطأ الأحمر
export const instant = false;

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
    
      return (
          <Suspense fallback={<p className="text-center mt-20 text-black">جاري تحميل البيانات...</p>}>
                <EditForm id={id} />
                    </Suspense>
                      );
                      }