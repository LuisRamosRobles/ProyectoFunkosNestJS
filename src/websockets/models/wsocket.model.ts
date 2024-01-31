export class WsocketModel<T> {
  constructor(
    public entity: string,
    public type: TipoWebSocket,
    public data: T,
    public createdAt: Date,
  ) {}
}

export enum TipoWebSocket {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
