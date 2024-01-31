import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ObjectId } from 'mongodb'

@Injectable()
export class IdValidatePipe implements PipeTransform {
  transform(value: any) {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException(
        'El id introducido no tiene el formato adecuado o no es valido.',
      )
    }
    return value
  }
}
