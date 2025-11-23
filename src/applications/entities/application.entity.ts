import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Application {

    @PrimaryGeneratedColumn()
    app_id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 200, unique: true })
    package_name: string;

    @Column({ type: 'text', nullable: true })
    icon_url: string;

}
