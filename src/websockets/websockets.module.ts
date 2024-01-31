import { Module } from '@nestjs/common'
import { FunkosWebsocketGateway } from './funkos-websocket.gateway'

@Module({
  providers: [FunkosWebsocketGateway],
  exports: [FunkosWebsocketGateway],
})
export class WebsocketsModule {}
