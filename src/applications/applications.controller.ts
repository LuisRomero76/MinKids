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
@Roles(Role.PADRE)
export class ApplicationsController {
  
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  crear(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.crear(createApplicationDto);
  }

  @Get()
  listarTodas() {
    return this.applicationsService.listarTodas();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.applicationsService.buscarPorId(+id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationsService.actualizar(+id, updateApplicationDto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.applicationsService.eliminar(+id);
  }

}
