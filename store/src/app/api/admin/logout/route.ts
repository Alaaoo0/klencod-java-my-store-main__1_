import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // مسح كوكي الأدمن
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // تاريخ انتهاء بالماضي عشان يمسحها فوراً
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'فشل تسجيل الخروج' }, { status: 500 });
  }
}
