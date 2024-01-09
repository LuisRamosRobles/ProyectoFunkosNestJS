import { Module } from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CategoriasController } from './categorias.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Categoria } from './entities/categoria.entity'
import { CategoriaMapper } from './mappers/categoria.mapper'

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriaMapper],
})
export class CategoriasModule {}
