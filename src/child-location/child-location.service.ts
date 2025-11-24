import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChildLocationLog } from './entities/child-location-log.entity';
import { Between, Repository } from 'typeorm';
import { RegisterLocationDto } from './dto/register-location.dto';
import { ParentChildrenService } from 'src/parent-children/parent-children.service';

@Injectable()
export class ChildLocationService {

  constructor(
    @InjectRepository(ChildLocationLog)
    private readonly locationRepository: Repository<ChildLocationLog>,
    private readonly parentChildrenService: ParentChildrenService
  ) {}

  async registrarUbicacion(registerLocationDto: RegisterLocationDto) {
    const nuevaUbicacion = this.locationRepository.create(registerLocationDto);
    return await this.locationRepository.save(nuevaUbicacion);
  }

  async obtenerUbicacionActual(parent_id: number, child_id: number) {
    const tieneVinculo = await this.parentChildrenService.verificarVinculo(
      parent_id,
      child_id
    );

    if (!tieneVinculo) {
      throw new BadRequestException('No tienes autorización para ver la ubicación de este hijo');
    }

    const ubicacion = await this.locationRepository.findOne({
      where: { child_id },
      order: { captured_at: 'DESC' },
      relations: ['child']
    });

    if (!ubicacion) {
      throw new BadRequestException('No se encontró ubicación para este hijo');
    }

    return ubicacion;
  }

  async obtenerHistoricoUbicaciones(
    parent_id: number, 
    child_id: number, 
    fecha_inicio: string, 
    fecha_fin: string
  ) {
    const tieneVinculo = await this.parentChildrenService.verificarVinculo(
      parent_id,
      child_id
    );

    if (!tieneVinculo) {
      throw new BadRequestException('No tienes autorización para ver la ubicación de este hijo');
    }

    return await this.locationRepository.find({
      where: {
        child_id,
        captured_at: Between(new Date(fecha_inicio), new Date(fecha_fin))
      },
      order: { captured_at: 'DESC' }
    });
  }

  async obtenerUbicacionesDeMisHijos(parent_id: number) {
    const hijos = await this.parentChildrenService.listarHijos(parent_id);
    const resultados: Array<{
      child_id: number;
      latitude: number;
      longitude: number;
      captured_at: Date;
      child?: any;
    }> = [];
    
    for (const relacion of hijos) {
      const child_id = relacion.child_id;
      const ubicacion = await this.locationRepository.findOne({
        where: { child_id },
        order: { captured_at: 'DESC' },
      });
      
      if (ubicacion) {
        resultados.push({
          child_id,
          latitude: Number(ubicacion.latitude),
          longitude: Number(ubicacion.longitude),
          captured_at: ubicacion.captured_at,
          child: relacion.child ?? undefined,
        });
      }
    }
    return resultados;
  }

}
