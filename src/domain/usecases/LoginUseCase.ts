import { IAuthRepository } from '../repositories/IAuthRepository';
import { AuthResponse } from '../entities/User';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<AuthResponse> {
    return await this.authRepository.login(email, password);
  }
}
