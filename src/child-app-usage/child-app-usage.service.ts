import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChildAppUsageLog } from './entities/usage-time.entity';
import { Between, Repository } from 'typeorm';
import { RegisterUsageDto } from './dto/register-usage.dto';
import { ParentChildrenService } from 'src/parent-children/parent-children.service';
import { ApplicationsService } from 'src/applications/applications.service';

@Injectable()
export class ChildAppUsageService {

  constructor(
    @InjectRepository(ChildAppUsageLog)
    private readonly usageRepository: Repository<ChildAppUsageLog>,
    private readonly parentChildrenService: ParentChildrenService,
    private readonly applicationsService: ApplicationsService
  ) {}

  async registrarUso(registerUsageDto: RegisterUsageDto) {
    await this.applicationsService.buscarPorId(registerUsageDto.app_id);

    const registroExistente = await this.usageRepository.findOne({
      where: {
        child_id: registerUsageDto.child_id,
        app_id: registerUsageDto.app_id,
        date: new Date(registerUsageDto.date)
      }
    });

    if (registroExistente) {
      registroExistente.usage_minutes += registerUsageDto.usage_minutes;
      return await this.usageRepository.save(registroExistente);
    }

    const nuevoRegistro = this.usageRepository.create({
      ...registerUsageDto,
      date: new Date(registerUsageDto.date)
    });

    return await this.usageRepository.save(nuevoRegistro);
  }

  async sincronizarUso(child_id: number, usageData: Record<string, number>, dateStr: string) {
    const date = new Date(dateStr);
    const aplicaciones = await this.applicationsService.listarTodas();
    
    const registros: ChildAppUsageLog[] = [];
    for (const app of aplicaciones) {
      const minutes = usageData[app.package_name];
      if (minutes && minutes > 0) {
        const registroExistente = await this.usageRepository.findOne({
          where: { child_id, app_id: app.app_id, date }
        });

        if (registroExistente) {
          registroExistente.usage_minutes = minutes;
          registros.push(await this.usageRepository.save(registroExistente));
        } else {
          const nuevoRegistro = this.usageRepository.create({
            child_id,
            app_id: app.app_id,
            usage_minutes: minutes,
            date
          });
          registros.push(await this.usageRepository.save(nuevoRegistro));
        }
      }
    }

    return { success: true, synced: registros.length };
  }

  async obtenerUsoDelDia(child_id: number, dateStr: string) {
    const date = new Date(dateStr);
    return await this.usageRepository.find({
      where: { child_id, date },
      relations: ['application']
    });
  }

  async obtenerUsoDiario(parent_id: number, child_id: number, date: string) {
    const tieneVinculo = await this.parentChildrenService.verificarVinculo(
      parent_id,
      child_id
    );

    if (!tieneVinculo) {
      throw new BadRequestException('No tienes autorización para ver el uso de este hijo');
    }

    return await this.usageRepository.find({
      where: {
        child_id,
        date: new Date(date)
      },
      relations: ['application']
    });
  }

  async obtenerUsoMensual(parent_id: number, child_id: number, year: number, month: number) {
    const tieneVinculo = await this.parentChildrenService.verificarVinculo(
      parent_id,
      child_id
    );

    if (!tieneVinculo) {
      throw new BadRequestException('No tienes autorización para ver el uso de este hijo');
    }

    const fechaInicio = new Date(year, month - 1, 1);
    const fechaFin = new Date(year, month, 0);

    return await this.usageRepository.find({
      where: {
        child_id,
        date: Between(fechaInicio, fechaFin)
      },
      relations: ['application']
    });
  }

  async obtenerUsoPorApp(parent_id: number, child_id: number, app_id: number, fecha_inicio: string, fecha_fin: string) {
    const tieneVinculo = await this.parentChildrenService.verificarVinculo(
      parent_id,
      child_id
    );

    if (!tieneVinculo) {
      throw new BadRequestException('No tienes autorización para ver el uso de este hijo');
    }

    await this.applicationsService.buscarPorId(app_id);

    return await this.usageRepository.find({
      where: {
        child_id,
        app_id,
        date: Between(new Date(fecha_inicio), new Date(fecha_fin))
      },
      relations: ['application']
    });
  }

}
