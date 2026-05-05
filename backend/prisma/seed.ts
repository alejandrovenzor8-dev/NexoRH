import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.upsert({
    where: { id: 'seed-company-acme' },
    update: {},
    create: {
      id: 'seed-company-acme',
      name: 'Acme Corp',
    },
  });

  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexorh.com' },
    update: {},
    create: {
      fullName: 'Admin User',
      email: 'admin@nexorh.com',
      passwordHash,
      role: 'ADMIN',
      companyId: company.id,
    },
  });

  console.log('Seed completed:', { company: company.name, admin: admin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
