import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, userId?: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return notifications.map(notif => ({
      id: notif.id,
      type: notif.type,
      title: notif.title,
      body: notif.body,
      href: notif.href,
      read: notif.read,
      createdAt: notif.createdAt.toISOString(),
    }));
  }

  async markAsRead(id: string, companyId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, companyId },
    });

    if (!notification) {
      return null;
    }

    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead(companyId: string) {
    return this.prisma.notification.updateMany({
      where: { companyId, read: false },
      data: { read: true },
    });
  }
}
