import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { Funko } from '../../funkos/entities/funko.entity'

@Entity({ name: 'categoria' }) //Nombre de la tabla, recuerda que es case sensitive al poner el nombre
//@Unique(['nombre']) //Para que cada categoria tenga un nombre unico, es decir que no se repitan los nombres
export class Categoria {
  @PrimaryColumn({ type: 'uuid' }) // El decorador indica que el id será autoincremental y lo pondra la base de datos
  id: string

  @Column({ type: 'varchar', length: 255 })
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
