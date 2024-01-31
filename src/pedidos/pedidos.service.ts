import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { Pedido, PedidoDocument } from './schemas/pedido.schema'
import { PaginateModel } from 'mongoose'
import { InjectRepository } from '@nestjs/typeorm'
import { Funko } from '../funkos/entities/funko.entity'
import { Repository } from 'typeorm'
import { PedidosMapper } from './mappers/pedidos.mapper'
import { InjectModel } from '@nestjs/mongoose'

export const PedidosOrderByValues: string[] = ['_id', 'idUsuario']

export const PedidosOrderValues: string[] = ['asc', 'desc']

@Injectable()
export class PedidosService {
  private logger = new Logger(PedidosService.name)

  constructor(
    @InjectModel(Pedido.name)
    private pedidosRepository: PaginateModel<PedidoDocument>,
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    private readonly pedidosMapper: PedidosMapper,
  ) {}

  async findAll(page: number, limit: number, orderBy: string, order: string) {
    this.logger.log(
      `Buscando todos los pedidos con paginación y filtros: ${JSON.stringify({
        page,
        limit,
        orderBy,
        order,
      })}`,
    )
    // query de ordenación y paginación
    const options = {
      page,
      limit,
      sort: {
        [orderBy]: order,
      },
      collection: 'es_ES', // especificamos la configuración de idioma de España
    }

    return await this.pedidosRepository.paginate({}, options)
  }

  async findOne(id: string) {
    this.logger.log(`Obteniendo pedido con el ID: ${id}`)
    const encontrarPedido = await this.pedidosRepository.findById(id).exec()

    if (!encontrarPedido) {
      throw new NotFoundException(
        `El pedido con id ${id} no ha sido encontrado.`,
      )
    }
    return encontrarPedido
  }

  async findByUsuario(idUsuario: number) {
    this.logger.log(`Obteniendo pedido de usuario con id: ${idUsuario}`)
    return this.pedidosRepository.find({ idUsuario }).exec()
  }

  async create(createPedidoDto: CreatePedidoDto) {
    this.logger.log(`Creando pedido ${JSON.stringify(createPedidoDto)}`)
    console.log(`Guardando pedido: ${createPedidoDto}`)

    const pedidoAGuardar =
      this.pedidosMapper.mapCreateDtotoEntity(createPedidoDto)

    await this.checkPedido(pedidoAGuardar)

    const pedidoGuardar = await this.reserveStockPedidos(pedidoAGuardar)

    pedidoGuardar.createdAt = new Date()
    pedidoGuardar.updatedAt = new Date()

    return await this.pedidosRepository.create(pedidoGuardar)
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    this.logger.log(
      `Actualizando pedido con id ${id} y ${JSON.stringify(updatePedidoDto)}}`,
    )

    const actualizarPedido = await this.pedidosRepository.findById(id).exec()
    if (!actualizarPedido) {
      throw new NotFoundException(`El pedido con id ${id} no fue encontrado`)
    }

    const pedidoAGuardar =
      this.pedidosMapper.mapCreateDtotoEntity(updatePedidoDto)

    await this.returnStockPedidos(pedidoAGuardar)

    await this.checkPedido(pedidoAGuardar)
    const pedidoGuardar = await this.reserveStockPedidos(pedidoAGuardar)

    pedidoGuardar.updatedAt = new Date()

    return await this.pedidosRepository
      .findByIdAndUpdate(id, pedidoGuardar, { new: true })
      .exec()
  }

  async remove(id: string) {
    this.logger.log(`El pedido con id ${id} esta siendo eliminado.`)

    const pedidoABorrar = await this.pedidosRepository.findById(id).exec()
    if (!pedidoABorrar) {
      throw new NotFoundException(
        `El pedido con id ${id} no ha sido encontrado.`,
      )
    }
    await this.returnStockPedidos(pedidoABorrar)
    await this.pedidosRepository.findByIdAndDelete(id).exec()
  }

  private async checkPedido(pedido: Pedido) {
    this.logger.log(`Comprobando pedido ${JSON.stringify(pedido)}`)

    if (!pedido.lineasPedido || pedido.lineasPedido.length === 0) {
      throw new BadRequestException(
        'Ninguna linea fue agregada al pedido actual.',
      )
    }

    for (const lineaPedido of pedido.lineasPedido) {
      const funko = await this.funkoRepository.findOneBy({
        id: lineaPedido.idFunko,
      })

      if (!funko) {
        throw new BadRequestException(
          `El funko con id ${lineaPedido.idFunko} no existe.`,
        )
      }

      if (funko.stock < lineaPedido.cantidad && lineaPedido.cantidad > 0) {
        throw new BadRequestException(
          `La cantidad especificada no es válida o no hay suficiente stock del funko ${funko.id}.`,
        )
      }

      if (funko.precio !== lineaPedido.precioFunko) {
        throw new BadRequestException(
          `El precio del funko ${funko.id} especificado en el pedido no coincide con
          su precio actual.`,
        )
      }
    }
  }

  private async reserveStockPedidos(pedido: Pedido) {
    this.logger.log(`Reservando stock del pedido: ${pedido}`)

    if (!pedido.lineasPedido || pedido.lineasPedido.length === 0) {
      throw new BadRequestException('No se agrego ninguna linea al pedido.')
    }

    for (const lineaPedido of pedido.lineasPedido) {
      const funko = await this.funkoRepository.findOneBy({
        id: lineaPedido.idFunko,
      })
      funko.stock -= lineaPedido.cantidad
      await this.funkoRepository.save(funko)
      lineaPedido.total = lineaPedido.cantidad * lineaPedido.precioFunko
    }

    pedido.total = pedido.lineasPedido.reduce(
      (sum, lineaPedido) =>
        sum + lineaPedido.cantidad * lineaPedido.precioFunko,
      0,
    )

    pedido.totalItems = pedido.lineasPedido.reduce(
      (sum, lineaPedido) => sum + lineaPedido.cantidad,
      0,
    )

    return pedido
  }

  private async returnStockPedidos(pedido: Pedido): Promise<Pedido> {
    this.logger.log(`Devolviendo stock del pedido: ${pedido}`)

    if (pedido.lineasPedido) {
      for (const lineaPedido of pedido.lineasPedido) {
        const funko = await this.funkoRepository.findOneBy({
          id: lineaPedido.idFunko,
        })
        funko.stock += lineaPedido.cantidad
        await this.funkoRepository.save(funko)
      }
    }
    return pedido
  }
}
