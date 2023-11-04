import { useQuery } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_PARTYKIT_HOST;

export const useRoomGenerator = () =>
  useQuery({
    queryKey: ['generate'],
    queryFn: async () => {
      const result = await fetch(BASE_URL + '/generate');
      return result.json() as Promise<{ generated: string }>;
    },
  });

export const useJoinRoom = (room: string) =>
  useQuery({
    queryKey: ['join', room],
    queryFn: async ({ queryKey }) => {
      if (!room) {
        return null;
      }

      const [, roomId] = queryKey;
      const result = await fetch(BASE_URL + '/party/' + roomId);
      const data = (await result.json()) as { connections: number };

      if (data.connections > 2) {
        return null;
      }

      return data;
    },
  });

export const useGenerateAndJoinRoom = () =>
  useQuery({
    queryKey: ['generateAndJoin'],
    queryFn: async () => {
      const generationResult = await fetch(BASE_URL + '/generate');
      const room = (await generationResult.json()).generated as string;
      const roomResult = await fetch(BASE_URL + '/party/' + room);
      const roomConnections = (await roomResult.json()).connections as number;

      return { room, connections: roomConnections };
    },
  });
