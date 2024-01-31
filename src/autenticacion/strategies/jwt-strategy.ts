import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AutenticacionService } from '../autenticacion.service'
import { Injectable } from "@nestjs/common";
import { Usuario } from "../../usuarios/entities/usuario.entity";
@Injectable()
export class JwtAutenticacionStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly autenticacionService: AutenticacionService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      secretOrKey: Buffer.from(
        process.env.TOKEN_SECRET ||
          'Silencio_siempre_Ecos_susurran_ensueños_secretos_ocultos',
        'utf-8',
      ).toString('base64'),
    })
  }

  async validate(payload: Usuario) {
    const id = payload.id
    return await this.autenticacionService.validateUser(id)
  }

