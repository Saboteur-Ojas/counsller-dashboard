import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Play,
  CheckCircle2,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { ScheduleSessionModal } from '../modals/ScheduleSessionModal';
import { CompleteSessionModal } from '../modals/CompleteSessionModal';
import { RescheduleSessionModal } from '../modals/RescheduleSessionModal';
import { SessionItem, SessionStatus } from '../../types';

export const SessionsPage: React.FC = () => {
  const { sessions, updateSessionStatus, navigateTo } = useApp();

  const [calendarView, setCalendarView] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-04');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [completingSession, setCompletingSession] = useState<SessionItem | null>(null);
  const [reschedulingSession, setReschedulingSession] = useState<SessionItem | null>(null);
  const [viewingSession, setViewingSession] = useState<SessionItem | null>(null);

  // Generate 7 days for the weekly view around selectedDate
  const weekDays = useMemo(() => {
    const dates: { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] = [];
    const base = new Date('2026-09-01'); // Tuesday of current week
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const str = d.toISOString().split('T')[0];
      dates.push({
        dateStr: str,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: str === '2026-09-04',
      });
    }
    return dates;
  }, []);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (calendarView === 'daily' && s.date !== selectedDate) return false;
      return true;
    });
  }, [sessions, statusFilter, calendarView, selectedDate]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Counselling & Support Sessions
          </h1>
          <p className="text-xs sm:text-sm text-[#778DA9] mt-1">
            Confidential appointments, audio-visual sessions, and clinical debriefs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex p-1 bg-[#F0F2F5] rounded-xl border border-[#E0E1DD]">
            <button
              type="button"
              onClick={() => setCalendarView('daily')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                calendarView === 'daily'
                  ? 'bg-white text-[#0D1B2A] shadow-xs'
                  : 'text-[#415A77] hover:text-[#0D1B2A]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Daily View</span>
            </button>
            <button
              type="button"
              onClick={() => setCalendarView('weekly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                calendarView === 'weekly'
                  ? 'bg-white text-[#0D1B2A] shadow-xs'
                  : 'text-[#415A77] hover:text-[#0D1B2A]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Weekly View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#588157] text-white hover:bg-[#3A5A40] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* Date Bar & Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
        {calendarView === 'daily' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}
                className="p-1.5 rounded-lg border border-[#E0E1DD] hover:bg-[#F8F9FA] text-[#415A77] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#588157]" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-bold text-[#0D1B2A] bg-[#F8F9FA] border border-[#E0E1DD] px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#588157]"
                />
                {selectedDate === '2026-09-04' && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ECF3ED] text-[#3A5A40] border border-[#CDE3CF]">
                    Today
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}
                className="p-1.5 rounded-lg border border-[#E0E1DD] hover:bg-[#F8F9FA] text-[#415A77] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#778DA9]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium px-2.5 py-1.5 bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#415A77] focus:outline-none focus:ring-1 focus:ring-[#588157]"
              >
                <option value="All">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        ) : (
          /* Weekly date strip */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0D1B2A]">Week of 01 Sep – 07 Sep 2026</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium px-2.5 py-1 bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#415A77]"
              >
                <option value="All">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((d) => {
                const daySessions = sessions.filter((s) => s.date === d.dateStr);
                const isSelected = selectedDate === d.dateStr;

                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B263B] text-white border-[#1B263B] shadow-xs'
                        : d.isToday
                        ? 'bg-[#ECF3ED] border-[#CDE3CF] text-[#0D1B2A]'
                        : 'bg-[#F8F9FA] border-[#E0E1DD] text-[#415A77] hover:bg-white'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">
                      {d.dayName}
                    </span>
                    <span className="text-base font-bold block my-0.5">{d.dayNum}</span>
                    <span className="text-[10px] block opacity-80">
                      {daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sessions List / Calendar Grid */}
      <div className="space-y-4">
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((sess) => {
              const isUpcoming = sess.status === 'Upcoming';
              const isInProgress = sess.status === 'In Progress';
              const isCompleted = sess.status === 'Completed';

              return (
                <div
                  key={sess.id}
                  className={`p-5 rounded-xl border bg-white shadow-sm transition-all space-y-3.5 flex flex-col justify-between ${
                    isInProgress
                      ? 'border-[#588157] ring-2 ring-[#588157]/20'
                      : 'border-[#E0E1DD] hover:border-[#778DA9]'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Top row: Time slot & Status */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F0F2F5] text-[#0D1B2A] text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#778DA9]" />
                        <span>{sess.time}</span>
                        <span className="text-[#778DA9] font-normal">({sess.durationMinutes}m)</span>
                      </div>
                      <StatusBadge status={sess.status} size="sm" />
                    </div>

                    {/* Session Type & Case info */}
                    <div>
                      <h3 className="text-sm font-bold text-[#0D1B2A]">{sess.sessionType}</h3>
                      <p className="text-xs text-[#415A77] font-medium mt-0.5">
                        {sess.personnelRef}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-[#778DA9] pt-1 border-t border-[#E0E1DD]">
                      <div className="flex items-center justify-between">
                        <span>Case Ref:</span>
                        <button
                          type="button"
                          onClick={() => navigateTo(`/cases/${sess.caseId}`, sess.caseId)}
                          className="font-semibold text-[#588157] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{sess.caseId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Date:</span>
                        <span className="text-[#0D1B2A] font-medium">{sess.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Mode:</span>
                        <span className="text-[#0D1B2A] font-medium flex items-center gap-1">
                          <Video className="w-3 h-3 text-[#778DA9]" />
                          {sess.mode}
                        </span>
                      </div>
                    </div>

                    {/* Preparation or Completion Notes */}
                    {sess.notes && (
                      <div className="p-2.5 rounded-lg bg-[#F8F9FA] text-[11px] text-[#415A77] italic border border-[#E0E1DD]">
                        Focus: {sess.notes}
                      </div>
                    )}

                    {sess.completionNotes && (
                      <div className="p-2.5 rounded-lg bg-[#ECF3ED] text-[11px] text-[#3A5A40] border border-[#CDE3CF]">
                        <strong>Outcome:</strong> {sess.completionNotes}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#E0E1DD] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setReschedulingSession(sess)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#415A77] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
                    >
                      Reschedule
                    </button>

                    <div className="flex items-center gap-1.5">
                      {isUpcoming && (
                        <button
                          type="button"
                          onClick={() => updateSessionStatus(sess.id, 'In Progress')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1B263B] text-white hover:bg-[#0D1B2A] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Play className="w-3 h-3" />
                          <span>Start Session</span>
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          type="button"
                          onClick={() => setCompletingSession(sess)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#588157] text-white hover:bg-[#3A5A40] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      )}

                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => navigateTo(`/cases/${sess.caseId}`, sess.caseId)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#588157] bg-[#ECF3ED] border border-[#CDE3CF] hover:bg-[#CDE3CF] transition-colors cursor-pointer"
                        >
                          Review Case
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No sessions scheduled"
            description={
              calendarView === 'daily'
                ? `You have no support sessions scheduled on ${selectedDate}.`
                : 'No sessions matching the selected filter criteria.'
            }
            actionLabel="Schedule Session"
            onAction={() => setScheduleModalOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <ScheduleSessionModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />

      <CompleteSessionModal
        session={completingSession}
        isOpen={!!completingSession}
        onClose={() => setCompletingSession(null)}
      />

      <RescheduleSessionModal
        session={reschedulingSession}
        isOpen={!!reschedulingSession}
        onClose={() => setReschedulingSession(null)}
      />
    </div>
  );
};
