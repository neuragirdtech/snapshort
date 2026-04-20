import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User, AuthResponse } from '../../domain/entities/User';
import { AuthApi } from '../api/AuthApi';

export class AuthRepositoryImpl implements IAuthRepository {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      return await AuthApi.login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      return await AuthApi.register(name, email, password);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Implement token removal
  }

  async getCurrentUser(): Promise<User | null> {
    // Implement check for stored token
    return null;
  }
}
