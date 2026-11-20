import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    return NextResponse.json({ message: 'فشل الحذف' }, { status: 500 });
  }
}
