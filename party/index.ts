import type * as Party from 'partykit/server';

export default class Server implements Party.Server {
  #connections: Set<string> = new Set();

  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext): void {
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`,
    );

    conn.send(
      JSON.stringify({
        type: 'connected',
        data: [...this.#connections.values()],
      }),
    );

    this.#connections.add(conn.id);
    this.party.broadcast(
      JSON.stringify({
        data: conn.id,
        type: 'peerConnected',
      }),
      [conn.id],
    );
  }

  onClose(conn: Party.Connection): void {
    this.#connections.delete(conn.id);
    this.party.broadcast(
      JSON.stringify({
        data: conn.id,
        type: 'peerDisconnected',
      }),
    );
  }

  onMessage(message: string, sender: Party.Connection): void {
    let jsonMsg: object | undefined;

    try {
      const parsedMsg = JSON.parse(message);
      if (
        'type' in parsedMsg &&
        typeof parsedMsg.type === 'string' &&
        'data' in parsedMsg &&
        typeof parsedMsg.data === 'object'
      ) {
        jsonMsg = parsedMsg;
      }
    } catch {
      console.debug('[ERROR] message is not a json string', message);
    }

    this.party.broadcast(jsonMsg ? JSON.stringify({ ...jsonMsg, senderId: sender.id }) : message, [
      sender.id,
    ]);
  }
}

Server satisfies Party.Worker;
