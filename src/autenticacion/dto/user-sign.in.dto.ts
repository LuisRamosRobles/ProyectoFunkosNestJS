import { IsNotEmpty, IsString } from 'class-validator'

export class UserSignDto {
  @IsNotEmpty({ message: 'El campo Username no puede estar vacío' })
  @IsString({ message: 'El campo Username no es válido' })
  username: string

  @IsNotEmpty({ message: 'El campo Password no puede estar vacío' })
  @IsString({ message: 'El campo Password no es válido' })
  password: string
}
