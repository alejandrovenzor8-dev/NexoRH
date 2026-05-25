import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';

@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all permissions' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.permissionsService.findAll(user.companyId, user.userId, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a permission by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.permissionsService.findOne(id, user.companyId, user.userId, user.role);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new permission request' })
  async create(
    @Body() dto: CreatePermissionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.permissionsService.create(dto, user.userId, user.companyId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update permission status (ADMIN/MANAGER only)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.permissionsService.update(id, dto, user.companyId, user.userId);
  }
}
