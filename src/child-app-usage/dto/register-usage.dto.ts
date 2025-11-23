import { IsDateString, IsInt, IsNotEmpty, Min } from "class-validator";

export class RegisterUsageDto {

    @IsNotEmpty({ message: 'El ID del hijo es obligatorio' })
    @IsInt({ message: 'El ID del hijo debe ser un número entero' })
    child_id: number;

    @IsNotEmpty({ message: 'El ID de la aplicación es obligatorio' })
    @IsInt({ message: 'El ID de la aplicación debe ser un número entero' })
    app_id: number;

    @IsNotEmpty({ message: 'Los minutos de uso son obligatorios' })
    @IsInt({ message: 'Los minutos de uso deben ser un número entero' })
    @Min(0, { message: 'Los minutos de uso deben ser mayor o igual a 0' })
    usage_minutes: number;

    @IsNotEmpty({ message: 'La fecha es obligatoria' })
    @IsDateString({}, { message: 'La fecha debe ser válida (formato: YYYY-MM-DD)' })
    date: string;

}
