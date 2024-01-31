import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { PedidosOrderValues } from '../pedidos.service'

@Injectable()
export class OrderValidatePipe implements PipeTransform {
  transform(value: any) {
    value = value || PedidosOrderValues[0]
    if (!PedidosOrderValues.includes(value)) {
      throw new BadRequestException(
        `El orden especificado no es válido: ${PedidosOrderValues.join(',')}`,
      )
    }
    return value
  }
}
