import {
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  Put,
  HttpCode,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { PedidosService } from './pedidos.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { OrderbyValidatePipe } from './pipes/orderby-validate.pipe'
import { OrderValidatePipe } from './pipes/order-validate.pipe'
import { IdValidatePipe } from './pipes/id-validate.pipe'

@Controller('pedidos')
export class PedidosController {
  private readonly logger = new Logger(PedidosController.name)
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1))
    page: number = 1,
    @Query('limit', new DefaultValuePipe(20))
    limit: number = 10,
    @Query('orderBy', new DefaultValuePipe('idUsuario'), OrderbyValidatePipe)
    orderBy: string = 'idUsuario',
    @Query('order', new DefaultValuePipe('asc'), OrderValidatePipe)
    order: string,
  ) {
    this.logger.log(
      `Buscando todos los pedidos con: ${JSON.stringify({
        page,
        limit,
        orderBy,
        order,
      })}`,
    )

    return await this.pedidosService.findAll(page, limit, orderBy, order)
  }

  @Get(':id')
  async findOne(@Param('id', IdValidatePipe) id: string) {
    this.logger.log(`Buscando pedido con id ${id}`)
    return this.pedidosService.findOne(id)
  }

  @Get('usuarios/:idUsuario')
  async findPedidosByUser(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    this.logger.log(`Buscando pedido de usuario ${idUsuario}`)
    return await this.pedidosService.findByUsuario(idUsuario)
  }

  @Post()
  @HttpCode(201)
  create(@Body() createPedidoDto: CreatePedidoDto) {
    this.logger.log(`Creando pedido ${JSON.stringify(createPedidoDto)}`)
    return this.pedidosService.create(createPedidoDto)
  }

  @Put(':id')
  update(
    @Param('id', IdValidatePipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    this.logger.log(
      `Actualizando pedido con id ${id} y ${JSON.stringify(updatePedidoDto)}`,
    )

    return this.pedidosService.update(id, updatePedidoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', IdValidatePipe) id: string) {
    this.logger.log(`Eliminando pedido con id ${id}`)
    return this.pedidosService.remove(id)
  }
}
