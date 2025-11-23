import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class UpdateLimitDto {

    @IsOptional()
    @IsInt({ message: 'El límite diario debe ser un número entero' })
    @Min(0, { message: 'El límite diario debe ser mayor o igual a 0' })
    daily_limit_minutes?: number;

    @IsOptional()
    @IsBoolean({ message: 'El campo enabled debe ser verdadero o falso' })
    enabled?: boolean;

}
