import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ChildLocationService } from './child-location.service';
import { RegisterLocationDto } from './dto/register-location.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/Common/guards/roles.guard';
import { Roles } from 'src/Common/decorators/roles.decorator';
import { Role } from 'src/Common/enums/rol.enum';

@Controller('child-location')
@UseGuards(AuthGuard)
export class ChildLocationController {
  
  constructor(private readonly childLocationService: ChildLocationService) {}

  @Post('register')
  registrarUbicacion(@Body() registerLocationDto: RegisterLocationDto) {
    return this.childLocationService.registrarUbicacion(registerLocationDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.PADRE)
  @Get('current/:child_id')
  obtenerUbicacionActual(@Request() req, @Param('child_id') child_id: string) {
    const parent_id = req.user.user_id;
    return this.childLocationService.obtenerUbicacionActual(parent_id, +child_id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.PADRE)
  @Get('history/:child_id')
  obtenerHistoricoUbicaciones(
    @Request() req,
    @Param('child_id') child_id: string,
    @Query('fecha_inicio') fecha_inicio: string,
    @Query('fecha_fin') fecha_fin: string
  ) {
    const parent_id = req.user.user_id;
    return this.childLocationService.obtenerHistoricoUbicaciones(
      parent_id,
      +child_id,
      fecha_inicio,
      fecha_fin
    );
  }

  @UseGuards(RolesGuard)
  @Roles(Role.PADRE)
  @Get('my-children')
  obtenerUbicacionesDeMisHijos(@Request() req) {
    const parent_id = req.user.user_id;
    return this.childLocationService.obtenerUbicacionesDeMisHijos(parent_id);
  }

}
