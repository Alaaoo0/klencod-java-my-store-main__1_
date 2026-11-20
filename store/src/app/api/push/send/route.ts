import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as webpush from 'web-push'; // هون السر: غيرنا طريقة الاستدعاء

export async function POST(req: Request) {
  try {
      const { title, body, url } = await req.json();
          
              // حطينا إعدادات المفاتيح هون جوا عشان ما تنهار وقت البناء
                  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                      const privateKey = process.env.VAPID_PRIVATE_KEY;
                          const subject = process.env.VAPID_SUBJECT || 'mailto:info@aliboss.com';

                              if (!publicKey || !privateKey) {
                                    return NextResponse.json({ message: 'مفاتيح VAPID ناقصة' }, { status: 500 });
                                        }

                                            webpush.setVapidDetails(subject, publicKey, privateKey);

                                                const subscriptions = await prisma.pushSubscription.findMany();
                                                    const payload = JSON.stringify({ title, body, url });

                                                        const sendPromises = subscriptions.map((sub) =>
                                                              webpush.sendNotification(
                                                                      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                                                                              payload
                                                                                    ).catch(async (err: any) => {
                                                                                            if (err.statusCode === 410 || err.statusCode === 404) {
                                                                                                      // إذا الزبون حذف التطبيق، منمسح اشتراكه
                                                                                                                await prisma.pushSubscription.delete({ where: { id: sub.id } });
                                                                                                                        }
                                                                                                                              })
                                                                                                                                  );

                                                                                                                                      await Promise.all(sendPromises);
                                                                                                                                          return NextResponse.json({ message: `تم إرسال الإشعار لـ ${subscriptions.length} زبون` });
                                                                                                                                            } catch (error) {
                                                                                                                                                console.error("PUSH SEND ERROR:", error);
                                                                                                                                                    return NextResponse.json({ message: 'فشل إرسال الإشعار' }, { status: 500 });
                                                                                                                                                      }
                                                                                                                                                      }