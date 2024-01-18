import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';
import { User } from './User';
import { CreateRequestContext, EntityManager, MikroORM } from '@mikro-orm/core';
import { Contestant } from '../contestant/domain/Contestant';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly _em: EntityManager,
    private readonly orm: MikroORM,
  ) {}

  @CreateRequestContext()
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToWs().getClient().handshake.auth.token;

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

      const contestant = await this._em.findOne(Contestant, {
        userId: decoded['userId'],
      });
      const user: User = {
        id: decoded['userId'],
        email: decoded['email'],
        contestantId: contestant!.id,
      };
      context.switchToWs().getData()!.user = user;

      return true;
    } catch (err) {
      throw new WsException((err as Error).message);
    }
  }
}
