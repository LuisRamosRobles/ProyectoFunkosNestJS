import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  Matches,
} from 'class-validator'

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'El campo nombre no puede estar vacío' })
  nombre: string

  @IsNotEmpty({ message: 'El campo apellido no puede estar vacío' })
  apellidos: string

  @IsNotEmpty({ message: 'El campo username no puede estar vacío' })
  username: string

  @IsEmail({ message: 'El campo email no es válido' })
  @IsNotEmpty({ message: 'El campo email no puede estar vacío' })
  email: string

  @IsArray({ message: 'El campo roles debe ser un array' })
  @ArrayNotEmpty({ message: 'El campo roles no puede estar vacío' })
  roles: string[]

  @IsNotEmpty({ message: 'El campo password no puede estar vacío' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'El campo password no es válido, debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  })
  password: string
}
