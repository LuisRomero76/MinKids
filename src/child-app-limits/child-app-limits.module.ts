import { Module } from '@nestjs/common';
import { ChildAppLimitsService } from './child-app-limits.service';
import { ChildAppLimitsController } from './child-app-limits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildAppLimit } from './entities/application-limit.entity';
import { ParentChildrenModule } from 'src/parent-children/parent-children.module';
import { ApplicationsModule } from 'src/applications/applications.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChildAppLimit]),
    ParentChildrenModule,
    ApplicationsModule,
    UserModule
  ],
  controllers: [ChildAppLimitsController],
  providers: [ChildAppLimitsService],
  exports: [ChildAppLimitsService]
})
export class ChildAppLimitsModule {}
