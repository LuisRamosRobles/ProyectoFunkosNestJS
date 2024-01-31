import { PartialType } from '@nestjs/mapped-types'
import { CreateUsuarioDto } from './create-usuario.dto'
import { IsOptional } from 'class-validator'

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  nombre: string

  @IsOptional()
  apellidos: string

  @IsOptional()
  username: string

  @IsOptional()
  email: string

  @IsOptional()
  roles: string[]

  @IsOptional()
  password: string

  @IsOptional()
  isDeleted: boolean
}
