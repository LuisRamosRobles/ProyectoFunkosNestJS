import { Injectable } from '@nestjs/common'
import { CreateAutenticacionDto } from './dto/user-sign.in.dto'
import { UserSignUpDto } from './dto/user-sign.up.dto'

@Injectable()
export class AutenticacionService {
  create(createAutenticacionDto: CreateAutenticacionDto) {
    return 'This action adds a new autenticacion'
  }

  findAll() {
    return `This action returns all autenticacion`
  }

  findOne(id: number) {
    return `This action returns a #${id} autenticacion`
  }

  update(id: number, updateAutenticacionDto: UserSignUpDto) {
    return `This action updates a #${id} autenticacion`
  }

  remove(id: number) {
    return `This action removes a #${id} autenticacion`
  }
}
