import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";

export class CreateLimitDto {

    @IsNotEmpty({ message: 'El ID del hijo es obligatorio' })
    @IsInt({ message: 'El ID del hijo debe ser un número entero' })
    child_id: number;

    @IsNotEmpty({ message: 'El ID de la aplicación es obligatorio' })
    @IsInt({ message: 'El ID de la aplicación debe ser un número entero' })
    app_id: number;

    @IsNotEmpty({ message: 'El límite diario es obligatorio' })
    @IsInt({ message: 'El límite diario debe ser un número entero' })
    @Min(0, { message: 'El límite diario debe ser mayor o igual a 0' })
    daily_limit_minutes: number;

    @IsOptional()
    @IsBoolean({ message: 'El campo enabled debe ser verdadero o falso' })
    enabled?: boolean;

}
