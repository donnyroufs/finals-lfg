import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export type User = {
  id: string;
  email: string;
};

export const User = createParamDecorator((_, ctx: ExecutionContext): User => {
  const { user } = ctx.switchToWs().getData();
  return user;
});
