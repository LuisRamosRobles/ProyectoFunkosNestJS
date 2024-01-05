import { Entity } from 'typeorm'

@Entity({ name: 'funkos' })
export class Funko {
  constructor(id: number, nombre: string, categoria: string) {
    this.id = id
    this.nombre = nombre
    this.categoria = categoria
  }

  id: number
  nombre: string
  categoria: string
  createdAt: Date
  updatedAt: Date
}
