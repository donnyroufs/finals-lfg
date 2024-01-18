import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GUID } from 'src/shared-kernel/ddd/GUID';

export type User = {
  id: string;
  email: string;
  contestantId: GUID;
};

export const User = createParamDecorator((_, ctx: ExecutionContext): User => {
  const { user } = ctx.switchToWs().getData();
  return user;
});
