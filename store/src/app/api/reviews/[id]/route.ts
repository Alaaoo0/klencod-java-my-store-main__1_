import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    if (!isAdmin) {
      return NextResponse.json({ message: 'غير مصرح لك بالحذف' }, { status: 401 });
    }

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: 'تم حذف التقييم بنجاح' });
  } catch (error) {
    return NextResponse.json({ message: 'فشل حذف التقييم' }, { status: 500 });
  }
}
