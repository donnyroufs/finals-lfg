import { Socket, io } from 'socket.io-client';

export async function waitForEvent<TResult = any>(
  evt: string,
  socket: Socket,
): Promise<TResult> {
  return new Promise((res) => {
    socket.on(evt, (data: TResult) => {
      return res(data);
    });
  });
}

export function createClient(sockets: Socket[]): Socket {
  const socket = io('http://localhost:5000', { multiplex: false });
  sockets.push(socket);
  return socket;
}
