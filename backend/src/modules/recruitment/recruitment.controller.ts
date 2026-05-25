import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecruitmentService } from './recruitment.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';

@ApiTags('recruitment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Get('status')
  @ApiOperation({ summary: 'Recruitment module status' })
  getStatus() {
    return this.recruitmentService.getStatus();
  }

  @Get('candidates')
  @ApiOperation({ summary: 'Get all candidates' })
  getCandidates(@CurrentUser() user: AuthenticatedUser) {
    return this.recruitmentService.getCandidates(user.companyId);
  }

  @Get('candidates/:id')
  @ApiOperation({ summary: 'Get candidate by ID' })
  getCandidate(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.recruitmentService.getCandidate(id, user.companyId);
  }

  @Post('candidates')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create new candidate' })
  createCandidate(
    @Body() dto: CreateCandidateDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.recruitmentService.createCandidate(dto, user.companyId);
  }

  @Patch('candidates/:id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update candidate' })
  updateCandidate(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCandidateDto>,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.recruitmentService.updateCandidate(id, dto, user.companyId);
  }
}

