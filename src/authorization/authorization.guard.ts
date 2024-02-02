import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
  }
}
