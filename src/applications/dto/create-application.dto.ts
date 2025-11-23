import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateApplicationDto {

    @IsNotEmpty({ message: 'El nombre de la aplicación es obligatorio' })
    @IsString({ message: 'El nombre debe ser un texto' })
    name: string;

    @IsNotEmpty({ message: 'El package name es obligatorio' })
    @IsString({ message: 'El package name debe ser un texto' })
    package_name: string;

    @IsOptional()
    @IsString({ message: 'La URL del icono debe ser un texto' })
    icon_url?: string;

}
