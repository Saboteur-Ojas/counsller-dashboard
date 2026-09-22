import React from 'react';
import { LogOut, X, ShieldAlert } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/50 backdrop-blur-xs p-4">
      <div
        id="logout-modal"
        className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#E0E1DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E1DD] bg-[#F8F9FA]">
          <div className="flex items-center gap-2 text-[#0D1B2A] font-semibold text-base">
            <div className="w-8 h-8 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#B91C1C]">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Confirm Sign Out</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#778DA9] hover:text-[#0D1B2A] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-[#415A77] leading-relaxed">
            Are you sure you want to end your authorized session on the VeerSetu Counsellor Portal?
          </p>
          <div className="mt-3.5 p-3 rounded-lg bg-[#FEF3C7]/40 border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#D97706] mt-0.5" />
            <span>
              All active clinical notes and scheduled interventions are synchronized with your local workspace. Confidential records remain secured under CAPF protocols.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#F8F9FA] border-t border-[#E0E1DD]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#415A77] bg-white border border-[#E0E1DD] rounded-lg hover:bg-[#F0F2F5] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-medium text-white bg-[#1B263B] hover:bg-[#0D1B2A] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Confirm Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
