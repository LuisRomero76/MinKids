import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChildAppLimit } from './entities/application-limit.entity';
import { Repository } from 'typeorm';
import { CreateLimitDto } from './dto/create-limit.dto';
import { UpdateLimitDto } from './dto/update-limit.dto';
import { ParentChildrenService } from 'src/parent-children/parent-children.service';
import { ApplicationsService } from 'src/applications/applications.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChildAppLimitsService {

  constructor(
    @InjectRepository(ChildAppLimit)
    private readonly limitRepository: Repository<ChildAppLimit>,
    private readonly parentChildrenService: ParentChildrenService,
    private readonly applicationsService: ApplicationsService,
    private readonly userService: UserService
  ) {}

  async asignarLimite(parent_id: number, createLimitDto: CreateLimitDto) {
    const tieneVinculo = await this.parentChildrenService.verificarVinculo(
      parent_id, 
      createLimitDto.child_id
    );

    if (!tieneVinculo) {
      throw new BadRequestException('No tienes autorización para gestionar este hijo');
    }

    await this.applicationsService.buscarPorId(createLimitDto.app_id);

    const limiteExistente = await this.limitRepository.findOne({
      where: { 
        child_id: createLimitDto.child_id,
        app_id: createLimitDto.app_id
      }
    });

    if (limiteExistente) {
      throw new BadRequestException('Ya existe un límite para este hijo y aplicación');
    }

    const nuevoLimite = this.limitRepository.create(createLimitDto);
    return await this.limitRepository.save(nuevoLimite);
  }

  async actualizarLimite(parent_id: number, limit_id: number, updateLimitDto: UpdateLimitDto) {
    const limite = await this.limitRepository.findOne({
      where: { id: limit_id }
    });

    if (!limite) {
      throw new BadRequestException('Límite no encontrado');
    }

    const tieneVinculo = await this.parentChildrenService.verificarVinculo(
      parent_id,
      limite.child_id
    );

    if (!tieneVinculo) {
      throw new BadRequestException('No tienes autorización para modificar este límite');
    }

    await this.limitRepository.update(limit_id, updateLimitDto);
    
    return await this.limitRepository.findOne({
      where: { id: limit_id },
      relations: ['child', 'application']
    });
  }

  async obtenerLimitesDeHijo(parent_id: number, child_id: number) {
    const tieneVinculo = await this.parentChildrenService.verificarVinculo(
      parent_id,
      child_id
    );

    if (!tieneVinculo) {
      throw new BadRequestException('No tienes autorización para ver los límites de este hijo');
    }

    return await this.limitRepository.find({
      where: { child_id },
      relations: ['application']
    });
  }

  async eliminarLimite(parent_id: number, limit_id: number) {
    const limite = await this.limitRepository.findOne({
      where: { id: limit_id }
    });

    if (!limite) {
      throw new BadRequestException('Límite no encontrado');
    }

    const tieneVinculo = await this.parentChildrenService.verificarVinculo(
      parent_id,
      limite.child_id
    );

    if (!tieneVinculo) {
      throw new BadRequestException('No tienes autorización para eliminar este límite');
    }

    await this.limitRepository.remove(limite);

    return { message: 'Límite eliminado correctamente' };
  }

  async obtenerMisLimites(child_id: number) {
    return await this.limitRepository.find({
      where: { child_id },
      relations: ['application']
    });
  }

}
