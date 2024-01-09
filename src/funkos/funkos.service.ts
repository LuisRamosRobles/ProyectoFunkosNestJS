import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { Funko } from './entities/funko.entity'
import { FunkosMapper } from './mappers/funkos.mapper/funko.mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Categoria } from '../categorias/entities/categoria.entity'

@Injectable()
export class FunkosService {
  private readonly logger: Logger = new Logger(FunkosService.name)

  constructor(
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly funkoMapper: FunkosMapper,
  ) {}

  async findAll(): Promise<Funko[]> {
    this.logger.log('Obteniendo todos los funkos.')
    return this.funkoRepository.find()
  }

  async findOne(id: number) {
    this.logger.log(`Obteniendo el funko con ID: ${id}`)
    const found = await this.funkoRepository.findOneBy({ id })

    if (!found) {
      throw new NotFoundException(
        `El Funko con ID (${id}) no ha sido encontrado.`,
      )
    }

    return found
  }
  async create(createFunkoDto: CreateFunkoDto): Promise<Funko> {
    this.logger.log('Creando un nuevo Funko.')
    const categoria = await this.existsCategoria(createFunkoDto.categoria)
    const nuevoFunko = this.funkoMapper.mapCreateDtotoEntity(
      createFunkoDto,
      categoria,
    )
    return this.funkoRepository.save(nuevoFunko)
  }
  async update(id: number, updateFunkoDto: UpdateFunkoDto) {
    this.logger.log(`Actualizando el funko con ID: ${id}`)
    const foundFunko = await this.existsFunko(id)
    let categoria: Categoria
    if (updateFunkoDto.categoria) {
      categoria = await this.existsCategoria(updateFunkoDto.categoria)
    }
    const updateFunko = this.funkoRepository.save({
      ...foundFunko,
      ...updateFunkoDto,
      categoria: categoria ? categoria : foundFunko.categoria,
    })

    return updateFunko
  }

  async remove(id: number) {
    this.logger.log(`Eliminando el funko con ID: ${id}`)
    const foundIndex = await this.existsFunko(id)
    return this.funkoRepository.remove(foundIndex)
  }

  public async existsCategoria(nombreCategoria: string): Promise<Categoria> {
    const categoria = await this.categoriaRepository
      .createQueryBuilder()
      .where('LOWER(nombre) = LOWER(:nombre)', {
        nombre: nombreCategoria.toLowerCase(),
      })
      .getOne()
    if (!categoria) {
      this.logger.log(
        `No existe ninguna categoria con el siguiente nombre ${nombreCategoria}`,
      )
      throw new BadRequestException(
        `No existe ninguna categoria con el siguiente nombre ${nombreCategoria}`,
      )
    }

    return categoria
  }

  public async existsFunko(id: number): Promise<Funko> {
    const product = await this.funkoRepository.findOneBy({ id })

    if (!product) {
      this.logger.log(`El Funko con el ID(${id}) no existe.`)
      throw new NotFoundException(`El Funko con el ID(${id}) no existe.`)
    }

    return product
  }
}
