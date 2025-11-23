import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('location')
export class ChildLocationLog {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    child_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'child_id' })
    child: User;

    @Column({ type: 'decimal', precision: 10, scale: 8 })
    latitude: number;

    @Column({ type: 'decimal', precision: 11, scale: 8 })
    longitude: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    captured_at: Date;

}
