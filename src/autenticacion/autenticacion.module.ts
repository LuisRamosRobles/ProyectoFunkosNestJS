import { Module } from '@nestjs/common'
import { AutenticacionService } from './autenticacion.service'
import { AutenticacionController } from './autenticacion.controller'
import { JwtModule } from '@nestjs/jwt'
import * as process from 'process'
import { PassportModule } from '@nestjs/passport'
import { UsuariosModule } from '../usuarios/usuarios.module'

@Module({
  imports: [
    JwtModule.register({
      secret: Buffer.from(
        process.env.JWT_SECRET ||
          'Silencio_siempre_Ecos_susurran_ensueños_secretos_ocultos',
        'utf8',
      ).toString('base64'),
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES) || 3600, // Tiempo de expiracion
        algorithm: 'HS512', // Algoritmo de encriptación
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsuariosModule,
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
})
export class AutenticacionModule {}
