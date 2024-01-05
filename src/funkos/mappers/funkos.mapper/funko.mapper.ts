import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Funko } from '../../entities/funko.entity'
import { CreateFunkoDto } from '../../dto/create-funko.dto'
import { UpdateFunkoDto } from '../../dto/update-funko.dto'

@Injectable()
export class FunkosMapper {
  mapCreateDtotoEntity(createFunkoDto: CreateFunkoDto): Funko {
    return plainToClass(Funko, createFunkoDto)
  }

  mapUpdateDtotoEntity(updateFunkoDto: UpdateFunkoDto): Funko {
    return plainToClass(Funko, updateFunkoDto)
  }
}
