import { CreateUsuarioDto } from '../../usuarios/dto/create-usuario.dto'
import { UserSignUpDto } from '../dto/user-sign.up.dto'
import { Role } from '../../usuarios/entities/usuario-role.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AutenticacionMapper {
  mapToCreateDto(userSignUpDto: UserSignUpDto): CreateUsuarioDto {
    const createUsuarioDto = new CreateUsuarioDto()
    createUsuarioDto.nombre = userSignUpDto.nombre
    createUsuarioDto.apellidos = userSignUpDto.apellidos
    createUsuarioDto.username = userSignUpDto.username
    createUsuarioDto.email = userSignUpDto.email
    createUsuarioDto.password = userSignUpDto.password
    createUsuarioDto.roles = [Role.USER]
    return createUsuarioDto
  }
}
