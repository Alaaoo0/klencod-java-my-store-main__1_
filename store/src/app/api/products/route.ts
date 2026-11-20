import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: 'فشل جلب المنتجات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, stock, imageUrl, weight, category, description, variants } = body;
    
    const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-') + '-' + Date.now();

    const product = await prisma.product.create({
      data: {
        name, slug,
        price: Math.round(price * 100),
        stock: parseInt(stock),
        weight: parseInt(weight) || 500,
        imageUrl,
        category: category || "أجهزة الكترونية",
        description: description || "",
        variants: variants || null
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'فشل الإضافة' }, { status: 500 });
  }
}