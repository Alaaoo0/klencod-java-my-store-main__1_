import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parse } from 'csv-parse/sync';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ message: 'ما في ملف مرفوع' }, { status: 400 });
    }

    const text = await file.text();
    // بنقرأ الملف وبنفهم الأعمدة
    const records = parse(text, { columns: true, skip_empty_lines: true }) as any[];

    let count = 0;
    for (const row of records) {
      const name = row.name || row.Title || row.title || row['اسم المنتج'];
      const priceString = row.price || row.Price || row['السعر'] || '0';
      const cleanPrice = parseFloat(String(priceString).replace(/[^0-9.]/g, '')) * 100;
      const weight = parseInt(row.weight || row.Weight || row['الوزن'] || 500);
      const imageUrl = row.imageUrl || row.Image || row.image || row['الصورة'] || '';
      const category = row.category || row.Category || row['القسم'] || 'أجهزة الكترونية';
      
      if (!name || !cleanPrice) continue;

      const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) + '-' + Math.floor(Math.random() * 10000);

      try {
        await prisma.product.create({
          data: {
            name: name,
            slug: slug,
            price: Math.round(cleanPrice),
            weight: weight,
            imageUrl: imageUrl,
            description: row.description || row.Description || '',
            category: category,
            stock: parseInt(row.stock || '10'),
          }
        });
        count++;
      } catch (e) {
        console.error("Failed to add:", name);
      }
    }

    return NextResponse.json({ message: `تم استيراد ${count} منتج بنجاح!` });
  } catch (error: any) {
    console.error("IMPORT ERROR:", error);
    return NextResponse.json({ message: 'فشل الاستيراد، تأكد من صيغة الملف' }, { status: 500 });
  }
}
