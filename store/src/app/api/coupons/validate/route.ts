import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ message: 'كود الخصم غير صحيح أو معطل' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ message: 'كود الخصم منتهي الصلاحية' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ message: 'تم استنفاد هذا الكود' }, { status: 400 });
    }

    if (cartTotal < coupon.minOrderValue * 100) {
      return NextResponse.json({ message: `الحد الأدنى لاستخدام الكود هو $${coupon.minOrderValue}` }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = cartTotal * (coupon.value / 100);
    } else {
      discountAmount = coupon.value * 100; // FIXED (بالسنت)
    }

    if (discountAmount > cartTotal) discountAmount = cartTotal;

    return NextResponse.json({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount: Math.round(discountAmount),
    });
  } catch (error) {
    return NextResponse.json({ message: 'خطأ في التحقق من الكوبون' }, { status: 500 });
  }
}
