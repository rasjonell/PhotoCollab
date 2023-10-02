export type CursorPosition = {
  x: number;
  y: number;
};

export type BaseMsg = {
  type: string;
  data: object;
};

export type CurorsUpdatedMsg = {
  senderId: string;
  type: 'cursorUpdated';
  data: CursorPosition;
};

export type ConnectedMsg = {
  data: string[];
  type: 'connected';
};

export type PeerConnectedMsg = {
  data: string;
  type: 'peerConnected';
};

export type PeerDisconnectedMsg = {
  data: string;
  type: 'peerDisconnected';
};
