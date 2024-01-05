import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  HttpCode,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'

@Controller('funkos')
export class FunkosController {
  private readonly logger: Logger = new Logger(FunkosController.name)
  constructor(private readonly funkosService: FunkosService) {}

  @Get()
  async findAll() {
    this.logger.log('Obteniendo todos los Funkos.')
    return await this.funkosService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    this.logger.log(`Obteniendo Funko con id: ${id}`)
    return await this.funkosService.findOne(+id)
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  async create(@Body() createFunkoDto: CreateFunkoDto) {
    this.logger.log('Creando Funko.')
    return await this.funkosService.create(createFunkoDto)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: number,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    this.logger.log(`Actualizando Funko con id: ${id}`)
    return await this.funkosService.update(+id, updateFunkoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number) {
    this.logger.log(`Eliminando producto con id: ${id}`)
    return await this.funkosService.remove(+id)
  }
}
