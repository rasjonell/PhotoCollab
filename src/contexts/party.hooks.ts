import { SetStateAction, useEffect } from 'react';
import { onPatch, applyPatch } from 'mobx-state-tree';

import type PartySocket from 'partysocket';

import { throttle } from '../utils/functions';

import type {
  BaseMsg,
  ConnectedMsg,
  CursorPosition,
  CurorsUpdatedMsg,
  PeerConnectedMsg,
  PeerDisconnectedMsg,
} from './party.types';
import { StoreType } from 'polotno/model/store';
import { IDisposer } from 'mobx-state-tree';

type State = Map<string, CursorPosition>;

export function useConnection(
  socket: PartySocket,
  state: State,
  setState: (val: SetStateAction<State>) => void,
): void {
  useEffect(() => {
    if (!socket) return;

    const onMessage = (evt: WebSocketEventMap['message']) => {
      const msgJson = JSON.parse(evt.data) as object;

      if (!('type' in msgJson && 'data' in msgJson)) return;

      switch ((msgJson as BaseMsg).type) {
        case 'connected':
          setState(
            new Map<string, CursorPosition>(
              (msgJson as ConnectedMsg).data.map((id) => [id, { x: 0, y: 0 }]),
            ),
          );
          break;

        case 'peerConnected':
          setState(new Map(state.set((msgJson as PeerConnectedMsg).data, { x: 0, y: 0 })));
          break;

        case 'peerDisconnected':
          state.delete((msgJson as PeerDisconnectedMsg).data);
          setState(new Map(state));
          break;

        default:
          break;
      }
    };

    socket.addEventListener('message', onMessage);

    return () => {
      socket.removeEventListener('message', onMessage);
    };
  }, [socket, state, setState]);
}

export function useCursorUpdates(
  socket: PartySocket,
  state: State,
  setState: (val: SetStateAction<State>) => void,
): void {
  useEffect(() => {
    const mouseMoveListener = throttle((e: MouseEvent) => {
      const msg = {
        type: 'cursorUpdated',
        data: { x: e.clientX, y: e.clientY },
      };

      socket.send(JSON.stringify(msg));
    });

    const onMouseMoveMessage = (evt: WebSocketEventMap['message']) => {
      const msg = JSON.parse(evt.data) as object;

      if (!('type' in msg && msg.type === 'cursorUpdated')) return;

      const parsedMsg = msg as CurorsUpdatedMsg;

      setState(new Map(state.set(parsedMsg.senderId, parsedMsg.data)));
    };

    socket.addEventListener('message', onMouseMoveMessage);
    document.addEventListener('mousemove', mouseMoveListener);

    return () => {
      socket.removeEventListener('message', onMouseMoveMessage);
      document.removeEventListener('mousemove', mouseMoveListener);
    };
  }, [socket, state, setState]);
}

let disposer: IDisposer | undefined;

function unlisten() {
  disposer?.();
  disposer = undefined;
}

function listen(store: StoreType, socket: PartySocket) {
  disposer = onPatch(store.pages, (patch) => {
    socket.send(JSON.stringify(patch));
  });
}

export function useEditorUpdates(socket: PartySocket, store: StoreType): void {
  useEffect(() => {
    if (socket && store) {
      const onMessage = (evt: WebSocketEventMap['message']) => {
        const msg = JSON.parse(evt.data as string);

        if ('type' in msg && 'data' in msg) return;

        unlisten();
        applyPatch(store.pages, msg);
        listen(store, socket);
      };

      if (typeof disposer === 'undefined') {
        listen(store, socket);
      }

      socket.addEventListener('message', onMessage);

      return () => {
        socket.removeEventListener('message', onMessage);
      };
    }
  }, [store, socket]);
}
