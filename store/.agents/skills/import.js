const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse/sync');

const prisma = new PrismaClient();

async function main() {
  // تأكد إنه اسم ملف الـ CSV هو products.csv
    const csvFile = fs.readFileSync('products.csv', 'utf8');
      const records = parse(csvFile, { columns: true, skip_empty_lines: true });

        console.log(`لقيت ${records.length} منتج. جاري الاستيراد...`);

          for (const row of records) {
              const name = row.name || row.Title || row.title;
                  const price = parseFloat(row.price || row.Price || 0) * 100;
                      const weight = parseInt(row.weight || row.Weight || 500);
                          const imageUrl = row.imageUrl || row.Image || row.image || '';
                              
                                  if (!name) continue;

                                      const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) + '-' + Math.floor(Math.random() * 10000);

                                          try {
                                                await prisma.product.create({
                                                        data: {
                                                                  name: name,
                                                                            slug: slug,
                                                                                      price: Math.round(price),
                                                                                                weight: weight,
                                                                                                          imageUrl: imageUrl,
                                                                                                                    description: row.description || row.Description || '',
                                                                                                                              stock: 10
                                                                                                                                      }
                                                                                                                                            });
                                                                                                                                                } catch (e) {
                                                                                                                                                      console.log(`فشل إضافة: ${name}`);
                                                                                                                                                          }
                                                                                                                                                            }
                                                                                                                                                              console.log('خلص الاستيراد بنجاح!');
                                                                                                                                                              }

                                                                                                                                                              main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());