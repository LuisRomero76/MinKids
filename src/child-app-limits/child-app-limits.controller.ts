import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChildAppLimitsService } from './child-app-limits.service';
import { CreateLimitDto } from './dto/create-limit.dto';
import { UpdateLimitDto } from './dto/update-limit.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/Common/guards/roles.guard';
import { Roles } from 'src/Common/decorators/roles.decorator';
import { Role } from 'src/Common/enums/rol.enum';

@Controller('child-app-limits')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.PADRE)
export class ChildAppLimitsController {
  
  constructor(private readonly childAppLimitsService: ChildAppLimitsService) {}

  @Post()
  asignarLimite(@Request() req, @Body() createLimitDto: CreateLimitDto) {
    const parent_id = req.user.user_id;
    return this.childAppLimitsService.asignarLimite(parent_id, createLimitDto);
  }

  @Patch(':id')
  actualizarLimite(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLimitDto: UpdateLimitDto
  ) {
    const parent_id = req.user.user_id;
    return this.childAppLimitsService.actualizarLimite(parent_id, +id, updateLimitDto);
  }

  @Get('child/:child_id')
  obtenerLimitesDeHijo(@Request() req, @Param('child_id') child_id: string) {
    const parent_id = req.user.user_id;
    return this.childAppLimitsService.obtenerLimitesDeHijo(parent_id, +child_id);
  }

  @Delete(':id')
  eliminarLimite(@Request() req, @Param('id') id: string) {
    const parent_id = req.user.user_id;
    return this.childAppLimitsService.eliminarLimite(parent_id, +id);
  }

}
