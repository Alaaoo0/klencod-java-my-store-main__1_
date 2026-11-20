import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ message: 'فشل جلب الكوبونات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, type, value, minOrderValue, maxUses, expiresAt } = body;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: parseFloat(value),
        minOrderValue: parseFloat(minOrderValue) || 0,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    return NextResponse.json(coupon);
  } catch (error) {
    return NextResponse.json({ message: 'فشل إضافة الكوبون' }, { status: 500 });
  }
}
