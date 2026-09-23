import { apiClient } from './client';
import { CaseItem, SessionItem, FollowUpItem, CaseNote, ActivityItem, NotificationItem } from '../types';

export interface CounsellorOverviewData {
  cases: CaseItem[];
  sessions: SessionItem[];
  followUps: FollowUpItem[];
  caseNotes: CaseNote[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
  unreadNotifCount: number;
  metrics?: {
    totalCases: number;
    activeCases: number;
    pendingFollowUps: number;
    upcomingSessions: number;
  };
}

export const dashboardApi = {
  async getOverview(): Promise<CounsellorOverviewData> {
    return apiClient<CounsellorOverviewData>('/counsellor/overview');
  },
};

export default dashboardApi;
