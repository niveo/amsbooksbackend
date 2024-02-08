import { Module } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthConfig, JwtStrategy, JwtService, AuthService, JwtAuthGuard],
  exports: [JwtService, AuthService],
})
export class AuthModule {}
