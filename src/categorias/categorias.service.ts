import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Categoria } from './entities/categoria.entity'
import { Repository } from 'typeorm'
import { CategoriaMapper } from './mappers/categoria.mapper'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class CategoriasService {
  private readonly logger: Logger = new Logger(CategoriasService.name)

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly categoriaMapper: CategoriaMapper,
  ) {}

  async findAll(): Promise<Categoria[]> {
    this.logger.log('Obteniendo todos las categorias.')
    return await this.categoriaRepository.find()
  }

  async findOne(id: string): Promise<Categoria> {
    this.logger.log(`Obteniendo la categoria con el ID: ${id}`)
    const found = await this.categoriaRepository.findOneBy({ id })

    if (!found) {
      throw new NotFoundException(
        `La categoria con ID (${id}) no ha sido encontrada.`,
      )
    }

    return found
  }

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    this.logger.log('Creando nueva categoria.')
    const nuevaCategoria =
      await this.categoriaMapper.mapCreateDtotoEntity(createCategoriaDto)

    return await this.categoriaRepository.save({
      ...nuevaCategoria,
      id: uuidv4(),
    })
  }

  async update(
    id: string,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    this.logger.log(`Actualizando el funko con ID: ${id}`)
    const updateCategoria = await this.findOne(id)

    return await this.categoriaRepository.save({
      ...updateCategoria,
      ...updateCategoriaDto,
    })
  }

  async remove(id: string): Promise<Categoria> {
    this.logger.log(`Eliminando categoria con ID: ${id}`)
    const removeCategoria = await this.findOne(id)
    return await this.categoriaRepository.remove(removeCategoria)
  }
}
