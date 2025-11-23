import { IsInt, IsLatitude, IsLongitude, IsNotEmpty } from "class-validator";

export class RegisterLocationDto {

    @IsNotEmpty({ message: 'El ID del hijo es obligatorio' })
    @IsInt({ message: 'El ID del hijo debe ser un número entero' })
    child_id: number;

    @IsNotEmpty({ message: 'La latitud es obligatoria' })
    @IsLatitude({ message: 'La latitud debe ser válida' })
    latitude: number;

    @IsNotEmpty({ message: 'La longitud es obligatoria' })
    @IsLongitude({ message: 'La longitud debe ser válida' })
    longitude: number;

}
