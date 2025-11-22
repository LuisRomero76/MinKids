import { Role } from "src/Common/enums/rol.enum";

export class CreateUserDto {

    email: string;

    password: string;

    name: string;

    rol:Role;

    code?: string;

}
