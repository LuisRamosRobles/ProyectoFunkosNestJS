import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator'

export class UserSignUpDto {
  @IsNotEmpty({ message: 'El campo Nombre no puede estar vacío' })
  @IsString({ message: 'El Nombre introducido no es válido' })
  nombre: string

  @IsNotEmpty({ message: 'El campo Apellidos no puede estar vacío' })
  @IsString({ message: 'Los Apellidos introducidos no es válido' })
  apellidos: string

  @IsNotEmpty({ message: 'El campo Username no puede estar vacío' })
  @IsString({ message: 'El Username introducido no es válido' })
  username: string

  @IsEmail({}, { message: 'El Email introducido no es válido' })
  @IsNotEmpty({ message: 'El campo Email no puede estar vacío' })
  email: string

  @IsString({ message: 'La contraseña introducida no es válida' })
  @IsNotEmpty({ message: 'El campo Password no puede estar vacío' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password no es válido, debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  })
  password: string
}
