import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
      // 👈 ضفنا phone هون
          const { name, email, password, phone } = await req.json();
              
                  if (!name || !email || !password) {
                        return NextResponse.json({ message: 'كل الحقول مطلوبة' }, { status: 400 });
                            }

                                const existingUser = await prisma.user.findUnique({ where: { email } });
                                    if (existingUser) {
                                          return NextResponse.json({ message: 'الإيميل مستعمل من قبل' }, { status: 400 });
                                              }

                                                  const hashedPassword = await bcrypt.hash(password, 10);
                                                      
                                                          // 👈 ضفنا phone هون كمان عشان ينحفظ بالداتابيز
                                                              await prisma.user.create({ 
                                                                    data: { 
                                                                            name, 
                                                                                    email, 
                                                                                            password: hashedPassword,
                                                                                                    phone: phone || null 
                                                                                                          } 
                                                                                                              });

                                                                                                                  return NextResponse.json({ message: 'تم إنشاء الحساب' }, { status: 201 });
                                                                                                                    } catch (error) {
                                                                                                                        return NextResponse.json({ message: 'فشل إنشاء الحساب' }, { status: 500 });
                                                                                                                          }
                                                                                                                          }