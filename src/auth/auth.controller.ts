import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';
import { Public } from '../common/decorators/public.decorator/public.decorator';
import { RegisterDto } from './dto/register.dto/register.dto';
import { AuthService, User } from './auth.service';

type AuthenticatedRequest = ExpressRequest & {
  user: User;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Créer un compte utilisateur' })
  @ApiResponse({ status: 201, description: 'Compte créé' })
  @ApiResponse({ status: 400, description: 'Email invalide' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email);
  }

  @ApiSecurity('api-key')
  @Get('me')
  @ApiOperation({ summary: 'Récupérer son profil' })
  @ApiResponse({ status: 200, description: 'Profil récupéré' })
  @ApiResponse({ status: 401, description: 'Clé API absente' })
  @ApiResponse({ status: 403, description: 'Clé API invalide' })
  getMe(@Request() request: AuthenticatedRequest) {
    return this.authService.getMe(request.user.apiKey);
  }

  @ApiSecurity('api-key')
  @Post('regenerate-key')
  @ApiOperation({ summary: 'Régénérer sa clé API' })
  @ApiResponse({ status: 201, description: 'Nouvelle clé générée' })
  regenerateKey(@Request() request: AuthenticatedRequest) {
    return this.authService.regenerateKey(request.user.apiKey);
  }

  @ApiSecurity('api-key')
  @Delete('account')
  @HttpCode(204)
  @ApiOperation({ summary: 'Supprimer son compte' })
  @ApiResponse({ status: 204, description: 'Compte supprimé' })
  deleteAccount(@Request() request: AuthenticatedRequest): void {
    this.authService.deleteAccount(request.user.apiKey);
  }
}