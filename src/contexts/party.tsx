import usePartySocket from 'partysocket/react';
import { createContext, useContext, PropsWithChildren, useState } from 'react';

import type PartySocket from 'partysocket';
import type { StoreType } from 'polotno/model/store';

import type { CursorPosition } from './party.types';
import { useConnection, useCursorUpdates, useEditorUpdates } from './party.hooks';

export const PartyContext = createContext<PartyContextType>({
  store: undefined,
  socket: undefined,
  cursorPos: new Map(),
});

type PartyContextType = {
  store?: StoreType;
  socket?: PartySocket;
  cursorPos: Map<string, CursorPosition>;
};

type PartyProps = {
  store: StoreType;
};

export const PartyContextProvider = ({ store, children }: PropsWithChildren<PartyProps>) => {
  const socket = usePartySocket({
    room: 'home',
    host: 'https://localhost:1999',
  });

  const [cursorPos, setCursorPos] = useState<Map<string, CursorPosition>>(new Map());

  // Photo Editor Hooks
  useEditorUpdates(socket, store)();

  // Real-Time Update Hooks
  useConnection(socket, cursorPos, setCursorPos);
  useCursorUpdates(socket, cursorPos, setCursorPos);

  return (
    <PartyContext.Provider value={{ socket, store, cursorPos }}>{children}</PartyContext.Provider>
  );
};

export const usePartyContext = () => useContext(PartyContext);
