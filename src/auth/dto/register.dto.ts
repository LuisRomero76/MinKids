import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, ValidateIf } from "class-validator";
import { Role } from "src/Common/enums/rol.enum";

export class RegisterDto {

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    email: string;

    @IsString()
    @MinLength(6)
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    @IsNotEmpty()
    rol: Role;

    @ValidateIf(o => o.rol === Role.HIJO)
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    code?: string;

}