import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'

class Direccion {
  @Prop({
    type: String,
    required: true,
    length: 75,
    default: '',
  })
  calle: string
  @Prop({
    type: String,
    required: true,
    length: 75,
    default: '',
  })
  numero: string
  @Prop({
    type: String,
    required: true,
    length: 75,
    default: '',
  })
  ciudad: string
  @Prop({
    type: String,
    required: true,
    length: 75,
    default: '',
  })
  provincia: string
  @Prop({
    type: String,
    required: true,
    length: 75,
    default: '',
  })
  pais: string
  @Prop({
    type: String,
    required: true,
    length: 75,
    default: '',
  })
  cP: string
}

export class Cliente {
  @Prop({
    type: String,
    required: true,
    length: 75,
    default: '',
  })
  nombre: string

  @Prop({
    type: String,
    required: true,
    length: 75,
    default: '',
  })
  email: string

  @Prop({
    type: String,
    required: true,
    length: 75,
    default: '',
  })
  tlf: string

  @Prop({
    required: true,
  })
  direccion: Direccion
}

export class LineaPedido {
  @Prop({
    type: Number,
    required: true,
  })
  idFunko: number
  @Prop({
    type: Number,
    required: true,
  })
  precioFunko: number
  @Prop({
    type: Number,
    required: true,
  })
  cantidad: number
  @Prop({
    type: Number,
    required: true,
  })
  total: number
}

export type PedidoDocument = Pedido & Document

@Schema({
  collection: 'pedidos',
  timestamps: false,
  versionKey: false,
  id: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v
      ret.id = ret._id
      delete ret._id
      delete ret._class
    },
  },
})
export class Pedido {
  @Prop({
    type: Number,
    required: true,
  })
  idUser: number
  @Prop({
    required: true,
  })
  cliente: Cliente
  @Prop({
    required: true,
  })
  lineasPedido: LineaPedido[]
  @Prop()
  totalItems: number
  @Prop()
  total: number
  @Prop({ default: Date.now })
  createdAt: Date
  @Prop({ default: Date.now })
  updatedAt: Date
  @Prop({ default: false })
  isDeleted: boolean
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido)
PedidoSchema.plugin(mongoosePaginate)
