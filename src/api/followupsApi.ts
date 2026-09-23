import { apiClient } from './client';
import { FollowUpItem, FollowUpType } from '../types';

export const followupsApi = {
  async getAll(params?: { caseId?: string; status?: string }): Promise<FollowUpItem[]> {
    const query = new URLSearchParams();
    if (params?.caseId) query.set('caseId', params.caseId);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return apiClient<FollowUpItem[]>(`/counsellor/followups${qs ? `?${qs}` : ''}`);
  },

  async create(data: Omit<FollowUpItem, 'id' | 'status'>): Promise<FollowUpItem> {
    return apiClient<FollowUpItem>('/counsellor/followups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async complete(
    followUpId: string,
    outcomeNotes?: string,
    scheduleNext?: boolean,
    nextDate?: string,
    nextType?: FollowUpType,
    authorName?: string
  ): Promise<FollowUpItem> {
    return apiClient<FollowUpItem>(`/counsellor/followups/${followUpId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ outcomeNotes, scheduleNext, nextDate, nextType, authorName }),
    });
  },

  async reschedule(followUpId: string, followUpDate: string, followUpTime?: string): Promise<FollowUpItem> {
    return apiClient<FollowUpItem>(`/counsellor/followups/${followUpId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ followUpDate, followUpTime }),
    });
  },
};

export default followupsApi;
