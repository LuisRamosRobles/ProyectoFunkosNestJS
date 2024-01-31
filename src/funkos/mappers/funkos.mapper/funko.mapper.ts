import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Funko } from '../../entities/funko.entity'
import { CreateFunkoDto } from '../../dto/create-funko.dto'
import { Categoria } from '../../../categorias/entities/categoria.entity'
import { ResponseFunkoDto } from '../../dto/response-funko.dto'

@Injectable()
export class FunkosMapper {
  mapCreateDtotoEntity(
    createFunkoDto: CreateFunkoDto,
    categoria: Categoria,
  ): Funko {
    const funko = plainToClass(Funko, createFunkoDto)
    funko.categoria = categoria

    return funko
  }

  mapResponseDto(funko: Funko): ResponseFunkoDto {
    const dto = plainToClass(ResponseFunkoDto, funko)
    if (funko.categoria) {
      dto.categoria = funko.categoria.nombre
    } else {
      dto.categoria = null
    }

    return dto
  }
}
