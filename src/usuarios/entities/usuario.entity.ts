import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UsuarioRol } from './usuario-role.entity'

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'usuarios' })
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  apellidos: string

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario, {
    eager: true,
  })
  roles: UsuarioRol[]

  get roleNames(): string[] {
    return this.roles.map((role) => role.role)
  }
}
