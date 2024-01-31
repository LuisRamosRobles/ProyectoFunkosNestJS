import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Categoria } from '../../categorias/entities/categoria.entity'

@Entity({ name: 'funkos' })
export class Funko {
  public static IMAGENPORDEFECTO = 'https://via.placeholder.com/150'
  @PrimaryGeneratedColumn({ type: 'bigint' }) //Clave autoincremental  de tipo bigint porque postgresql representa el tipo serial con bigint
  id: number

  @Column({ type: 'varchar', length: 255 })
  nombre: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string

  @Column({ type: 'double precision', default: 0.0 })
  precio: number

  @Column({ type: 'integer', default: 0 })
  stock: number

  @Column({ type: 'text', default: Funko.IMAGENPORDEFECTO })
  imagen: string

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

  @Column({ name: 'is_deleted', type: 'boolean', default: true })
  isDeleted: boolean

  @ManyToOne(() => Categoria, (categoria) => categoria.funko)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria
}
