import React, { useState } from 'react';
import { X, CheckCircle2, CalendarPlus, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FollowUpItem, FollowUpType, CaseStatus } from '../../types';

interface CompleteFollowUpModalProps {
  followUp: FollowUpItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CompleteFollowUpModal: React.FC<CompleteFollowUpModalProps> = ({
  followUp,
  isOpen,
  onClose,
}) => {
  const { completeFollowUp, updateCaseStatus, cases } = useApp();

  const [notes, setNotes] = useState<string>('');
  const [scheduleNext, setScheduleNext] = useState<boolean>(false);
  const [nextDate, setNextDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [nextType, setNextType] = useState<FollowUpType>('Welfare Wellness Check');
  const [caseStatusUpdate, setCaseStatusUpdate] = useState<CaseStatus>('Active');

  if (!isOpen || !followUp) return null;

  const currentCase = cases.find((c) => c.id === followUp.caseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeFollowUp(
      followUp.id,
      notes.trim() || 'Follow-up verification completed successfully.',
      scheduleNext,
      nextDate,
      nextType
    );

    if (caseStatusUpdate && currentCase && currentCase.currentStatus !== caseStatusUpdate) {
      updateCaseStatus(followUp.caseId, caseStatusUpdate);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        id="complete-followup-modal"
        className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-[#E0E1DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E1DD] bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ECF3ED] flex items-center justify-center text-[#3A5A40]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0D1B2A]">Record Follow-up Outcome</h2>
              <p className="text-xs text-[#778DA9]">
                {followUp.followUpType} • {followUp.caseId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#778DA9] hover:text-[#0D1B2A] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-xs text-[#415A77] space-y-1">
            <p>
              <span className="font-semibold text-[#0D1B2A]">Case Reference:</span>{' '}
              {followUp.personnelRef}
            </p>
            <p>
              <span className="font-semibold text-[#0D1B2A]">Scheduled Date:</span>{' '}
              {followUp.followUpDate} ({followUp.followUpTime || 'Morning slot'})
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              Follow-up Outcome & Observation <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              rows={3}
              placeholder="Record personnel wellness status, adherence to rest plan, family situation resolution, or further intervention needs..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] resize-none leading-relaxed"
            />
          </div>

          <div className="p-3.5 rounded-lg bg-[#F8F9FA] border border-[#E0E1DD] space-y-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={scheduleNext}
                onChange={(e) => setScheduleNext(e.target.checked)}
                className="w-4 h-4 rounded text-[#588157] border-[#E0E1DD] focus:ring-[#588157]"
              />
              <span className="text-xs font-semibold text-[#0D1B2A] flex items-center gap-1.5">
                <CalendarPlus className="w-3.5 h-3.5 text-[#588157]" />
                Schedule Next Step / Routine Check
              </span>
            </label>

            {scheduleNext && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#E0E1DD]">
                <div>
                  <label className="block text-[11px] font-medium text-[#415A77] mb-1">
                    Next Date
                  </label>
                  <input
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E0E1DD] rounded-md text-[#0D1B2A] focus:outline-none focus:ring-1 focus:ring-[#588157]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#415A77] mb-1">
                    Follow-up Type
                  </label>
                  <select
                    value={nextType}
                    onChange={(e) => setNextType(e.target.value as FollowUpType)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E0E1DD] rounded-md text-[#0D1B2A] focus:outline-none focus:ring-1 focus:ring-[#588157]"
                  >
                    <option value="Welfare Wellness Check">Welfare Wellness Check</option>
                    <option value="Sleep & Stress Follow-up">Sleep & Stress Follow-up</option>
                    <option value="Duty Station Check-in">Duty Station Check-in</option>
                    <option value="Post-Intervention Review">Post-Intervention Review</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              Update Case Status
            </label>
            <select
              value={caseStatusUpdate}
              onChange={(e) => setCaseStatusUpdate(e.target.value as CaseStatus)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
            >
              <option value="Active">Active (Keep in active support)</option>
              <option value="Follow-up Required">Follow-up Required (Requires ongoing checks)</option>
              <option value="Completed">Completed (Close intervention successfully)</option>
              <option value="On Hold">On Hold (Temporary pause)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-[#E0E1DD] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#415A77] bg-white border border-[#E0E1DD] rounded-lg hover:bg-[#F8F9FA] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#588157] hover:bg-[#3A5A40] rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Save & Complete Follow-up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
