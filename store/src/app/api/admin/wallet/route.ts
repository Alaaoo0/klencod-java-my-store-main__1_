import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
      const cookieStore = await cookies();
          const isAdmin = cookieStore.get('admin_session')?.value === 'true';
              if (!isAdmin) return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });

                  const transactions = await prisma.walletTransaction.findMany({
                        where: { status: 'PENDING' },
                              include: { 
                                      user: { 
                                                select: { name: true, email: true, phone: true } // 👈 ضفنا phone
                                                        } 
                                                              },
                                                                    orderBy: { createdAt: 'desc' },
                                                                        });
                                                                            return NextResponse.json(transactions);
                                                                              } catch (error) {
                                                                                  return NextResponse.json({ message: 'فشل جلب الطلبات' }, { status: 500 });
                                                                                    }
                                                                                    }