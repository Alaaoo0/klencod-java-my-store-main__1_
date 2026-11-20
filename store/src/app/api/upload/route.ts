import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
      const formData = await req.formData();
          const file = formData.get('file') as File;
              
                  if (!file) {
                        return NextResponse.json({ message: 'ما في ملف مرفوع' }, { status: 400 });
                            }

                                const fileExt = file.name.split('.').pop();
                                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                                        
                                            const { data, error } = await supabase.storage
                                                  .from('products')
                                                        .upload(fileName, file);

                                                            if (error) throw error;

                                                                const { data: { publicUrl } } = supabase.storage
                                                                      .from('products')
                                                                            .getPublicUrl(fileName);

                                                                                return NextResponse.json({ url: publicUrl });
                                                                                  } catch (error: any) {
                                                                                      console.error("UPLOAD ERROR:", error.message);
                                                                                          return NextResponse.json({ message: 'فشل رفع الملف' }, { status: 500 });
                                                                                            }
                                                                                            }