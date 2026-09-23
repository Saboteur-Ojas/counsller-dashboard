import { apiClient, setAuthToken, clearAuthToken } from './client';
import { CounsellorUser } from '../types';

export interface CounsellorAuthResponse {
  success: boolean;
  token: string;
  user: CounsellorUser;
  message?: string;
}

export const authApi = {
  async login(emailOrId: string, password: string): Promise<CounsellorAuthResponse> {
    const res = await apiClient<CounsellorAuthResponse>('/counsellor/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrId, password }),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async register(data: Partial<CounsellorUser> & { password?: string }): Promise<CounsellorAuthResponse> {
    const res = await apiClient<CounsellorAuthResponse>('/counsellor/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async getMe(): Promise<CounsellorUser> {
    const res = await apiClient<any>('/counsellor/auth/me');
    return res.user || res;
  },

  async updateProfile(updates: Partial<CounsellorUser>): Promise<{ success: boolean; user: CounsellorUser }> {
    return apiClient<{ success: boolean; user: CounsellorUser }>('/counsellor/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  logout(): void {
    clearAuthToken();
  },
};

export default authApi;
