import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    return NextResponse.json({ message: 'فشل الحذف' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ message: 'ما لقيت المنتج' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'خطأ بالسيرفر' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    // 👇 ضفنا variants هون
    const { name, price, stock, imageUrl, weight, variants } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: Math.round(price * 100),
        stock: parseInt(stock),
        weight: parseInt(weight),
        imageUrl,
        variants: variants || null, // 👈 وضفناها هون بالداتا
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'فشل التعديل' }, { status: 500 });
  }
}