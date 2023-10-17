import type * as Party from 'partykit/server';

export default class Server implements Party.Server {
  #connections: Set<string> = new Set();
  #rooms: Map<string, number> = new Map();

  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection): void {
    const currentMemberCount = this.#rooms.get(this.party.id) ?? 0;

    conn.send(
      JSON.stringify({
        type: 'connected',
        data: Array.from(this.#connections),
      }),
    );

    this.#connections.add(conn.id);
    this.#rooms.set(this.party.id, currentMemberCount + 1);

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
    this.#rooms.set(this.party.id, (this.#rooms.get(this.party.id) ?? 1) - 1);

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

  onRequest(req: Party.Request): Response | Promise<Response> {
    const parts = req.url.split('/');
    const room = parts[parts.length - 1];
    return new Response(
      JSON.stringify({
        connections: this.#rooms.get(room) ?? 0,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }

  static async onFetch(req: Party.Request) {
    const parts = req.url.split('/');
    console.log(req.url);
    if (req.method !== 'GET' || parts.length !== 4 || parts[parts.length - 1] !== 'generate') {
      return new Response('Not Found', { status: 404 });
    }

    return new Response(
      JSON.stringify({
        generated: Math.random().toString(16).substring(2, 8),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
}

Server satisfies Party.Worker;
