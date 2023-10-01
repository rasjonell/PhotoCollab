import usePartySocket from 'partysocket/react';
import { WebSocketEventMap } from 'partysocket/ws';
import { IDisposer, applyPatch, onPatch } from 'mobx-state-tree';
import { createContext, useContext, PropsWithChildren, useEffect } from 'react';

import type PartySocket from 'partysocket';
import type { StoreType } from 'polotno/model/store';

type PartyContextType = {
  store?: StoreType;
  socket?: PartySocket;
};

type PartyProps = {
  store: StoreType;
};

export const PartyContext = createContext<PartyContextType>({
  store: undefined,
  socket: undefined,
});

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

export const PartyContextProvider = ({ store, children }: PropsWithChildren<PartyProps>) => {
  const socket = usePartySocket({
    room: 'home',
    host: 'https://localhost:1999',
  });

  useEffect(() => {
    if (socket && store) {
      const onMessage = (evt: WebSocketEventMap['message']) => {
        const msg = JSON.parse(evt.data as string);
        console.log('[PartyContext] Got Message:', msg);

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
  }, [store, socket, disposer]);

  return <PartyContext.Provider value={{ socket, store }}>{children}</PartyContext.Provider>;
};

export const usePartyContext = () => useContext(PartyContext);
