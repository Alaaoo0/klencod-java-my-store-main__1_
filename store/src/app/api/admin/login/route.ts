import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD || "BossMan2026!";
  const cookieStore = await cookies();

  // 👇 فحص إذا الحساب مقفول
  const lockoutUntil = cookieStore.get('admin_lockout_until')?.value;
  if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
    const remainingMins = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 60000);
    return NextResponse.json({ message: `تم قفل الحساب بسبب المحاولات الخاطئة. يرجى المحاولة بعد ${remainingMins} دقيقة.` }, { status: 429 });
  }

  // 👇 إذا كلمة السر صح
  if (password === adminPassword) {
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // أسبوع
      path: '/',
    });
    // تصفير عداد المحاولات
    cookieStore.delete('admin_failed_attempts');
    cookieStore.delete('admin_lockout_until');
    return NextResponse.json({ success: true });
  } 
  
  // 👇 إذا كلمة السر غلط
  else {
    let attempts = parseInt(cookieStore.get('admin_failed_attempts')?.value || '0') + 1;
    
    // إذا وصل 5 محاولات
    if (attempts >= 5) {
      const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 دقيقة
      cookieStore.set('admin_lockout_until', lockoutTime.toString(), { maxAge: 15 * 60, path: '/' });
      cookieStore.set('admin_failed_attempts', '0', { maxAge: 15 * 60, path: '/' });
      return NextResponse.json({ message: 'لقد تجاوزت 5 محاولات. تم قفل الحساب لمدة 15 دقيقة لأسباب أمنية.' }, { status: 429 });
    }
    
    cookieStore.set('admin_failed_attempts', attempts.toString(), { maxAge: 60 * 60, path: '/' });
    return NextResponse.json({ message: `كلمة المرور خاطئة. لديك ${5 - attempts} محاولات متبقية.` }, { status: 401 });
  }
}
