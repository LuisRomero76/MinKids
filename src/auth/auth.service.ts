import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
    ){}

    async login({email, password}: LoginDto){
        const user = await this.usersService.buscarDatosPorEmail(email);
        if (!user) {
            throw new BadRequestException('Usuario no encontrado');
        }

        const ContraValida = await bcrypt.compare(password, user.password);
        if (!ContraValida) {
            throw new BadRequestException('Contraseña incorrecta');
        }

        
    }

}
