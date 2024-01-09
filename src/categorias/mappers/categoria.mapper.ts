import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { CreateCategoriaDto } from '../dto/create-categoria.dto'
import { Categoria } from '../entities/categoria.entity'
import { UpdateCategoriaDto } from '../dto/update-categoria.dto'

@Injectable()
export class CategoriaMapper {
  mapCreateDtotoEntity(createCategoriaDto: CreateCategoriaDto): Categoria {
    return plainToClass(Categoria, createCategoriaDto)
  }

  mapUpdateDtotoEntity(updateCategoriaDto: UpdateCategoriaDto): Categoria {
    return plainToClass(Categoria, updateCategoriaDto)
  }
}
