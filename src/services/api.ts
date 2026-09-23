import { authApi } from '../api/authApi';
import { casesApi } from '../api/casesApi';
import { sessionsApi } from '../api/sessionsApi';
import { followupsApi } from '../api/followupsApi';
import { dashboardApi } from '../api/dashboardApi';
import { notificationsApi } from '../api/notificationsApi';
import { getAuthToken, setAuthToken, clearAuthToken, apiClient } from '../api/client';

export { getAuthToken, setAuthToken, clearAuthToken, apiClient };

export const counsellorApi = {
  // Auth
  login: authApi.login,
  register: authApi.register,
  getMe: authApi.getMe,
  updateProfile: authApi.updateProfile,

  // Overview
  getOverview: dashboardApi.getOverview,

  // Cases
  getCases: casesApi.getAll,
  getCase: casesApi.getById,
  createCase: casesApi.create,
  updateCaseStatus: casesApi.updateStatus,
  updateCaseStage: casesApi.updateStage,

  // Sessions
  getSessions: sessionsApi.getAll,
  scheduleSession: sessionsApi.schedule,
  updateSessionStatus: sessionsApi.updateStatus,
  rescheduleSession: sessionsApi.reschedule,

  // Follow-ups
  getFollowUps: followupsApi.getAll,
  createFollowUp: followupsApi.create,
  completeFollowUp: followupsApi.complete,
  rescheduleFollowUp: followupsApi.reschedule,

  // Notes
  getNotes: casesApi.getNotes,
  addNote: casesApi.addNote,
  editNote: casesApi.editNote,

  // Notifications
  markNotificationRead: notificationsApi.markRead,
  markAllNotificationsRead: notificationsApi.markAllRead,
};

export default counsellorApi;
