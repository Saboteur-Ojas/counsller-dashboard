import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
  HelpCircle,
  Flame,
  ShieldAlert,
  CalendarCheck,
} from 'lucide-react';
import { CaseStatus, CasePriority, SessionStatus, FollowUpStatus, InterventionStage } from '../../types';

interface StatusBadgeProps {
  status: CaseStatus | SessionStatus | FollowUpStatus | InterventionStage | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  switch (status) {
    case 'Active':
    case 'In Progress':
    case 'Active Support':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#ECF3ED] text-[#588157] border border-[#CDE3CF] ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#588157] animate-pulse" />
          <span>{status}</span>
        </span>
      );

    case 'New':
    case 'Request Received':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#F0F2F5] text-[#415A77] border border-[#E0E1DD] ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 text-[#415A77]" />
          <span>{status}</span>
        </span>
      );

    case 'Follow-up Required':
    case 'Follow-up':
    case 'Pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] ${sizeClasses}`}
        >
          <AlertCircle className="w-3 h-3 text-[#B45309]" />
          <span>{status}</span>
        </span>
      );

    case 'Completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#ECF3ED] text-[#3A5A40] border border-[#CDE3CF] ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3 text-[#3A5A40]" />
          <span>{status}</span>
        </span>
      );

    case 'On Hold':
    case 'Cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#F0F2F5] text-[#778DA9] border border-[#E0E1DD] ${sizeClasses}`}
        >
          <PauseCircle className="w-3 h-3 text-[#778DA9]" />
          <span>{status}</span>
        </span>
      );

    case 'Upcoming':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#F0F2F5] text-[#1B263B] border border-[#E0E1DD] ${sizeClasses}`}
        >
          <CalendarCheck className="w-3 h-3 text-[#588157]" />
          <span>Upcoming</span>
        </span>
      );

    case 'Overdue':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] text-[#E63946] border border-[#FEE2E2] ${sizeClasses}`}
        >
          <AlertCircle className="w-3 h-3 text-[#E63946]" />
          <span>Overdue</span>
        </span>
      );

    case 'Reviewed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#F0F2F5] text-[#415A77] border border-[#E0E1DD] ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3 text-[#415A77]" />
          <span>Reviewed</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#F0F2F5] text-[#778DA9] border border-[#E0E1DD] ${sizeClasses}`}
        >
          <HelpCircle className="w-3 h-3 text-[#778DA9]" />
          <span>{status}</span>
        </span>
      );
  }
};

interface PriorityBadgeProps {
  priority: CasePriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'Priority':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#FEF2F2] text-[#E63946] border border-[#FEE2E2]">
          <Flame className="w-3 h-3 text-[#E63946]" />
          Priority
        </span>
      );
    case 'Moderate':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
          <Clock className="w-3 h-3 text-[#B45309]" />
          Moderate
        </span>
      );
    case 'Routine':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#F0F2F5] text-[#415A77] border border-[#E0E1DD]">
          <ShieldAlert className="w-3 h-3 text-[#778DA9]" />
          Routine
        </span>
      );
  }
};
