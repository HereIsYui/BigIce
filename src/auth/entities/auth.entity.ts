import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PiUser {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  appname: string

  @Column()
  appid: string

  @Column()
  secret: string

  @Column({ default: '' })
  reg_ip: string

  @Column({ default: '' })
  login_ip: string

  @UpdateDateColumn()
  login_time: Date

  @CreateDateColumn()
  reg_time: Date

  @UpdateDateColumn()
  change_time: Date

  @Column({ default: '0' })
  delete_flag: string
}
