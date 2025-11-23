import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ParentChildrenService } from './parent-children.service';
import { AddChildDto } from './dto/add-child.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/Common/guards/roles.guard';
import { Roles } from 'src/Common/decorators/roles.decorator';
import { Role } from 'src/Common/enums/rol.enum';

@Controller('parent-children')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.PADRE)
export class ParentChildrenController {
  
  constructor(private readonly parentChildrenService: ParentChildrenService) {}

  @Post('add')
  agregarHijo(@Request() req, @Body() addChildDto: AddChildDto) {
    const parent_id = req.user.user_id;
    return this.parentChildrenService.agregarHijo(parent_id, addChildDto.child_code);
  }

  @Get('my-children')
  listarHijos(@Request() req) {
    const parent_id = req.user.user_id;
    return this.parentChildrenService.listarHijos(parent_id);
  }

  @Delete(':child_id')
  eliminarVinculo(@Request() req, @Param('child_id') child_id: string) {
    const parent_id = req.user.user_id;
    return this.parentChildrenService.eliminarVinculo(parent_id, +child_id);
  }

}
