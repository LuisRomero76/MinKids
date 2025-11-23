import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {

  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>
  ) {}

  async crear(createApplicationDto: CreateApplicationDto) {
    const appExistente = await this.applicationRepository.findOne({
      where: { package_name: createApplicationDto.package_name }
    });

    if (appExistente) {
      throw new BadRequestException('Ya existe una aplicación con ese package name');
    }

    const nuevaApp = this.applicationRepository.create(createApplicationDto);
    return await this.applicationRepository.save(nuevaApp);
  }

  async listarTodas() {
    return await this.applicationRepository.find();
  }

  async buscarPorId(app_id: number) {
    const app = await this.applicationRepository.findOne({
      where: { app_id }
    });

    if (!app) {
      throw new BadRequestException('Aplicación no encontrada');
    }

    return app;
  }

  async actualizar(app_id: number, updateApplicationDto: UpdateApplicationDto) {
    const app = await this.buscarPorId(app_id);

    if (updateApplicationDto.package_name && updateApplicationDto.package_name !== app.package_name) {
      const appExistente = await this.applicationRepository.findOne({
        where: { package_name: updateApplicationDto.package_name }
      });

      if (appExistente) {
        throw new BadRequestException('Ya existe una aplicación con ese package name');
      }
    }

    await this.applicationRepository.update(app_id, updateApplicationDto);
    return await this.buscarPorId(app_id);
  }

  async eliminar(app_id: number) {
    const app = await this.buscarPorId(app_id);
    await this.applicationRepository.remove(app);

    return { message: 'Aplicación eliminada correctamente' };
  }

}
