import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Categoria } from '../../categorias/entities/categoria.entity'

@Entity({ name: 'funkos' })
export class Funko {
  @PrimaryGeneratedColumn({ type: 'bigint' }) //Clave autoincremental  de tipo bigint porque postgresql representa el tipo serial con bigint
  id: number

  @Column({ type: 'varchar', length: 255 })
  nombre: string

  @CreateDateColumn({
    name: 'create_Date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'update_Date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @ManyToOne(() => Categoria, (categoria) => categoria.funko, {
    onDelete: 'SET NULL',
  })
  categoria: Categoria
}
