import { Logger, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as process from 'process'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        type: 'postgres', //El tipo de la base de datos (Postgre, mySQL, Mongo, ...)
        host: process.env.POSTGRES_HOST, //El nombre del servidor que aloje la base de datos
        port: parseInt(process.env.POSTGRES_PORT), //Puerto en el que se encontrara el servidor
        username: process.env.DATABASE_USER, //Usuario de la base de datos
        password: process.env.DATABASE_PASSWORD, //Contraseña del usuario
        database: process.env.POSTGRES_DATABASE, //Nombre de la base de datos
        autoLoadEntities: true, // Indica a TypeORM que busque automaticamente las clases que lleven el decorador @Entity
        entities: [`${__dirname}/**/*.entity{.ts,.js}`], //Las entidades que contendra la base de datos
        synchronize: true, //Esta parte indica que las entidades y la base de datos estarán sincronizadas
        logging: process.env.NODE_ENV === 'dev' ? 'all' : false, //Esta parte se pone para que se muestren los logs de las consultas
        retryAttempts: 5,
        connectionFactory: (connection) => {
          Logger.log('Postgres database connected', 'DatabaseModule')
          return connection
        },
      }),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: `mongodb://${process.env.DATABASE_USER}:${
          process.env.DATABASE_PASSWORD
        }@${process.env.MONGO_HOST}:${process.env.MONGO_PORT || 27017}/${
          process.env.MONGO_DATABASE
        }`,
        retryAttempts: 5,
        connectionFactory: (connection) => {
          Logger.log(
            `MongoDB readyState: ${connection.readyState}`,
            'DatabaseModule',
          )
          return connection
        },
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class BbddModule {}
