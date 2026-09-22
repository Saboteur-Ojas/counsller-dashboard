import React, { useState, useMemo } from 'react';
import {
  ClockAlert,
  CalendarCheck,
  CalendarPlus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  Plus,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { CompleteFollowUpModal } from '../modals/CompleteFollowUpModal';
import { CreateFollowUpModal } from '../modals/CreateFollowUpModal';
import { FollowUpItem } from '../../types';

export const FollowUpsPage: React.FC = () => {
  const { followUps, rescheduleFollowUp, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Due Today' | 'Upcoming' | 'Overdue' | 'Completed'>('Due Today');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [completingFollowUp, setCompletingFollowUp] = useState<FollowUpItem | null>(null);
  const [createFollowUpOpen, setCreateFollowUpOpen] = useState<boolean>(false);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');

  const todayStr = '2026-09-04';

  // Compute counts
  const dueTodayCount = followUps.filter((f) => f.status === 'Pending' && f.followUpDate === todayStr).length;
  const upcomingCount = followUps.filter((f) => f.status === 'Pending' && f.followUpDate > todayStr).length;
  const overdueCount = followUps.filter((f) => f.status === 'Pending' && f.followUpDate < todayStr).length;
  const completedCount = followUps.filter((f) => f.status === 'Completed').length;

  // Filtered list
  const filteredFollowUps = useMemo(() => {
    return followUps.filter((f) => {
      // Tab filter
      if (activeTab === 'Due Today') {
        if (f.status !== 'Pending' || f.followUpDate !== todayStr) return false;
      } else if (activeTab === 'Upcoming') {
        if (f.status !== 'Pending' || f.followUpDate <= todayStr) return false;
      } else if (activeTab === 'Overdue') {
        if (f.status !== 'Pending' || f.followUpDate >= todayStr) return false;
      } else if (activeTab === 'Completed') {
        if (f.status !== 'Completed') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.caseId.toLowerCase().includes(q) ||
          f.personnelRef.toLowerCase().includes(q) ||
          f.followUpType.toLowerCase().includes(q) ||
          (f.notes && f.notes.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [followUps, activeTab, searchQuery, todayStr]);

  const handleRescheduleSubmit = (followUpId: string) => {
    if (rescheduleDate) {
      rescheduleFollowUp(followUpId, rescheduleDate);
      setReschedulingId(null);
      setRescheduleDate('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Intervention Follow-ups
          </h1>
          <p className="text-xs sm:text-sm text-[#778DA9] mt-1">
            Continuous wellness checks, family liaison verification, and post-intervention reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateFollowUpOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#588157] text-white hover:bg-[#3A5A40] transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Follow-up Action</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Due Today */}
        <button
          type="button"
          onClick={() => setActiveTab('Due Today')}
          className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'Due Today'
              ? 'bg-[#FFFBEB] border-[#FDE68A] ring-2 ring-[#FDE68A]/50'
              : 'bg-white border-[#E0E1DD] hover:border-[#778DA9] shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#778DA9]">
              Due Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
              <ClockAlert className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-[#0D1B2A] block mt-2">{dueTodayCount}</span>
          <p className="text-xs text-[#778DA9] mt-1">Priority checks for today</p>
        </button>

        {/* Upcoming */}
        <button
          type="button"
          onClick={() => setActiveTab('Upcoming')}
          className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'Upcoming'
              ? 'bg-[#F0F2F5] border-[#778DA9] ring-2 ring-[#778DA9]/30'
              : 'bg-white border-[#E0E1DD] hover:border-[#778DA9] shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#778DA9]">
              Upcoming
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E0E1DD] text-[#1B263B] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-[#0D1B2A] block mt-2">{upcomingCount}</span>
          <p className="text-xs text-[#778DA9] mt-1">Scheduled in coming days</p>
        </button>

        {/* Overdue */}
        <button
          type="button"
          onClick={() => setActiveTab('Overdue')}
          className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'Overdue'
              ? 'bg-[#FEF2F2] border-[#FECACA] ring-2 ring-[#FECACA]/50'
              : 'bg-white border-[#E0E1DD] hover:border-[#778DA9] shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#778DA9]">
              Overdue
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-[#0D1B2A] block mt-2">{overdueCount}</span>
          <p className="text-xs text-[#778DA9] mt-1">Requires immediate follow-up</p>
        </button>

        {/* Completed */}
        <button
          type="button"
          onClick={() => setActiveTab('Completed')}
          className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'Completed'
              ? 'bg-[#ECF3ED] border-[#CDE3CF] ring-2 ring-[#CDE3CF]/50'
              : 'bg-white border-[#E0E1DD] hover:border-[#778DA9] shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#778DA9]">
              Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#ECF3ED] text-[#3A5A40] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-[#0D1B2A] block mt-2">{completedCount}</span>
          <p className="text-xs text-[#778DA9] mt-1">Successfully concluded</p>
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E0E1DD] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F0F2F5] rounded-xl border border-[#E0E1DD]">
          {(['Due Today', 'Upcoming', 'Overdue', 'Completed', 'All'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-[#0D1B2A] shadow-xs'
                  : 'text-[#415A77] hover:text-[#0D1B2A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#778DA9] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search follow-ups..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] focus:bg-white"
          />
        </div>
      </div>

      {/* Follow-up List / Table */}
      <div className="bg-white rounded-xl border border-[#E0E1DD] shadow-sm overflow-hidden">
        {filteredFollowUps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#E0E1DD] text-[11px] font-bold text-[#778DA9] uppercase tracking-wider">
                  <th className="py-3 px-4">Case ID & Personnel</th>
                  <th className="py-3 px-4">Follow-up Type</th>
                  <th className="py-3 px-4">Target Date</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Checklist / Observation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E1DD] text-xs">
                {filteredFollowUps.map((flw) => {
                  const isCompleted = flw.status === 'Completed';

                  return (
                    <tr
                      key={flw.id}
                      className="hover:bg-[#F8F9FA] transition-colors group"
                    >
                      {/* Case ID */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => navigateTo(`/cases/${flw.caseId}`, flw.caseId)}
                          className="font-bold text-[#0D1B2A] group-hover:text-[#588157] transition-colors hover:underline block text-left cursor-pointer"
                        >
                          {flw.caseId}
                        </button>
                        <span className="text-[11px] text-[#778DA9] truncate block mt-0.5">
                          {flw.personnelRef}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 font-semibold text-[#0D1B2A]">
                        {flw.followUpType}
                      </td>

                      {/* Target Date */}
                      <td className="py-3.5 px-4 text-[#415A77]">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#778DA9]" />
                          {flw.followUpDate} {flw.followUpTime && `(${flw.followUpTime})`}
                        </span>
                      </td>

                      {/* Current Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={flw.status} size="sm" />
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={flw.priority} />
                      </td>

                      {/* Observation */}
                      <td className="py-3.5 px-4 max-w-xs text-[#415A77] text-[11px] truncate">
                        {flw.notes || 'Routine scheduled checkpoint.'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigateTo(`/cases/${flw.caseId}`, flw.caseId)}
                            className="px-2.5 py-1 text-[11px] font-medium text-[#415A77] bg-white border border-[#E0E1DD] rounded-md hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                          >
                            View Case
                          </button>

                          {!isCompleted && (
                            <>
                              <button
                                type="button"
                                onClick={() => setCompletingFollowUp(flw)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#588157] hover:bg-[#3A5A40] rounded-md transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Complete</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setReschedulingId(flw.id);
                                  setRescheduleDate(flw.followUpDate);
                                }}
                                className="px-2 py-1 text-[11px] text-[#415A77] hover:bg-[#F0F2F5] rounded-md transition-colors cursor-pointer"
                              >
                                Reschedule
                              </button>
                            </>
                          )}
                        </div>

                        {/* Inline Reschedule Dropdown / Popover */}
                        {reschedulingId === flw.id && (
                          <div className="mt-2 p-2 bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-left shadow-lg flex items-center gap-2 z-20">
                            <input
                              type="date"
                              value={rescheduleDate}
                              onChange={(e) => setRescheduleDate(e.target.value)}
                              className="text-xs px-2 py-1 border border-[#E0E1DD] rounded bg-white text-[#0D1B2A]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRescheduleSubmit(flw.id)}
                              className="px-2 py-1 text-xs font-semibold bg-[#1B263B] text-white rounded hover:bg-[#0D1B2A] cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setReschedulingId(null)}
                              className="text-xs text-[#778DA9] hover:text-[#0D1B2A] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="You're all caught up for now."
            description={
              activeTab === 'Due Today'
                ? 'No follow-up items scheduled for today.'
                : 'No follow-ups matching this category.'
            }
            actionLabel="Create Follow-up Action"
            onAction={() => setCreateFollowUpOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <CompleteFollowUpModal
        followUp={completingFollowUp}
        isOpen={!!completingFollowUp}
        onClose={() => setCompletingFollowUp(null)}
      />

      <CreateFollowUpModal
        isOpen={createFollowUpOpen}
        onClose={() => setCreateFollowUpOpen(false)}
      />
    </div>
  );
};
