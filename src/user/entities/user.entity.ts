import { Role } from "src/Common/enums/rol.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 100, select: false, nullable: false })
    password: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'enum', default: Role.HIJO, enum: Role })
    rol: Role;

    @Column({ type: 'varchar', length: 15, unique: true, nullable: true })
    code?: string | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

}
