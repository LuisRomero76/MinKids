import { Module } from '@nestjs/common';
import { ChildLocationService } from './child-location.service';
import { ChildLocationController } from './child-location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildLocationLog } from './entities/child-location-log.entity';
import { ParentChildrenModule } from 'src/parent-children/parent-children.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChildLocationLog]),
    ParentChildrenModule
  ],
  controllers: [ChildLocationController],
  providers: [ChildLocationService],
  exports: [ChildLocationService]
})
export class ChildLocationModule {}
