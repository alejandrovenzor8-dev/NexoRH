import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const company = await this.prisma.company.create({
      data: { name: dto.companyName },
    });

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        passwordHash,
        phone: dto.phone,
        role: 'ADMIN',
        companyId: company.id,
      },
    });

    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: this.sanitizeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: this.sanitizeUser(user),
    };
  }

  private generateToken(user: { id: string; email: string; role: string; companyId: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: {
    id: string;
    fullName: string;
    email: string;
    passwordHash: string;
    phone: string | null;
    role: string;
    status: string;
    companyId: string;
    createdAt: Date;
  }) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
