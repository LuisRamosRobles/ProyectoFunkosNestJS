import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { FunkosModule } from './funkos/funkos.module'
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module'
import { CategoriasModule } from './categorias/categorias.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmCoreModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: '12345',
      database: 'FunkosDB',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
    }),

    FunkosModule,

    CategoriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
