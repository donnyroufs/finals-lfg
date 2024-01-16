import { Socket, io } from 'socket.io-client';
import { User } from 'src/modules/identity/User';
import { AuthGuard } from 'src/modules/identity/AuthGuard';
import { mock } from 'jest-mock-extended';

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

export function createAuthGuardStub(user: User): AuthGuard {
  return mock<AuthGuard>({
    canActivate: async (context): Promise<boolean> => {
      context.switchToWs().getData().user = user;
      return true;
    },
  });
}
