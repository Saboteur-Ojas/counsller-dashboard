import React, { useState } from 'react';
import {
  FolderHeart,
  Calendar,
  ClockAlert,
  Inbox,
  Play,
  CheckCircle2,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldCheck,
  Video,
  FileEdit,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { ScheduleSessionModal } from '../modals/ScheduleSessionModal';
import { CompleteSessionModal } from '../modals/CompleteSessionModal';
import { SessionItem } from '../../types';

export const DashboardPage: React.FC = () => {
  const {
    user,
    cases,
    sessions,
    followUps,
    activities,
    navigateTo,
    updateSessionStatus,
  } = useApp();

  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [completingSession, setCompletingSession] = useState<SessionItem | null>(null);

  // Metrics computation
  const activeCasesList = cases.filter((c) => c.currentStatus === 'Active' || c.currentStatus === 'Follow-up Required');
  const activeCasesCount = activeCasesList.length;

  const todayDateStr = '2026-09-04';
  const todaySessions = sessions.filter((s) => s.date === todayDateStr);
  const todaySessionsCount = todaySessions.length;

  const followUpsDue = followUps.filter((f) => f.status === 'Pending' && f.followUpDate <= todayDateStr);
  const followUpsDueCount = followUpsDue.length;

  const pendingRequests = cases.filter((c) => c.currentStatus === 'New' || c.interventionStage === 'Request Received');
  const pendingRequestsCount = pendingRequests.length;

  // Cases requiring attention
  const casesNeedingAttention = cases
    .filter((c) => {
      return (
        c.currentStatus === 'New' ||
        c.currentStatus === 'Follow-up Required' ||
        c.priority === 'Priority' ||
        (c.nextFollowUp && c.nextFollowUp <= todayDateStr)
      );
    })
    .slice(0, 4);

  // Format greeting
  const counsellorTitle = user?.name ? user.name : 'Dr. Ananya Sharma';

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Good Morning, {counsellorTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#778DA9] mt-1">
            Here's an overview of your support workspace. All records are secured under CAPF protocols.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="dashboard-schedule-btn"
            type="button"
            onClick={() => setScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#588157] text-white hover:bg-[#3A5A40] shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/cases')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-white text-[#415A77] hover:bg-[#F8F9FA] transition-colors cursor-pointer border border-[#E0E1DD]"
          >
            <span>View All Cases</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#778DA9]" />
          </button>
        </div>
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          id="metric-active-cases"
          title="Active Cases"
          value={activeCasesCount}
          context={`${cases.filter((c) => c.priority === 'Priority').length} requiring priority support`}
          icon={FolderHeart}
          iconBgColor="bg-[#F0F2F5]"
          iconColor="text-[#415A77]"
          accentLabel="+2 this week"
          onClick={() => navigateTo('/cases')}
        />

        <MetricCard
          id="metric-sessions-today"
          title="Sessions Today"
          value={todaySessionsCount}
          context={
            todaySessions.some((s) => s.status === 'Upcoming')
              ? `Next slot: ${todaySessions.find((s) => s.status === 'Upcoming')?.time || '09:30 AM'}`
              : 'All daily sessions complete'
          }
          icon={Calendar}
          iconBgColor="bg-[#ECF3ED]"
          iconColor="text-[#588157]"
          accentLabel="On Schedule"
          onClick={() => navigateTo('/sessions')}
        />

        <MetricCard
          id="metric-followups-due"
          title="Follow-ups Due"
          value={followUpsDueCount}
          context="Morning review queue active"
          icon={ClockAlert}
          iconBgColor="bg-[#FEF2F2]"
          iconColor="text-[#E63946]"
          accentLabel="Action Needed"
          onClick={() => navigateTo('/follow-ups')}
        />

        <MetricCard
          id="metric-pending-requests"
          title="Pending Requests"
          value={pendingRequestsCount}
          context="Awaiting initial intake review"
          icon={Inbox}
          iconBgColor="bg-[#F0F2F5]"
          iconColor="text-[#415A77]"
          onClick={() => navigateTo('/cases')}
        />
      </div>

      {/* Main Workspace Grid: Today's Sessions + Cases Requiring Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Sessions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-[#E0E1DD] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E0E1DD] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F0F2F5] flex items-center justify-center text-[#415A77]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#0D1B2A]">Today's Support Sessions</h2>
                  <p className="text-[11px] text-[#778DA9]">Scheduled confidential consultations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('/sessions')}
                className="text-xs text-[#588157] hover:text-[#3A5A40] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5">
              {todaySessions.length > 0 ? (
                <div className="space-y-3.5">
                  {todaySessions.map((session) => {
                    const isUpcoming = session.status === 'Upcoming';
                    const isInProgress = session.status === 'In Progress';
                    const isCompleted = session.status === 'Completed';

                    return (
                      <div
                        key={session.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isInProgress
                            ? 'bg-[#ECF3ED]/40 border-[#CDE3CF] shadow-xs'
                            : 'bg-[#F8F9FA] border-[#E0E1DD] hover:bg-white hover:shadow-xs'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-14 text-center shrink-0 p-1.5 rounded-lg bg-white border border-[#E0E1DD]">
                              <span className="text-xs font-bold text-[#0D1B2A] block">
                                {session.time}
                              </span>
                              <span className="text-[10px] text-[#778DA9] font-medium">
                                {session.durationMinutes}m
                              </span>
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-[#0D1B2A]">
                                  {session.sessionType}
                                </span>
                                <StatusBadge status={session.status} size="sm" />
                              </div>
                              <p className="text-xs text-[#415A77] font-medium truncate">
                                {session.personnelRef}
                              </p>
                              <div className="flex items-center gap-3 text-[11px] text-[#778DA9] mt-1">
                                <span>{session.caseId}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-[#415A77]">
                                  <Video className="w-3 h-3 text-[#778DA9]" />
                                  {session.mode}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E0E1DD]">
                            <button
                              type="button"
                              onClick={() => navigateTo(`/cases/${session.caseId}`, session.caseId)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#415A77] bg-white border border-[#E0E1DD] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                            >
                              View Case
                            </button>

                            {isUpcoming && (
                              <button
                                type="button"
                                onClick={() => updateSessionStatus(session.id, 'In Progress')}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1B263B] hover:bg-[#0D1B2A] transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Play className="w-3 h-3" />
                                <span>Start</span>
                              </button>
                            )}

                            {isInProgress && (
                              <button
                                type="button"
                                onClick={() => setCompletingSession(session)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#588157] hover:bg-[#3A5A40] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Complete</span>
                              </button>
                            )}

                            {isCompleted && (
                              <span className="text-xs font-medium text-[#588157] px-2 py-1 bg-[#ECF3ED] rounded-md border border-[#CDE3CF]">
                                Concluded
                              </span>
                            )}
                          </div>
                        </div>

                        {session.notes && (
                          <div className="mt-3 pt-2.5 border-t border-[#E0E1DD]/70 text-xs text-[#778DA9] italic">
                            Focus: {session.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No sessions scheduled today"
                  description="You have no appointments scheduled for today. You can schedule new sessions or review case notes."
                  actionLabel="Schedule Session"
                  onAction={() => setScheduleModalOpen(true)}
                />
              )}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-xl border border-[#E0E1DD] shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#0D1B2A]">Recent Workspace Activity</h2>
              <span className="text-[11px] text-[#778DA9]">Audit trail</span>
            </div>

            <div className="space-y-4">
              {activities.slice(0, 5).map((act, index) => (
                <div key={act.id} className="flex items-start gap-3 relative">
                  {/* Timeline connector */}
                  {index < 4 && (
                    <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-[#E0E1DD] -z-0" />
                  )}

                  <div className="w-7 h-7 rounded-full bg-[#F0F2F5] border border-[#E0E1DD] text-[#415A77] flex items-center justify-center shrink-0 z-10 text-xs font-semibold">
                    {act.type === 'session' ? 'S' : act.type === 'note' ? 'N' : act.type === 'followup' ? 'F' : 'C'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[#0D1B2A]">{act.action}</p>
                      <span className="text-[10px] text-[#778DA9] shrink-0">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#778DA9] mt-0.5 leading-normal">{act.description}</p>
                    {act.caseId && (
                      <button
                        type="button"
                        onClick={() => navigateTo(`/cases/${act.caseId}`, act.caseId)}
                        className="mt-1 text-[11px] font-medium text-[#588157] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{act.caseId}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cases Requiring Attention (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-[#E0E1DD] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E0E1DD] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0D1B2A]">Cases Requiring Attention</h2>
                <p className="text-[11px] text-[#778DA9]">Action items and urgent welfare tasks</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                {casesNeedingAttention.length} Items
              </span>
            </div>

            <div className="p-5 divide-y divide-[#E0E1DD]">
              {casesNeedingAttention.length > 0 ? (
                casesNeedingAttention.map((c) => {
                  let reason = 'Review intake request';
                  if (c.currentStatus === 'Follow-up Required') {
                    reason = 'Follow-up check due';
                  } else if (c.priority === 'Priority') {
                    reason = 'Priority operational stress protocol';
                  } else if (c.currentStatus === 'New') {
                    reason = 'New intake request awaiting review';
                  }

                  return (
                    <div key={c.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#0D1B2A]">{c.id}</span>
                            <PriorityBadge priority={c.priority} />
                          </div>
                          <p className="text-xs text-[#415A77] font-medium mt-0.5">
                            {c.personnelRef}
                          </p>
                          <p className="text-[11px] text-[#778DA9]">{c.forceUnit}</p>
                        </div>
                        <StatusBadge status={c.currentStatus} size="sm" />
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E0E1DD] text-xs text-[#415A77]">
                        <span className="font-semibold text-[#0D1B2A]">Action:</span> {reason}
                        <div className="text-[11px] text-[#778DA9] mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#778DA9]" />
                          <span>Last Interaction: {c.lastInteraction}</span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => navigateTo(`/cases/${c.id}`, c.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1B263B] text-white hover:bg-[#0D1B2A] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Review Case</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  title="All caught up!"
                  description="There are no urgent intervention items pending in your queue."
                />
              )}
            </div>
          </div>

          {/* Privacy & Ethical Standards Reminder Box */}
          <div className="bg-[#1B263B] rounded-xl shadow-sm p-5 text-white space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#588157] rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#778DA9]">
                Confidentiality Standard
              </span>
            </div>
            <p className="text-xs text-[#E0E1DD] leading-relaxed">
              VeerSetu enforces strict personnel privacy: algorithmic mood scores, mental health rankings, and intrusive tracking are prohibited. Focus exclusively on human empathy, professional support, and timely follow-up.
            </p>
            <div className="pt-3 border-t border-[#415A77] flex items-center justify-between text-[10px] text-[#778DA9]">
              <span>DIRECTIVE: CAPF-MH-2026/08</span>
              <span className="text-[#588157] font-semibold">COMPLIANCE ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Modals */}
      <ScheduleSessionModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />

      <CompleteSessionModal
        session={completingSession}
        isOpen={!!completingSession}
        onClose={() => setCompletingSession(null)}
      />
    </div>
  );
};
