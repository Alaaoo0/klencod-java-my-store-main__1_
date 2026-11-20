import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'يجب تسجيل الدخول' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order || order.userId !== userId) {
      return NextResponse.json({ message: 'غير مصرح لك' }, { status: 403 });
    }

    // بنغير حالة التأكيد بدل الحالة الأساسية
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { customerConfirmed: true, status: 'delivered' }, // بنغير الاتنين عشان تظبط
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ message: 'فشل تحديث الطلب' }, { status: 500 });
  }
}
