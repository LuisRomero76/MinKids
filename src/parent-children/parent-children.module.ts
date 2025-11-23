import { Module } from '@nestjs/common';
import { ParentChildrenService } from './parent-children.service';
import { ParentChildrenController } from './parent-children.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentChild } from './entities/parent-child.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParentChild]),
    UserModule
  ],
  controllers: [ParentChildrenController],
  providers: [ParentChildrenService],
  exports: [ParentChildrenService]
})
export class ParentChildrenModule {}
