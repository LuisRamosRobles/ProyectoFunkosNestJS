import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // Configuración de la versión de la API
  app.setGlobalPrefix(process.env.API_VERSION || 'v1')

  //Activando las validaciones de los body y los dto
  app.useGlobalPipes(new ValidationPipe())

  // Configuración del puerto de escucha
  await app.listen(process.env.API_PORT || 3000)
}
bootstrap().then(() =>
  console.log(
    `🟢 Servidor escuchando en puerto: ${
      process.env.API_PORT || 3000
    } y perfil: ${process.env.NODE_ENV} 🚀`,
  ),
)
