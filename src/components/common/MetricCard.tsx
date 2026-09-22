import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  id: string;
  title: string;
  value: number | string;
  context: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
  accentLabel?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  context,
  icon: Icon,
  iconBgColor = 'bg-[#F0F2F5]',
  iconColor = 'text-[#415A77]',
  onClick,
  accentLabel,
}) => {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`group relative text-left w-full p-5 rounded-xl bg-white border border-[#E0E1DD] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 cursor-pointer`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#778DA9] mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#1B263B] tracking-tight">
              {value}
            </span>
            {accentLabel && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ECF3ED] text-[#588157]">
                {accentLabel}
              </span>
            )}
          </div>
          <p className="text-xs text-[#778DA9] mt-2 font-normal flex items-center gap-1.5 line-clamp-1">
            {context}
          </p>
        </div>

        <div
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${iconBgColor} ${iconColor} transition-transform group-hover:scale-105`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E0E1DD]/80 flex items-center justify-between text-xs text-[#778DA9] group-hover:text-[#1B263B] transition-colors">
        <span className="font-medium">View details</span>
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </button>
  );
};

