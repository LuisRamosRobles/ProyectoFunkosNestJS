import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { Funko } from './entities/funko.entity'
import { FunkosMapper } from './mappers/funkos.mapper/funko.mapper'

@Injectable()
export class FunkosService {
  private readonly funkos: Funko[] = [new Funko(1, 'Batman', 'SuperHeroes')]

  private readonly logger: Logger = new Logger(FunkosService.name)

  constructor(private readonly funkoMapper: FunkosMapper) {}

  async findAll(): Promise<Funko[]> {
    this.logger.log('Obteniendo todos los funkos.')
    return this.funkos
  }

  async findOne(id: number) {
    this.logger.log(`Obteniendo el funko con ID: ${id}`)
    const found = await this.funkos.find((funko) => funko.id === id)

    if (!found) {
      throw new NotFoundException(
        `El Funko con ID (${id}) no ha sido encontrado.`,
      )
    }

    return found
  }
  async create(createFunkoDto: CreateFunkoDto): Promise<Funko> {
    this.logger.log('Creando un nuevo Funko.')
    const nuevoFunko =
      await this.funkoMapper.mapCreateDtotoEntity(createFunkoDto)
    nuevoFunko.id = this.funkos.length + 1
    this.funkos.push(nuevoFunko)
    return nuevoFunko
  }
  async update(id: number, updateFunkoDto: UpdateFunkoDto) {
    this.logger.log(`Actualizando el funko con ID: ${id}`)
    const foundIndex = await this.funkos.findIndex((funko) => funko.id === id)
    if (foundIndex === -1) {
      throw new NotFoundException(
        'El Funko con ID (${id}) no ha sido encontrado.',
      )
    }
    const existFunko = this.funkos[foundIndex]
    updateFunkoDto.id = existFunko.id
    const updateFunko = this.funkoMapper.mapUpdateDtotoEntity(updateFunkoDto)
    this.funkos[foundIndex] = updateFunko
    return await updateFunko
  }

  async remove(id: number) {
    this.logger.log(`Eliminando el funko con ID: ${id}`)
    const foundIndex = await this.funkos.findIndex((funko) => funko.id === id)
    if (foundIndex === -1) {
      throw new NotFoundException(
        'El Funko con ID (${id}) no ha sido encontrado.',
      )
    }
    return this.funkos.splice(foundIndex, 1)
  }
}
