import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes (excepto company y admin)
  await prisma.interview.deleteMany({});
  await prisma.candidate.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.permission.deleteMany({});

  // Crear company
  const company = await prisma.company.upsert({
    where: { id: 'seed-company-acme' },
    update: {},
    create: {
      id: 'seed-company-acme',
      name: 'Acme Corp',
    },
  });

  const passwordHash = await bcrypt.hash('admin123', 10);

  // Crear usuarios
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexorh.com' },
    update: { department: 'Administración' },
    create: {
      fullName: 'Admin User',
      email: 'admin@nexorh.com',
      passwordHash,
      role: 'ADMIN',
      department: 'Administración',
      phone: '+52 55 1234 5678',
      companyId: company.id,
    },
  });

  const manager1 = await prisma.user.upsert({
    where: { email: 'ana.martinez@nexorh.com' },
    update: { department: 'Recursos Humanos' },
    create: {
      fullName: 'Ana Martínez',
      email: 'ana.martinez@nexorh.com',
      passwordHash,
      role: 'MANAGER',
      department: 'Recursos Humanos',
      phone: '+52 55 2345 6789',
      status: 'active',
      companyId: company.id,
    },
  });

  const manager2 = await prisma.user.upsert({
    where: { email: 'carlos.rodriguez@nexorh.com' },
    update: { department: 'Tecnología' },
    create: {
      fullName: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@nexorh.com',
      passwordHash,
      role: 'MANAGER',
      department: 'Tecnología',
      phone: '+52 55 3456 7890',
      status: 'active',
      companyId: company.id,
    },
  });

  const employees = [
    { fullName: 'María García', email: 'maria.garcia@nexorh.com', department: 'Tecnología', phone: '+52 55 4567 8901' },
    { fullName: 'Juan López', email: 'juan.lopez@nexorh.com', department: 'Ventas', phone: '+52 55 5678 9012' },
    { fullName: 'Laura Sánchez', email: 'laura.sanchez@nexorh.com', department: 'Marketing', phone: '+52 55 6789 0123' },
    { fullName: 'Pedro Ramírez', email: 'pedro.ramirez@nexorh.com', department: 'Tecnología', phone: '+52 55 7890 1234' },
    { fullName: 'Sofia Fernández', email: 'sofia.fernandez@nexorh.com', department: 'Recursos Humanos', phone: '+52 55 8901 2345' },
    { fullName: 'Diego Torres', email: 'diego.torres@nexorh.com', department: 'Operaciones', phone: '+52 55 9012 3456' },
    { fullName: 'Valentina Ruiz', email: 'valentina.ruiz@nexorh.com', department: 'Finanzas', phone: '+52 55 0123 4567' },
    { fullName: 'Luis Morales', email: 'luis.morales@nexorh.com', department: 'Tecnología', phone: '+52 55 1234 5679' },
    { fullName: 'Carmen Ortiz', email: 'carmen.ortiz@nexorh.com', department: 'Ventas', phone: '+52 55 2345 6780' },
    { fullName: 'Roberto Castro', email: 'roberto.castro@nexorh.com', department: 'Marketing', phone: '+52 55 3456 7891' },
  ];

  const createdEmployees = [];
  for (const emp of employees) {
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: { department: emp.department },
      create: {
        ...emp,
        passwordHash,
        role: 'USER',
        status: 'active',
        companyId: company.id,
      },
    });
    createdEmployees.push(user);
  }

  // Crear permisos
  const permissionTypes = ['Vacaciones', 'Permiso personal', 'Incapacidad', 'Home office'];
  const statuses = ['pending', 'approved', 'rejected'];
  
  for (let i = 0; i < 10; i++) {
    const user = createdEmployees[i % createdEmployees.length];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + (i * 5) - 20);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (i % 3) + 1);

    await prisma.permission.create({
      data: {
        userId: user.id,
        companyId: company.id,
        type: permissionTypes[i % permissionTypes.length],
        startDate,
        endDate,
        status: statuses[i % statuses.length],
        reason: `Motivo de solicitud ${i + 1}`,
        manager: i % 2 === 0 ? manager1.fullName : manager2.fullName,
        comments: i % 3 === 0 ? 'Aprobado por gerencia' : null,
      },
    });
  }

  // Crear notificaciones
  const notificationTypes = ['NEW_REQUEST', 'REQUEST_APPROVED', 'REQUEST_REJECTED', 'NEW_MESSAGE', 'RECRUITMENT'];
  
  for (let i = 0; i < 8; i++) {
    const minutesAgo = (i + 1) * 30;
    const createdAt = new Date(Date.now() - minutesAgo * 60 * 1000);

    await prisma.notification.create({
      data: {
        companyId: company.id,
        userId: i % 2 === 0 ? admin.id : null,
        type: notificationTypes[i % notificationTypes.length],
        title: `Notificación ${i + 1}`,
        body: `Descripción de la notificación ${i + 1}`,
        href: i % 3 === 0 ? '/permissions' : '/dashboard',
        read: i % 3 === 0,
        createdAt,
      },
    });
  }

  // Crear candidatos
  const candidates = [
    {
      fullName: 'María González',
      email: 'maria.gonzalez@example.com',
      phone: '+52 55 1111 2222',
      position: 'Senior Frontend Developer',
      source: 'linkedin',
      stage: 'applied',
      priority: 'high',
      score: 8.5,
      rating: 4,
      tags: ['React', 'TypeScript', 'Remote'],
      recruiter: 'Ana Martínez',
      linkedinUrl: 'https://linkedin.com/in/mariagonzalez',
    },
    {
      fullName: 'Carlos Mendoza',
      email: 'carlos.mendoza@example.com',
      phone: '+52 55 2222 3333',
      position: 'Backend Engineer',
      source: 'indeed',
      stage: 'screening',
      priority: 'medium',
      score: 7.2,
      rating: 3,
      tags: ['Node.js', 'MongoDB', 'Docker'],
      recruiter: 'Carlos Rodríguez',
    },
    {
      fullName: 'Laura Jiménez',
      email: 'laura.jimenez@example.com',
      position: 'Senior Frontend Developer',
      source: 'linkedin',
      stage: 'interview',
      priority: 'high',
      score: 9.0,
      rating: 5,
      tags: ['React', 'Next.js', 'Leadership'],
      recruiter: 'Ana Martínez',
      linkedinUrl: 'https://linkedin.com/in/laurajimenez',
    },
    {
      fullName: 'Miguel Herrera',
      email: 'miguel.herrera@example.com',
      phone: '+52 55 3333 4444',
      position: 'DevOps Engineer',
      source: 'referral',
      stage: 'applied',
      priority: 'medium',
      score: 7.8,
      rating: 4,
      tags: ['AWS', 'Kubernetes', 'CI/CD'],
      recruiter: 'Carlos Rodríguez',
    },
    {
      fullName: 'Patricia Vega',
      email: 'patricia.vega@example.com',
      position: 'UX Designer',
      source: 'website',
      stage: 'offer',
      priority: 'high',
      score: 8.8,
      rating: 5,
      tags: ['Figma', 'User Research', 'Prototyping'],
      recruiter: 'Ana Martínez',
    },
    {
      fullName: 'Andrés Silva',
      email: 'andres.silva@example.com',
      phone: '+52 55 4444 5555',
      position: 'Backend Engineer',
      source: 'linkedin',
      stage: 'rejected',
      priority: 'low',
      score: 5.5,
      rating: 2,
      tags: ['Python', 'Django'],
      recruiter: 'Carlos Rodríguez',
      notes: 'No cumplió con requisitos técnicos',
    },
  ];

  for (const candidate of candidates) {
    const daysAgo = Math.floor(Math.random() * 14) + 1;
    const appliedAt = new Date();
    appliedAt.setDate(appliedAt.getDate() - daysAgo);

    await prisma.candidate.create({
      data: {
        ...candidate,
        companyId: company.id,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.fullName}`,
        appliedAt,
      },
    });
  }

  console.log('Seed completed:', {
    company: company.name,
    admin: admin.email,
    users: createdEmployees.length + 3,
    permissions: 10,
    notifications: 8,
    candidates: candidates.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
