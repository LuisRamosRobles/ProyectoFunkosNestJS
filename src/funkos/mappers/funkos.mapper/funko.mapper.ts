import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Funko } from '../../entities/funko.entity'
import { CreateFunkoDto } from '../../dto/create-funko.dto'
//import { UpdateFunkoDto } from '../../dto/update-funko.dto'
import { Categoria } from '../../../categorias/entities/categoria.entity'

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
}
