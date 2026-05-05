import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findMe(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { users: { select: { id: true, fullName: true, email: true, role: true } } },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }
}
