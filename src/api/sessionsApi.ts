import { apiClient } from './client';
import { SessionItem, SessionStatus } from '../types';

export const sessionsApi = {
  async getAll(params?: { caseId?: string; status?: string }): Promise<SessionItem[]> {
    const query = new URLSearchParams();
    if (params?.caseId) query.set('caseId', params.caseId);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return apiClient<SessionItem[]>(`/counsellor/sessions${qs ? `?${qs}` : ''}`);
  },

  async schedule(sessionData: Omit<SessionItem, 'id' | 'status'>): Promise<SessionItem> {
    return apiClient<SessionItem>('/counsellor/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  async updateStatus(
    sessionId: string,
    status: SessionStatus,
    completionNotes?: string,
    nextActionPlan?: string,
    authorName?: string
  ): Promise<SessionItem> {
    return apiClient<SessionItem>(`/counsellor/sessions/${sessionId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, completionNotes, nextActionPlan, authorName }),
    });
  },

  async reschedule(sessionId: string, date: string, time: string): Promise<SessionItem> {
    return apiClient<SessionItem>(`/counsellor/sessions/${sessionId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ date, time }),
    });
  },
};

export default sessionsApi;
