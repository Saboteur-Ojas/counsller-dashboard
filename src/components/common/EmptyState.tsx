import React from 'react';
import { LucideIcon, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  id?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id = 'empty-state',
  icon: Icon = CheckCircle2,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div
      id={id}
      className="w-full py-12 px-6 flex flex-col items-center justify-center text-center rounded-xl bg-[#F8F9FA] border border-dashed border-[#E0E1DD]"
    >
      <div className="w-12 h-12 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[#415A77] mb-3.5">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-[#0D1B2A] mb-1">{title}</h3>
      <p className="text-xs text-[#778DA9] max-w-sm leading-relaxed mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#588157] text-white hover:bg-[#3A5A40] transition-colors shadow-sm cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
