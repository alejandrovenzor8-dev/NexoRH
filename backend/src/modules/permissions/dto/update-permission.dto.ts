import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'cancelled'])
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comments?: string;
}
