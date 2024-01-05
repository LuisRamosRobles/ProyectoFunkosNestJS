import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateFunkoDto {
  @IsString({ message: 'El nombre no puede ser un número.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vació.' })
  @Length(5, 50, { message: 'El nombre debe tener entre 5 y 50 caracteres.' })
  nombre: string

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoria no puede estar vacio.' })
  @Length(5, 50, {
    message: 'El nombre de la categoria debe tener entre 5 y 50 caracteres.',
  })
  categoria: string
}