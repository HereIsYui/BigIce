// admin entity typeorm
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column()
  username: string;

  @Column({ default: '' })
  nickname: string;

  @Column()
  password: string;

  @Column()
  openid: string;

  @Column({ default: 0 })
  point: number;

  @Column({ default: '' })
  avatar: string;

  @Column()
  fish_uid: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '0' })
  delete_flag: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
