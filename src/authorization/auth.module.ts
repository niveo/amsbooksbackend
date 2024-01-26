import { Module } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthConfig, JwtStrategy, JwtService, AuthService],
  exports: [JwtService, AuthService],
})
export class AuthModule {}
