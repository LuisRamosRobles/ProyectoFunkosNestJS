import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { PedidosOrderByValues } from '../pedidos.service'

@Injectable()
export class OrderbyValidatePipe implements PipeTransform {
  transform(value: any) {
    value = value || PedidosOrderByValues[0]
    if (!PedidosOrderByValues.includes(value)) {
      throw new BadRequestException(
        `El campo especificado para ordenar no es válido: ${PedidosOrderByValues.join(
          ', ',
        )}`,
      )
    }
    return value
  }
}
