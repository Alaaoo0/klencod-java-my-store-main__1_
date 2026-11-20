import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // مسح كل الطلبات
    await prisma.order.deleteMany({});
    
    // تصفير الكوبونات
    await prisma.coupon.updateMany({
      data: { usedCount: 0 },
    });

    return NextResponse.json({ message: 'تم مسح الإحصائيات بنجاح' });
  } catch (error) {
    console.error("Reset Error:", error);
    return NextResponse.json({ message: 'فشل مسح الإحصائيات' }, { status: 500 });
  }
}
