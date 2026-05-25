import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { TablesModule } from './modules/tables/tables.module';
import { RecruitmentModule } from './modules/recruitment/recruitment.module';
import { AutomationModule } from './modules/automation/automation.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    PermissionsModule,
    NotificationsModule,
    MessagingModule,
    TablesModule,
    RecruitmentModule,
    AutomationModule,
  ],
})
export class AppModule {}
