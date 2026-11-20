import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    if (!productId) return NextResponse.json([]);

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ message: 'فشل جلب التقييمات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 👇 ضفنا imageUrl هون
    const { productId, rating, comment, imageUrl } = await req.json();
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'يجب تسجيل الدخول أولاً' }, { status: 401 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        rating: parseInt(rating),
        comment,
        imageUrl, // 👈 بنحفظ رابط الصورة
        userId
      },
    });
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ message: 'فشل إضافة التقييم' }, { status: 500 });
  }
}
