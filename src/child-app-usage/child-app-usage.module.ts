import { Module } from '@nestjs/common';
import { ChildAppUsageService } from './child-app-usage.service';
import { ChildAppUsageController } from './child-app-usage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildAppUsageLog } from './entities/usage-time.entity';
import { ParentChildrenModule } from 'src/parent-children/parent-children.module';
import { ApplicationsModule } from 'src/applications/applications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChildAppUsageLog]),
    ParentChildrenModule,
    ApplicationsModule
  ],
  controllers: [ChildAppUsageController],
  providers: [ChildAppUsageService],
  exports: [ChildAppUsageService]
})
export class ChildAppUsageModule {}
