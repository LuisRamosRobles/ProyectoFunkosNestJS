import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Usuario } from './usuario.entity'

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
@Entity({ name: 'usuario_roles' })
export class UsuarioRol {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50, nullable: false, default: Role.USER })
  role: Role

  @ManyToOne(() => Usuario, (user) => user.roles)
  @JoinColumn({ name: 'user_id' })
  usuario: Usuario
}
