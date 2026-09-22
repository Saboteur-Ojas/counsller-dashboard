import {
  CounsellorUser,
  CaseItem,
  SessionItem,
  FollowUpItem,
  CaseNote,
  ActivityItem,
  NotificationItem,
  CaseStatus,
  InterventionStage,
  SessionStatus,
  FollowUpType,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

const TOKEN_KEY = 'veersetu_counsellor_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'API request failed';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const counsellorApi = {
  // Auth
  async login(emailOrId: string, password: string): Promise<{ success: boolean; token: string; user: CounsellorUser }> {
    const res = await apiRequest<{ success: boolean; token: string; user: CounsellorUser }>('/api/counsellor/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrId, password }),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async register(data: Partial<CounsellorUser> & { password?: string }): Promise<{ success: boolean; token: string; user: CounsellorUser }> {
    const res = await apiRequest<{ success: boolean; token: string; user: CounsellorUser }>('/api/counsellor/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async getMe(): Promise<CounsellorUser> {
    return apiRequest<CounsellorUser>('/api/counsellor/auth/me');
  },

  async updateProfile(updates: Partial<CounsellorUser>): Promise<{ success: boolean; user: CounsellorUser }> {
    return apiRequest<{ success: boolean; user: CounsellorUser }>('/api/counsellor/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Overview
  async getOverview(): Promise<{
    cases: CaseItem[];
    sessions: SessionItem[];
    followUps: FollowUpItem[];
    caseNotes: CaseNote[];
    activities: ActivityItem[];
    notifications: NotificationItem[];
    unreadNotifCount: number;
  }> {
    return apiRequest('/api/counsellor/overview');
  },

  // Cases
  async getCases(): Promise<CaseItem[]> {
    return apiRequest<CaseItem[]>('/api/counsellor/cases');
  },

  async getCase(id: string): Promise<{ case: CaseItem; sessions: SessionItem[]; notes: CaseNote[] }> {
    return apiRequest(`/api/counsellor/cases/${id}`);
  },

  async createCase(data: Partial<CaseItem>): Promise<CaseItem> {
    return apiRequest<CaseItem>('/api/counsellor/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCaseStatus(caseId: string, status: CaseStatus, stage?: InterventionStage): Promise<CaseItem> {
    return apiRequest<CaseItem>(`/api/counsellor/cases/${caseId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, stage }),
    });
  },

  async updateCaseStage(caseId: string, stage: InterventionStage): Promise<CaseItem> {
    return apiRequest<CaseItem>(`/api/counsellor/cases/${caseId}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage }),
    });
  },

  // Sessions
  async getSessions(): Promise<SessionItem[]> {
    return apiRequest<SessionItem[]>('/api/counsellor/sessions');
  },

  async scheduleSession(sessionData: Omit<SessionItem, 'id' | 'status'>): Promise<SessionItem> {
    return apiRequest<SessionItem>('/api/counsellor/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  async updateSessionStatus(
    sessionId: string,
    status: SessionStatus,
    completionNotes?: string,
    nextActionPlan?: string,
    authorName?: string
  ): Promise<SessionItem> {
    return apiRequest<SessionItem>(`/api/counsellor/sessions/${sessionId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, completionNotes, nextActionPlan, authorName }),
    });
  },

  async rescheduleSession(sessionId: string, date: string, time: string): Promise<SessionItem> {
    return apiRequest<SessionItem>(`/api/counsellor/sessions/${sessionId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ date, time }),
    });
  },

  // Follow-ups
  async getFollowUps(): Promise<FollowUpItem[]> {
    return apiRequest<FollowUpItem[]>('/api/counsellor/followups');
  },

  async createFollowUp(data: Omit<FollowUpItem, 'id' | 'status'>): Promise<FollowUpItem> {
    return apiRequest<FollowUpItem>('/api/counsellor/followups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async completeFollowUp(
    followUpId: string,
    outcomeNotes?: string,
    scheduleNext?: boolean,
    nextDate?: string,
    nextType?: FollowUpType,
    authorName?: string
  ): Promise<FollowUpItem> {
    return apiRequest<FollowUpItem>(`/api/counsellor/followups/${followUpId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ outcomeNotes, scheduleNext, nextDate, nextType, authorName }),
    });
  },

  async rescheduleFollowUp(followUpId: string, followUpDate: string, followUpTime?: string): Promise<FollowUpItem> {
    return apiRequest<FollowUpItem>(`/api/counsellor/followups/${followUpId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ followUpDate, followUpTime }),
    });
  },

  // Notes
  async getNotes(caseId?: string): Promise<CaseNote[]> {
    const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : '';
    return apiRequest<CaseNote[]>(`/api/counsellor/notes${query}`);
  },

  async addNote(note: Omit<CaseNote, 'id'>): Promise<CaseNote> {
    return apiRequest<CaseNote>('/api/counsellor/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  },

  async editNote(noteId: string, title: string, content: string): Promise<CaseNote> {
    return apiRequest<CaseNote>(`/api/counsellor/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
    });
  },

  // Notifications
  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return apiRequest(`/api/counsellor/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async markAllNotificationsRead(): Promise<{ success: boolean; message: string }> {
    return apiRequest('/api/counsellor/notifications/read-all', {
      method: 'POST',
    });
  },
};
