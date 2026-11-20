import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';
    if (!isAdmin) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });

    const { id } = await params;
    const { action } = await req.json(); // "APPROVE" or "REJECT"

    const transaction = await prisma.walletTransaction.findUnique({ where: { id } });
    if (!transaction || transaction.status !== 'PENDING') {
      return NextResponse.json({ message: 'العملية غير موجودة أو تمت معالجتها' }, { status: 400 });
    }

    if (action === 'APPROVE') {
      // ✅ إضافة الرصيد للمستخدم
      await prisma.$transaction([
        prisma.user.update({
          where: { id: transaction.userId },
          data: { walletBalance: { increment: transaction.amount } },
        }),
        prisma.walletTransaction.update({
          where: { id },
          data: { status: 'APPROVED' },
        }),
      ]);
      return NextResponse.json({ message: 'تمت الموافقة وإضافة الرصيد' });
    } else {
      await prisma.walletTransaction.update({
        where: { id },
        data: { status: 'REJECTED' },
      });
      return NextResponse.json({ message: 'تم رفض الطلب' });
    }
  } catch (error) {
    return NextResponse.json({ message: 'فشل معالجة الطلب' }, { status: 500 });
  }
}
