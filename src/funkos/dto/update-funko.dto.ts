import { PartialType } from '@nestjs/mapped-types'
import { CreateFunkoDto } from './create-funko.dto'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class UpdateFunkoDto extends PartialType(CreateFunkoDto) {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacio.' })
  @Length(5, 50, {
    message: 'El nombre debe tener entre 5 y 50 caracteres.',
  })
  nombre: string

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoria no puede estar vacio.' })
  @Length(5, 50, {
    message: 'El nombre de la categoria debe tener entre 5 y 50 caracteres.',
  })
  categoria: string //Nombre de la categoria no confundir con el id
}
