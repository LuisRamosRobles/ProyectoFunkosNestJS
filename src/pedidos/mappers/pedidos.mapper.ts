import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Pedido } from '../schemas/pedido.schema'
import { CreatePedidoDto } from '../dto/create-pedido.dto'

@Injectable()
export class PedidosMapper {
  mapCreateDtotoEntity(createCategoriaDto: CreatePedidoDto): Pedido {
    return plainToClass(Pedido, createCategoriaDto)
  }
}
