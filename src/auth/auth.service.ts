import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/Common/enums/rol.enum';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
    ){}

    /**
     * Genera un código alfanumérico único de 8 caracteres
     */
    private generarCodigoUnico(): string {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let codigo = '';
        for (let i = 0; i < 8; i++) {
            const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
            codigo += caracteres[indiceAleatorio];
        }
        return codigo;
    }

    /**
     * Verifica que el código generado sea único en la base de datos
     */
    private async generarCodigoUnicoVerificado(): Promise<string> {
        let codigoUnico: string;
        let codigoExiste: boolean;

        do {
            codigoUnico = this.generarCodigoUnico();
            const usuarioConCodigo = await this.usersService.buscarPorCodigo(codigoUnico);
            codigoExiste = !!usuarioConCodigo;
        } while (codigoExiste);

        return codigoUnico;
    }

    async register({ name, email, password, rol }: RegisterDto){

        const user = await this.usersService.buscarPorEmail(email)

        if (user) {
            throw new BadRequestException('El correo ya está en uso');
        }

        // Ya no se requiere código de entrada: se genera solo para hijos

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generar código solo si es HIJO; padres no tienen código
        let codigoFinal: string | null = null;
        if (rol === Role.HIJO) {
            codigoFinal = await this.generarCodigoUnicoVerificado();
        }

        // Crear el nuevo usuario
        const nuevoUsuario = await this.usersService.crearUsuario({
            name,
            email,
            password: hashedPassword,
            rol,
            code: codigoFinal,
        });

        // Generar token JWT
        const payload = { email: nuevoUsuario.email, sub: nuevoUsuario.user_id, rol: nuevoUsuario.rol };
        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            email: nuevoUsuario.email,
            name: nuevoUsuario.name,
            rol: nuevoUsuario.rol,
            code: rol === Role.HIJO ? codigoFinal : undefined, // Solo devolver el código si es hijo
        };
    }

    async login({email, password}: LoginDto){
        const user = await this.usersService.buscarDatosPorEmail(email);
        if (!user) {
            throw new BadRequestException('Usuario no encontrado');
        }

        const ContraValida = await bcrypt.compare(password, user.password);
        if (!ContraValida) {
            throw new BadRequestException('Contraseña incorrecta');
        }

        const payload = { email: user.email, sub: user.user_id, rol: user.rol };
        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                rol: user.rol,
                code: user.code,
            }
        };
    }

}
