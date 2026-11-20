import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;
    
    if (!userId) {
      return NextResponse.json({ message: 'يجب تسجيل الدخول' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { 
        items: { 
          include: { product: true } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: 'فشل جلب الطلبات' }, { status: 500 });
  }
}
