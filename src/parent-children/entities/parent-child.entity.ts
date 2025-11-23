import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ParentChild {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    parent_id: number;

    @Column({ type: 'int' })
    child_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'parent_id' })
    parent: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'child_id' })
    child: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

}
