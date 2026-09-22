export type SupportCategory =
  | 'Counselling Support'
  | 'Psychological Support'
  | 'Family Support'
  | 'Stress Management'
  | 'Crisis Support'
  | 'General Welfare Support'
  | 'Duty Station Transition';

export type CaseStatus =
  | 'New'
  | 'Active'
  | 'Follow-up Required'
  | 'On Hold'
  | 'Completed';

export type CasePriority = 'Routine' | 'Moderate' | 'Priority';

export type InterventionStage =
  | 'Request Received'
  | 'Reviewed'
  | 'Active Support'
  | 'Follow-up'
  | 'Completed';

export type SessionType =
  | 'Individual Counselling'
  | 'Family Tele-Support'
  | 'Stress Debrief'
  | 'Follow-up Check-in'
  | 'Intake Assessment'
  | 'Re-integration Check';

export type SessionMode = 'Secure Tele-link' | 'Duty Station Office' | 'Confidential Audio';

export type SessionStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Rescheduled' | 'Cancelled';

export type FollowUpStatus = 'Pending' | 'Completed' | 'Rescheduled' | 'Overdue';

export type FollowUpType =
  | 'Welfare Wellness Check'
  | 'Family Communication Verify'
  | 'Sleep & Stress Follow-up'
  | 'Duty Station Check-in'
  | 'Medication & Rest Adherence'
  | 'Post-Intervention Review';

export interface CaseNote {
  id: string;
  caseId: string;
  authorName: string;
  authorRole: string;
  category: 'Clinical Observation' | 'Support Discussion' | 'Action Item' | 'Welfare Referral';
  date: string;
  time: string;
  title: string;
  content: string;
  isDraft?: boolean;
}

export interface CaseItem {
  id: string; // e.g. CASE-2026-CRPF-4091
  personnelRef: string; // Privacy safe reference, e.g. "Personnel #4091 (Constable / GD)"
  forceUnit: string; // e.g. "45th Bn CRPF (Srinagar Sector)"
  supportCategory: SupportCategory;
  assignedDate: string;
  currentStatus: CaseStatus;
  priority: CasePriority;
  lastInteraction: string;
  nextFollowUp?: string;
  interventionStage: InterventionStage;
  reasonForRequest: string;
  supportObjective: string;
  assignedCounsellor: string;
  notesCount: number;
  sessionsCount: number;
}

export interface SessionItem {
  id: string;
  caseId: string;
  personnelRef: string;
  sessionType: SessionType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  mode: SessionMode;
  status: SessionStatus;
  notes?: string;
  completionNotes?: string;
  nextActionPlan?: string;
}

export interface FollowUpItem {
  id: string;
  caseId: string;
  personnelRef: string;
  followUpDate: string; // YYYY-MM-DD
  followUpTime?: string;
  status: FollowUpStatus;
  followUpType: FollowUpType;
  lastInteraction: string;
  notes?: string;
  priority: CasePriority;
}

export interface ActivityItem {
  id: string;
  caseId?: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'assignment' | 'session' | 'followup' | 'note' | 'status';
}

export interface CounsellorUser {
  id: string;
  name: string;
  counsellorId: string;
  email: string;
  phone: string;
  specialization: SupportCategory;
  dutyStation: string;
  onDuty: boolean;
  avatarUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'session' | 'followup' | 'system';
  targetCaseId?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}
