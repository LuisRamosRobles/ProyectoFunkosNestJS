import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Funko } from '../../funkos/entities/funko.entity'

@Entity({ name: 'categoria' }) //Nombre de la tabla, recuerda que es case sensitive al poner el nombre
export class Categoria {
  @PrimaryColumn({ type: 'uuid' }) // El decorador indica que el id será autoincremental y lo pondra la base de datos
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  nombre: string

  @CreateDateColumn({
    name: 'create_Date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date

  @UpdateDateColumn({
    name: 'update_Date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateDate: Date

  @Column({ name: 'activa', type: 'boolean', default: true })
  activa: boolean

  @OneToMany(() => Funko, (funko) => funko.categoria)
  funko: Funko[]
}
