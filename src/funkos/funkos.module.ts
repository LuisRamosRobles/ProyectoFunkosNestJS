import { Module } from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { FunkosController } from './funkos.controller'
import { FunkosMapper } from './mappers/funkos.mapper/funko.mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Funko } from './entities/funko.entity'
import { Categoria } from '../categorias/entities/categoria.entity'
import { WebsocketsModule } from '../websockets/websockets.module'
import { StorageModule } from '../storage/storage.module'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    TypeOrmModule.forFeature([Funko]),
    TypeOrmModule.forFeature([Categoria]),
    StorageModule,
    WebsocketsModule,
    CacheModule.register(),
  ],
  controllers: [FunkosController],
  providers: [FunkosService, FunkosMapper],
})
export class FunkosModule {}
