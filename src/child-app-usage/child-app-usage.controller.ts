import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ChildAppUsageService } from './child-app-usage.service';
import { RegisterUsageDto } from './dto/register-usage.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/Common/guards/roles.guard';
import { Roles } from 'src/Common/decorators/roles.decorator';
import { Role } from 'src/Common/enums/rol.enum';

@Controller('child-app-usage')
@UseGuards(AuthGuard)
export class ChildAppUsageController {
  
  constructor(private readonly childAppUsageService: ChildAppUsageService) {}

  @Post('register')
  registrarUso(@Body() registerUsageDto: RegisterUsageDto) {
    return this.childAppUsageService.registrarUso(registerUsageDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.PADRE)
  @Get('daily/:child_id')
  obtenerUsoDiario(
    @Request() req,
    @Param('child_id') child_id: string,
    @Query('date') date: string
  ) {
    const parent_id = req.user.user_id;
    return this.childAppUsageService.obtenerUsoDiario(parent_id, +child_id, date);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.PADRE)
  @Get('monthly/:child_id')
  obtenerUsoMensual(
    @Request() req,
    @Param('child_id') child_id: string,
    @Query('year') year: string,
    @Query('month') month: string
  ) {
    const parent_id = req.user.user_id;
    return this.childAppUsageService.obtenerUsoMensual(parent_id, +child_id, +year, +month);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.PADRE)
  @Get('by-app/:child_id/:app_id')
  obtenerUsoPorApp(
    @Request() req,
    @Param('child_id') child_id: string,
    @Param('app_id') app_id: string,
    @Query('fecha_inicio') fecha_inicio: string,
    @Query('fecha_fin') fecha_fin: string
  ) {
    const parent_id = req.user.user_id;
    return this.childAppUsageService.obtenerUsoPorApp(
      parent_id,
      +child_id,
      +app_id,
      fecha_inicio,
      fecha_fin
    );
  }

}
