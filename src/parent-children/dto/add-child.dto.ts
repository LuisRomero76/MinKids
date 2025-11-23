import { IsNotEmpty, IsString } from "class-validator";

export class AddChildDto {

    @IsNotEmpty({ message: 'El código del hijo es obligatorio' })
    @IsString({ message: 'El código debe ser un texto' })
    child_code: string;

}
