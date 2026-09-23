import { apiClient } from './client';
import { CaseItem, CaseStatus, InterventionStage, CaseNote, SessionItem, FollowUpItem } from '../types';

export const casesApi = {
  async getAll(params?: { search?: string; status?: string; priority?: string; category?: string }): Promise<CaseItem[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.priority && params.priority !== 'all') query.set('priority', params.priority);
    if (params?.category && params.category !== 'all') query.set('category', params.category);

    const qs = query.toString();
    return apiClient<CaseItem[]>(`/counsellor/cases${qs ? `?${qs}` : ''}`);
  },

  async getById(id: string): Promise<{ case: CaseItem; sessions: SessionItem[]; notes: CaseNote[]; followUps?: FollowUpItem[] }> {
    return apiClient(`/counsellor/cases/${id}`);
  },

  async create(data: Partial<CaseItem>): Promise<CaseItem> {
    return apiClient<CaseItem>('/counsellor/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(caseId: string, status: CaseStatus, stage?: InterventionStage): Promise<CaseItem> {
    return apiClient<CaseItem>(`/counsellor/cases/${caseId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, stage }),
    });
  },

  async updateStage(caseId: string, stage: InterventionStage): Promise<CaseItem> {
    return apiClient<CaseItem>(`/counsellor/cases/${caseId}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage }),
    });
  },

  // Notes
  async getNotes(caseId?: string): Promise<CaseNote[]> {
    const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : '';
    return apiClient<CaseNote[]>(`/counsellor/notes${query}`);
  },

  async addNote(note: Omit<CaseNote, 'id'>): Promise<CaseNote> {
    return apiClient<CaseNote>('/counsellor/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  },

  async editNote(noteId: string, title: string, content: string): Promise<CaseNote> {
    return apiClient<CaseNote>(`/counsellor/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
    });
  },
};

export default casesApi;
