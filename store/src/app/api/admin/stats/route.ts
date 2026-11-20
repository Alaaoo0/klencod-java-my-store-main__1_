import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orderStats = await prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
    });

    const productCount = await prisma.product.count();

    // هون جبنا كل الطلبات عشان صفحة الإدارة
    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      totalSales: orderStats._sum.total || 0,
      totalOrders: orderStats._count || 0,
      totalProducts: productCount,
      recentOrders: allOrders, // رح نعرضهن كلهم
    });
  } catch (error) {
    return NextResponse.json({ message: 'فشل جلب الإحصائيات' }, { status: 500 });
  }
}
