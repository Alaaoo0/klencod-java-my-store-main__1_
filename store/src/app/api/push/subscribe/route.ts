import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await prisma.pushSubscription.upsert({
      where: { endpoint: body.endpoint },
      update: {},
      create: {
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
    });
    return NextResponse.json({ message: 'تم الاشتراك' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'فشل الاشتراك' }, { status: 500 });
  }
}
