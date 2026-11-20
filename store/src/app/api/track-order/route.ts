import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    if (!orderId) return NextResponse.json({ message: 'رقم الطلب مطلوب' }, { status: 400 });

    // بندور على الطلب، بغض النظر عن حالة الأحرف (كبير أو صغير)
    const order = await prisma.order.findFirst({
      where: { 
        id: {
          endsWith: orderId, // بيدور على آخر 6 أحرف عشان نسهل عالزبون
          mode: 'insensitive'
        }
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ message: 'ما لقينا طلب بهالرقم، تأكد من الرقم.' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: 'فشل جلب تفاصيل الطلب' }, { status: 500 });
  }
}
