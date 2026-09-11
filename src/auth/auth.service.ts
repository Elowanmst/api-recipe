import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../storage/storage.service';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  apiKey: string;
  createdAt: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly storage: StorageService) {}

  register(email: string): { apiKey: string } {
    const users = this.storage.read<User[]>('users.json');

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (existingUser) {
      throw new ConflictException('Cet email existe déjà');
    }

    const user: User = {
      id: uuidv4(),
      email,
      role: 'user',
      apiKey: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    this.storage.write<User[]>('users.json', users);

    return {
      apiKey: user.apiKey,
    };
  }

  findByApiKey(apiKey: string): User | undefined {
    const users = this.storage.read<User[]>('users.json');

    return users.find((user) => user.apiKey === apiKey);
  }

  getMe(apiKey: string) {
    const user = this.findByApiKey(apiKey);

    if (!user) {
      throw new UnauthorizedException('Clé API invalide');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  regenerateKey(apiKey: string): { apiKey: string } {
    const users = this.storage.read<User[]>('users.json');
    const user = users.find((item) => item.apiKey === apiKey);

    if (!user) {
      throw new UnauthorizedException('Clé API invalide');
    }

    user.apiKey = uuidv4();
    this.storage.write<User[]>('users.json', users);

    return {
      apiKey: user.apiKey,
    };
  }

  deleteAccount(apiKey: string): void {
    const users = this.storage.read<User[]>('users.json');
    const index = users.findIndex((user) => user.apiKey === apiKey);

    if (index === -1) {
      throw new UnauthorizedException('Clé API invalide');
    }

    users.splice(index, 1);
    this.storage.write<User[]>('users.json', users);
  }
}