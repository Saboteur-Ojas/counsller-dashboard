import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  FolderHeart,
  Plus,
  ChevronRight,
  Calendar,
  Eye,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { ScheduleSessionModal } from '../modals/ScheduleSessionModal';
import { SupportCategory, CaseStatus, CasePriority } from '../../types';

export const CasesPage: React.FC = () => {
  const { cases, navigateTo } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'assignedDate' | 'lastInteraction' | 'priority'>('assignedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [selectedCaseForSession, setSelectedCaseForSession] = useState<string | undefined>(undefined);

  // Filter and sort logic
  const filteredCases = useMemo(() => {
    return cases
      .filter((c) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            c.id.toLowerCase().includes(q) ||
            c.personnelRef.toLowerCase().includes(q) ||
            c.forceUnit.toLowerCase().includes(q) ||
            c.supportCategory.toLowerCase().includes(q) ||
            c.reasonForRequest.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Status filter
        if (statusFilter !== 'All' && c.currentStatus !== statusFilter) {
          return false;
        }

        // Priority filter
        if (priorityFilter !== 'All' && c.priority !== priorityFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'All' && c.supportCategory !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const pOrder: Record<CasePriority, number> = { Priority: 3, Moderate: 2, Routine: 1 };
          const diff = pOrder[a.priority] - pOrder[b.priority];
          return sortOrder === 'asc' ? diff : -diff;
        }
        if (sortBy === 'lastInteraction') {
          const diff = new Date(a.lastInteraction).getTime() - new Date(b.lastInteraction).getTime();
          return sortOrder === 'asc' ? diff : -diff;
        }
        // default assignedDate
        const diff = new Date(a.assignedDate).getTime() - new Date(b.assignedDate).getTime();
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [cases, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
  };

  const hasActiveFilters =
    statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || searchQuery !== '';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
              Assigned Welfare Cases
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0F2F5] text-[#415A77] border border-[#E0E1DD]">
              {filteredCases.length} of {cases.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#778DA9] mt-1">
            Confidential case files, intervention tracking, and support management.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedCaseForSession(undefined);
            setScheduleModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#588157] text-white hover:bg-[#3A5A40] transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#778DA9] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="case-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Case ID, Personnel, Unit, or Notes..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] focus:bg-white transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] focus:bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Active">Active</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="md:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] focus:bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="Priority">Priority</option>
              <option value="Moderate">Moderate</option>
              <option value="Routine">Routine</option>
            </select>
          </div>

          {/* Support Category Filter */}
          <div className="md:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] focus:bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Counselling Support">Counselling Support</option>
              <option value="Psychological Support">Psychological Support</option>
              <option value="Family Support">Family Support</option>
              <option value="Stress Management">Stress Management</option>
              <option value="Crisis Support">Crisis Support</option>
              <option value="General Welfare Support">General Welfare Support</option>
              <option value="Duty Station Transition">Duty Station Transition</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="md:col-span-2 flex gap-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2 py-2 text-xs bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] focus:bg-white"
            >
              <option value="assignedDate">Assigned Date</option>
              <option value="lastInteraction">Last Interaction</option>
              <option value="priority">Priority</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="px-2.5 py-2 bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#415A77] hover:bg-[#F0F2F5] cursor-pointer"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#E0E1DD] text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#778DA9] text-[11px] font-medium">Applied Filters:</span>
              {statusFilter !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-[#ECF3ED] text-[#588157] border border-[#CDE3CF] flex items-center gap-1">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter('All')} className="cursor-pointer">
                    <X className="w-3 h-3 text-[#588157]" />
                  </button>
                </span>
              )}
              {priorityFilter !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] flex items-center gap-1">
                  Priority: {priorityFilter}
                  <button onClick={() => setPriorityFilter('All')} className="cursor-pointer">
                    <X className="w-3 h-3 text-[#B45309]" />
                  </button>
                </span>
              )}
              {categoryFilter !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-[#F0F2F5] text-[#415A77] border border-[#E0E1DD] flex items-center gap-1">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter('All')} className="cursor-pointer">
                    <X className="w-3 h-3 text-[#415A77]" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-[#F0F2F5] text-[#415A77] border border-[#E0E1DD] flex items-center gap-1">
                  Keyword: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="cursor-pointer">
                    <X className="w-3 h-3 text-[#778DA9]" />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-[#778DA9] hover:text-[#0D1B2A] font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Case Table */}
      <div className="bg-white rounded-xl border border-[#E0E1DD] shadow-sm overflow-hidden">
        {filteredCases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#E0E1DD] text-[11px] font-bold text-[#415A77] uppercase tracking-wider">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Support Category</th>
                  <th className="py-3 px-4">Assigned Date</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Last Interaction</th>
                  <th className="py-3 px-4">Next Follow-up</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E1DD] text-xs">
                {filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigateTo(`/cases/${c.id}`, c.id)}
                    className="hover:bg-[#F8F9FA] transition-colors cursor-pointer group"
                  >
                    {/* Case ID & Personnel */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0D1B2A] group-hover:text-[#588157] transition-colors">
                        {c.id}
                      </div>
                      <div className="text-[11px] text-[#778DA9] font-normal truncate max-w-xs mt-0.5">
                        {c.personnelRef}
                      </div>
                    </td>

                    {/* Support Category */}
                    <td className="py-3.5 px-4 font-medium text-[#415A77]">
                      <span className="inline-block px-2 py-0.5 rounded bg-[#F0F2F5] text-[#415A77] border border-[#E0E1DD] text-[11px]">
                        {c.supportCategory}
                      </span>
                    </td>

                    {/* Assigned Date */}
                    <td className="py-3.5 px-4 text-[#415A77] font-normal">
                      {c.assignedDate}
                    </td>

                    {/* Current Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.currentStatus} size="sm" />
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    {/* Last Interaction */}
                    <td className="py-3.5 px-4 text-[#415A77] font-normal">
                      {c.lastInteraction}
                    </td>

                    {/* Next Follow-up */}
                    <td className="py-3.5 px-4 text-[#415A77]">
                      {c.nextFollowUp ? (
                        <span className="inline-flex items-center gap-1 font-medium text-[#0D1B2A]">
                          <Calendar className="w-3 h-3 text-[#778DA9]" />
                          {c.nextFollowUp}
                        </span>
                      ) : (
                        <span className="text-[#778DA9] text-[11px]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCaseForSession(c.id);
                            setScheduleModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-[#415A77] bg-white border border-[#E0E1DD] rounded-md hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                          title="Schedule Session"
                        >
                          Schedule
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo(`/cases/${c.id}`, c.id)}
                          className="p-1 text-[#778DA9] hover:text-[#588157] hover:bg-[#ECF3ED] rounded-md transition-colors cursor-pointer"
                          title="Open Workspace"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No cases matching criteria"
            description="Try changing your search query, or clear selected status and category filters to see more results."
            actionLabel="Reset All Filters"
            onAction={resetFilters}
          />
        )}
      </div>

      {/* Reusable Session Schedule Modal */}
      <ScheduleSessionModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        preselectedCaseId={selectedCaseForSession}
      />
    </div>
  );
};
