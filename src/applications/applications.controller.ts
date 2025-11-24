import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/Common/guards/roles.guard';
import { Roles } from 'src/Common/decorators/roles.decorator';
import { Role } from 'src/Common/enums/rol.enum';

@Controller('applications')
@UseGuards(AuthGuard, RolesGuard)
export class ApplicationsController {
  
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.PADRE)
  crear(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.crear(createApplicationDto);
  }

  @Get()
  @Roles(Role.PADRE, Role.HIJO)
  listarTodas() {
    return this.applicationsService.listarTodas();
  }

  @Get(':id')
  @Roles(Role.PADRE, Role.HIJO)
  buscarPorId(@Param('id') id: string) {
    return this.applicationsService.buscarPorId(+id);
  }

  @Patch(':id')
  @Roles(Role.PADRE)
  actualizar(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationsService.actualizar(+id, updateApplicationDto);
  }

  @Delete(':id')
  @Roles(Role.PADRE)
  eliminar(@Param('id') id: string) {
    return this.applicationsService.eliminar(+id);
  }

}
