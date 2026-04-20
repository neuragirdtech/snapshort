import axios from 'axios';
import { AuthResponse, User } from '../../domain/entities/User';
import { ApiConfig } from '../../core/constants/api';

export const AuthApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    if (ApiConfig.USE_MOCK) {
      await new Promise(resolve => setTimeout(() => resolve(true), 1000));
      return {
        user: { id: 'u_1', email, name: 'Demo User' },
        token: 'mock_token_123',
      };
    }
    const response = await axios.post(`${ApiConfig.BASE_URL}/auth/login`, { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    if (ApiConfig.USE_MOCK) {
      await new Promise(resolve => setTimeout(() => resolve(true), 1000));
      return {
        user: { id: 'u_1', email, name },
        token: 'mock_token_123',
      };
    }
    const response = await axios.post(`${ApiConfig.BASE_URL}/auth/register`, { name, email, password });
    return response.data;
  },
};
