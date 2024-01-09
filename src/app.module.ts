import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { FunkosModule } from './funkos/funkos.module'
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module'
import { CategoriasModule } from './categorias/categorias.module'
import * as process from 'process'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmCoreModule.forRoot({
      type: 'postgres', //El tipo de la base de datos (Postgre, mySQL, Mongo, ...)
      host: process.env.POSTGRES_HOST, //El nombre del servidor que aloje la base de datos
      port: parseInt(process.env.POSTGRES_PORT), //Puerto en el que se encontrara el servidor
      username: process.env.DATABASE_USER, //Usuario de la base de datos
      password: process.env.DATABASE_PASSWORD, //Contraseña del usuario
      database: process.env.POSTGRES_DATABASE, //Nombre de la base de datos
      autoLoadEntities: true, // Indica a TypeORM que busque automaticamente las clases que lleven el decorador @Entity
      entities: [`${__dirname}/**/*.entity{.ts,.js}`], //Las entidades que contendra la base de datos
      synchronize: true, //Preguntar por qué en su proyecto tiene un comparador
    }),

    FunkosModule,

    CategoriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
