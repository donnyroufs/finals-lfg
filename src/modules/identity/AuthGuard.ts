import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';
import { User } from './User';

@Injectable()
export class AuthGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToWs().getClient().handshake.auth.token;
    console.count('called authguard');

    try {
      const decoded = jwt.verify(
        token,
        Buffer.from(process.env.AUTH_PUBLIC_KEY, 'base64').toString('ascii'),
        {
          issuer: process.env.AUTH_ISSUES_BASE_URL,
          audience: process.env.AUTH_AUDIENCE,
          algorithms: ['RS256'],
        },
      );

      const user: User = {
        id: decoded['userId'],
        email: decoded['email'],
      };
      context.switchToWs().getData()!.user = user;

      return true;
    } catch (err) {
      throw new WsException((err as Error).message);
    }
  }
}
