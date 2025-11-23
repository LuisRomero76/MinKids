import { Application } from "src/applications/entities/application.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('application_limit')
export class ChildAppLimit {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    child_id: number;

    @Column({ type: 'int' })
    app_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'child_id' })
    child: User;

    @ManyToOne(() => Application)
    @JoinColumn({ name: 'app_id' })
    application: Application;

    @Column({ type: 'int', default: 60 })
    daily_limit_minutes: number;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;

}
