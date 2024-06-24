// admin entity typeorm
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
@Entity()
export class PointRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column()
  openid: string;

  @Column({ default: 0 })
  point: number;

  @Column({ default: '' })
  reason: string;

  @Column({ default: '0' })
  delete_flag: string;

  @CreateDateColumn()
  created_at: Date;
}
