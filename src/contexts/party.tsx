import usePartySocket from 'partysocket/react';
import { createContext, useContext, PropsWithChildren, useState } from 'react';

import type PartySocket from 'partysocket';
import type { StoreType } from 'polotno/model/store';

import type { CursorPosition } from './party.types';
import { useConnection, useCursorUpdates, useEditorUpdates } from './party.hooks';

export const PartyContext = createContext<PartyContextType>({
  room: '',
  store: undefined,
  socket: undefined,
  cursorPos: new Map(),
});

type PartyContextType = {
  room: string;
  store?: StoreType;
  socket?: PartySocket;
  cursorPos: Map<string, CursorPosition>;
};

type PartyProps = {
  room: string;
  store: StoreType;
};

export const PartyContextProvider = ({ store, room, children }: PropsWithChildren<PartyProps>) => {
  const socket = usePartySocket({
    room,
    host: import.meta.env.VITE_PARTYKIT_HOST,
  });

  const [cursorPos, setCursorPos] = useState<Map<string, CursorPosition>>(new Map());

  // Photo Editor Hooks
  useEditorUpdates(socket, store);

  // Real-Time Update Hooks
  useConnection(socket, cursorPos, setCursorPos);
  useCursorUpdates(socket, cursorPos, setCursorPos);

  return (
    <PartyContext.Provider value={{ socket, store, cursorPos, room }}>
      {children}
    </PartyContext.Provider>
  );
};

export const usePartyContext = () => useContext(PartyContext);
