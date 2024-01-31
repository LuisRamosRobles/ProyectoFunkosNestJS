import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { WsocketModel } from './models/wsocket.model'
import { ResponseFunkoDto } from '../funkos/dto/response-funko.dto'

const ENDPOINT: string = `/ws/${process.env.API_VERSION || 'v1'}/funkos`

@WebSocketGateway({
  namespace: ENDPOINT,
})
export class FunkosWebsocketGateway {
  @WebSocketServer()
  private server: Server
  private readonly logger = new Logger(FunkosWebsocketGateway.name)

  constructor() {
    this.logger.log(`FunkosWebsocketGateway esta escuchando en ${ENDPOINT}.`)
  }

  //envía una notificación todos en el evento updates
  sendMessage(notificacion: WsocketModel<ResponseFunkoDto>) {
    this.server.emit('updates', notificacion)
  }

  private handleConnection(client: Socket) {
    // este método se ejecuta cuando un cliente se conecte al WebSocket
    console.log('Cliente conectado:', client.id)
    this.logger.debug('Cliente conectado:', client.id)
    this.server.emit('connection', 'Notificaciones de Update WebSocket: Funkos')
  }

  private handleDisconnect(client: Socket) {
    // este método se ejecuta cuando un cliente se desconecte del WebSocket
    console.log('Cliente desconectado:', client.id)
    this.logger.debug('Cliente desconectado:', client.id)
  }

  @SubscribeMessage('updateFunko') // me suscribo al evento que quiero para escuchar
  private handleUpdateProduct(cliente: Socket, data: any) {
    const notificacion = {
      message: 'Se ha actualizado un funko',
      data: data,
    }

    this.server.emit('updates', notificacion)
  }
}
