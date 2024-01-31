import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { StorageController } from './storage.controller'

@Module({
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService], //se exporta el servicio de storage para que los otros modulos lo puedan usar
})
export class StorageModule {}
