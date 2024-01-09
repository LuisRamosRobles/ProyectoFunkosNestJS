import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateCategoriaDto {
  @IsString({ message: 'El nombre de la categoria no puede ser un número.' })
  @IsNotEmpty({ message: 'El nombre de la categoria no puede ser vació.' })
  @Length(5, 50, {
    message: 'El nombre de la categoria debe tener entre 5 y 50 caracteres.',
  })
  nombre: string
}
