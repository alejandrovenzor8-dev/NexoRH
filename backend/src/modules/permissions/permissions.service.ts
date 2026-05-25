import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, userId?: string, role?: string) {
    const where: any = { companyId };
    
    // Users can only see their own permissions, managers/admins see all
    if (role === 'USER' && userId) {
      where.userId = userId;
    }

    const permissions = await this.prisma.permission.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return permissions.map(permission => ({
      id: permission.id,
      employeeId: permission.user.id,
      employeeName: permission.user.fullName,
      employeeEmail: permission.user.email,
      department: permission.user.department || 'Sin departamento',
      type: permission.type,
      startDate: permission.startDate.toISOString().split('T')[0],
      endDate: permission.endDate.toISOString().split('T')[0],
      duration: Math.ceil((permission.endDate.getTime() - permission.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      status: permission.status,
      manager: permission.manager || 'Sin asignar',
      reason: permission.reason || '',
      comments: permission.comments ? [permission.comments] : [],
      updatedAt: permission.updatedAt.toISOString(),
      createdAt: permission.createdAt.toISOString(),
    }));
  }

  async findOne(id: string, companyId: string, userId: string, role: string) {
    const permission = await this.prisma.permission.findFirst({
      where: { id, companyId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            department: true,
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    // Users can only see their own permissions
    if (role === 'USER' && permission.userId !== userId) {
      throw new ForbiddenException('You can only view your own permissions');
    }

    return {
      id: permission.id,
      employeeId: permission.user.id,
      employeeName: permission.user.fullName,
      employeeEmail: permission.user.email,
      department: permission.user.department || 'Sin departamento',
      type: permission.type,
      startDate: permission.startDate.toISOString().split('T')[0],
      endDate: permission.endDate.toISOString().split('T')[0],
      duration: Math.ceil((permission.endDate.getTime() - permission.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      status: permission.status,
      manager: permission.manager || 'Sin asignar',
      reason: permission.reason || '',
      comments: permission.comments ? [permission.comments] : [],
      updatedAt: permission.updatedAt.toISOString(),
      createdAt: permission.createdAt.toISOString(),
    };
  }

  async create(dto: CreatePermissionDto, userId: string, companyId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, companyId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const permission = await this.prisma.permission.create({
      data: {
        userId,
        companyId,
        type: dto.type,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            department: true,
          },
        },
      },
    });

    return {
      id: permission.id,
      employeeId: permission.user.id,
      employeeName: permission.user.fullName,
      employeeEmail: permission.user.email,
      department: permission.user.department || 'Sin departamento',
      type: permission.type,
      startDate: permission.startDate.toISOString().split('T')[0],
      endDate: permission.endDate.toISOString().split('T')[0],
      status: permission.status,
      reason: permission.reason || '',
    };
  }

  async update(id: string, dto: UpdatePermissionDto, companyId: string, managerId: string) {
    const permission = await this.prisma.permission.findFirst({
      where: { id, companyId },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const manager = await this.prisma.user.findFirst({
      where: { id: managerId, companyId },
      select: { fullName: true },
    });

    const updated = await this.prisma.permission.update({
      where: { id },
      data: {
        status: dto.status,
        comments: dto.comments,
        manager: manager?.fullName || 'Sistema',
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            department: true,
          },
        },
      },
    });

    return {
      id: updated.id,
      employeeId: updated.user.id,
      employeeName: updated.user.fullName,
      employeeEmail: updated.user.email,
      department: updated.user.department || 'Sin departamento',
      type: updated.type,
      startDate: updated.startDate.toISOString().split('T')[0],
      endDate: updated.endDate.toISOString().split('T')[0],
      status: updated.status,
      manager: updated.manager || 'Sin asignar',
      reason: updated.reason || '',
      comments: updated.comments ? [updated.comments] : [],
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}
