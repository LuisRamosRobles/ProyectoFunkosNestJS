import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { FunkosModule } from './funkos/funkos.module'
import { CategoriasModule } from './categorias/categorias.module'
import { StorageModule } from './storage/storage.module'
import { WebsocketsModule } from './websockets/websockets.module'
import { BbddModule } from './configuracion/bbdd/bbdd.module'
import { CacheModule } from '@nestjs/cache-manager'
import { PedidosModule } from './pedidos/pedidos.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    //Primero se carga la configuración de la base de datos y
    // que la misma esté disponible en el módulo raíz
    ConfigModule.forRoot(),

    BbddModule, //Configuración de la base de datos

    CacheModule.register(), //Configuración modulo caché

    //Se cargan los módulos de la aplicación
    FunkosModule,

    CategoriasModule,

    StorageModule,

    WebsocketsModule,

    PedidosModule,

    AutenticacionModule,

    UsuariosModule,
  ],
})
export class AppModule {}
