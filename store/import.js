const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse/sync');

const prisma = new PrismaClient();

async function main() {
  const csvFile = fs.readFileSync('products.csv', 'utf8');
    const records = parse(csvFile, { columns: true, skip_empty_lines: true });

      console.log(`لقيت ${records.length} منتجات. جاري الاستيراد...`);

        for (const row of records) {
            if (!row.name || !row.price) {
                  console.log(`تخطي سطر ناقص`);
                        continue;
                            }

                                const price = parseFloat(row.price) * 100;
                                    const slug = row.name.replace(/[^a-zA-Z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

                                        try {
                                              await prisma.product.create({
                                                      data: {
                                                                name: row.name,
                                                                          slug: slug,
                                                                                    price: Math.round(price),
                                                                                              weight: parseInt(row.weight) || 500,
                                                                                                        imageUrl: row.imageUrl || '',
                                                                                                                  description: '',
                                                                                                                            stock: 10
                                                                                                                                    }
                                                                                                                                          });
                                                                                                                                                console.log(`✅ تم إضافة: ${row.name}`);
                                                                                                                                                    } catch (e) {
                                                                                                                                                          console.error(`❌ فشل: ${row.name} | السبب: ${e.message}`);
                                                                                                                                                              }
                                                                                                                                                                }
                                                                                                                                                                  console.log('خلص الاستيراد بنجاح!');
                                                                                                                                                                  }

                                                                                                                                                                  main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());