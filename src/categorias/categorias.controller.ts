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
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, PaginateQuery } from 'nestjs-paginate'

@Controller('categorias')
@UseInterceptors(CacheInterceptor) //aquí se aplica el interceptor de la caché
export class CategoriasController {
  private readonly logger: Logger = new Logger(CategoriasController.name)
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  @CacheKey('all_categorias')
  @CacheTTL(30)
  async findAll(@Paginate() query: PaginateQuery) {
    this.logger.log('Obteniendo todas las categorias.')
    return await this.categoriasService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Obteniendo la categoria con ID: ${id}`)
    return await this.categoriasService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    this.logger.log('Creando categoria.')
    return await this.categoriasService.create(createCategoriaDto)
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    this.logger.log(`Actualizando categoria con ID: ${id}`)
    return await this.categoriasService.update(id, updateCategoriaDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Borrando categoria con ID: ${id}`)
    return await this.categoriasService.remove(id)
  }
}
