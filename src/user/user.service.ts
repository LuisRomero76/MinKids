import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.usersRepository.find() ;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({user_id: id});

    if (!user) {
      throw new BadRequestException('Usuario no encontrado')
    }

    return user ;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  buscarPorEmail(email: string) {
    return this.usersRepository.findOneBy({ email })
  }

  buscarDatosPorEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: [ 'user_id', 'name', 'email', 'password', 'rol', 'code' ]
    })
  }

  buscarPorCodigo(code: string) {
    return this.usersRepository.findOneBy({ code })
  }

  async crearUsuario(userData: Partial<User>) {
    const nuevoUsuario = this.usersRepository.create(userData);
    return await this.usersRepository.save(nuevoUsuario);
  }

}
