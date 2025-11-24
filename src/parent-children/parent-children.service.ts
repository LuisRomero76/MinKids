import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParentChild } from './entities/parent-child.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/Common/enums/rol.enum';

@Injectable()
export class ParentChildrenService {

  constructor(
    @InjectRepository(ParentChild)
    private readonly parentChildRepository: Repository<ParentChild>,
    private readonly userService: UserService
  ) {}

  async agregarHijo(parent_id: number, child_code: string) {
    const hijo = await this.userService.buscarPorCodigo(child_code);

    if (!hijo) {
      throw new BadRequestException('No se encontró un usuario con ese código');
    }

    if (hijo.rol !== Role.HIJO) {
      throw new BadRequestException('El usuario no tiene rol de hijo');
    }

    if (hijo.user_id === parent_id) {
      throw new BadRequestException('No puedes agregarte a ti mismo como hijo');
    }

    const vinculoExistente = await this.parentChildRepository.findOne({
      where: { parent_id, child_id: hijo.user_id }
    });

    if (vinculoExistente) {
      throw new BadRequestException('Este hijo ya está vinculado a tu cuenta');
    }

    const nuevoVinculo = this.parentChildRepository.create({
      parent_id,
      child_id: hijo.user_id
    });

    try {
      return await this.parentChildRepository.save(nuevoVinculo);
    } catch (e: any) {
      // Mejorar mensaje cuando falla por FK u otros errores
      throw new BadRequestException(e?.message || 'No se pudo crear el vínculo');
    }
  }

  async listarHijos(parent_id: number) {
    return await this.parentChildRepository.find({
      where: { parent_id },
      relations: ['child']
    });
  }

  async listarPadres(child_id: number) {
    return await this.parentChildRepository.find({
      where: { child_id },
      relations: ['parent']
    });
  }

  async eliminarVinculo(parent_id: number, child_id: number) {
    const vinculo = await this.parentChildRepository.findOne({
      where: { parent_id, child_id }
    });

    if (!vinculo) {
      throw new BadRequestException('No existe vínculo con este hijo');
    }

    await this.parentChildRepository.remove(vinculo);

    return { message: 'Vínculo eliminado correctamente' };
  }

  async verificarVinculo(parent_id: number, child_id: number) {
    const vinculo = await this.parentChildRepository.findOne({
      where: { parent_id, child_id }
    });

    return !!vinculo;
  }

}
