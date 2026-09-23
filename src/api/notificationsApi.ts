import { apiClient } from './client';

export const notificationsApi = {
  async markRead(id: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/counsellor/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async markAllRead(): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>('/counsellor/notifications/read-all', {
      method: 'POST',
    });
  },
};

export default notificationsApi;
