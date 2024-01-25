import { Module } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthConfig, JwtStrategy],
})
export class AuthModule {}
