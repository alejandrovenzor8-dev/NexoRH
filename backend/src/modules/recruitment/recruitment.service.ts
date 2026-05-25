import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Injectable()
export class RecruitmentService {
  constructor(private prisma: PrismaService) {}

  async getCandidates(companyId: string) {
    const candidates = await this.prisma.candidate.findMany({
      where: { companyId },
      orderBy: { appliedAt: 'desc' },
    });

    return candidates.map(candidate => ({
      id: candidate.id,
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      avatar: candidate.avatar,
      position: candidate.position,
      source: candidate.source,
      stage: candidate.stage,
      priority: candidate.priority,
      score: candidate.score,
      rating: candidate.rating,
      tags: candidate.tags,
      recruiter: candidate.recruiter,
      notes: candidate.notes,
      cvUrl: candidate.cvUrl,
      linkedinUrl: candidate.linkedinUrl,
      appliedAt: candidate.appliedAt.toISOString(),
      updatedAt: candidate.updatedAt.toISOString(),
    }));
  }

  async getCandidate(id: string, companyId: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id, companyId },
    });

    if (!candidate) {
      return null;
    }

    return {
      id: candidate.id,
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      avatar: candidate.avatar,
      position: candidate.position,
      source: candidate.source,
      stage: candidate.stage,
      priority: candidate.priority,
      score: candidate.score,
      rating: candidate.rating,
      tags: candidate.tags,
      recruiter: candidate.recruiter,
      notes: candidate.notes,
      cvUrl: candidate.cvUrl,
      linkedinUrl: candidate.linkedinUrl,
      appliedAt: candidate.appliedAt.toISOString(),
      updatedAt: candidate.updatedAt.toISOString(),
    };
  }

  async createCandidate(dto: CreateCandidateDto, companyId: string) {
    const candidate = await this.prisma.candidate.create({
      data: {
        ...dto,
        companyId,
        stage: dto.stage || 'applied',
        priority: dto.priority || 'medium',
        avatar: dto.fullName
          ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${dto.fullName}`
          : undefined,
      },
    });

    return {
      id: candidate.id,
      fullName: candidate.fullName,
      email: candidate.email,
      position: candidate.position,
      source: candidate.source,
      stage: candidate.stage,
      appliedAt: candidate.appliedAt.toISOString(),
    };
  }

  async updateCandidate(id: string, data: Partial<CreateCandidateDto>, companyId: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id, companyId },
    });

    if (!candidate) {
      return null;
    }

    return this.prisma.candidate.update({
      where: { id },
      data,
    });
  }

  getStatus() {
    return {
      module: 'recruitment',
      status: 'active',
      message: 'The recruitment module is ready.',
    };
  }
}

