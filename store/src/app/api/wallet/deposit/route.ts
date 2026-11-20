import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;

    if (!userId) return NextResponse.json({ message: 'يجب تسجيل الدخول' }, { status: 401 });
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ message: 'المبلغ غير صالح' }, { status: 400 });
    }

    await prisma.walletTransaction.create({
      data: {
        userId,
        amount: parsedAmount,
        type: 'DEPOSIT',
        status: 'PENDING',
      },
    });

    return NextResponse.json({ message: 'تم إرسال طلب الشحن، بانتظار موافقة الإدارة' });
  } catch (error) {
    return NextResponse.json({ message: 'فشل طلب الشحن' }, { status: 500 });
  }
}
