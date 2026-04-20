import { IAuthRepository } from '../repositories/IAuthRepository';
import { AuthResponse } from '../entities/User';

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(name: string, email: string, password: string): Promise<AuthResponse> {
    return await this.authRepository.register(name, email, password);
  }
}
