import React, { useState } from 'react';
import { X, CheckCircle2, CalendarPlus, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SessionItem, CaseStatus, FollowUpType } from '../../types';

interface CompleteSessionModalProps {
  session: SessionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CompleteSessionModal: React.FC<CompleteSessionModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const { updateSessionStatus, updateCaseStatus, createFollowUp, cases } = useApp();

  const [completionNotes, setCompletionNotes] = useState<string>('');
  const [nextActionPlan, setNextActionPlan] = useState<string>('');
  const [scheduleFollowUpCheck, setScheduleFollowUpCheck] = useState<boolean>(true);
  const [followUpDate, setFollowUpDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [followUpType, setFollowUpType] = useState<FollowUpType>('Sleep & Stress Follow-up');
  const [updateCaseStatusVal, setUpdateCaseStatusVal] = useState<CaseStatus>('Active');

  if (!isOpen || !session) return null;

  const currentCase = cases.find((c) => c.id === session.caseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mark session completed with completion notes
    updateSessionStatus(
      session.id,
      'Completed',
      completionNotes.trim() || 'Session concluded successfully with supportive engagement.',
      nextActionPlan.trim() || undefined
    );

    // 2. Schedule follow up if selected
    if (scheduleFollowUpCheck && followUpDate) {
      createFollowUp({
        caseId: session.caseId,
        personnelRef: session.personnelRef,
        followUpDate,
        followUpTime: '11:00',
        followUpType,
        lastInteraction: new Date().toISOString().split('T')[0],
        notes: nextActionPlan || 'Scheduled post-session verification.',
        priority: currentCase?.priority || 'Routine',
      });
    }

    // 3. Update case status if selected differently
    if (updateCaseStatusVal && currentCase && currentCase.currentStatus !== updateCaseStatusVal) {
      updateCaseStatus(session.caseId, updateCaseStatusVal);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        id="complete-session-modal"
        className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-[#E0E1DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E1DD] bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ECF3ED] flex items-center justify-center text-[#3A5A40]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0D1B2A]">Document & Conclude Session</h2>
              <p className="text-xs text-[#778DA9]">
                {session.sessionType} • {session.personnelRef}
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
          {/* Completion Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              Clinical / Support Session Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              required
              rows={3}
              placeholder="Summary of topics explored, emotional grounding techniques practiced, personnel receptivity, and clinical observations..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] resize-none leading-relaxed"
            />
          </div>

          {/* Action Plan */}
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              Agreed Next Action Plan
            </label>
            <input
              type="text"
              value={nextActionPlan}
              onChange={(e) => setNextActionPlan(e.target.value)}
              placeholder="E.g. Continue sleep diary, peer contact check, schedule next tele-link..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
            />
          </div>

          {/* Schedule Follow-up Checkbox & Controls */}
          <div className="p-3.5 rounded-lg bg-[#F8F9FA] border border-[#E0E1DD] space-y-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={scheduleFollowUpCheck}
                onChange={(e) => setScheduleFollowUpCheck(e.target.checked)}
                className="w-4 h-4 rounded text-[#588157] border-[#E0E1DD] focus:ring-[#588157]"
              />
              <span className="text-xs font-semibold text-[#0D1B2A] flex items-center gap-1.5">
                <CalendarPlus className="w-3.5 h-3.5 text-[#588157]" />
                Schedule Structured Follow-up for this Case
              </span>
            </label>

            {scheduleFollowUpCheck && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#E0E1DD]">
                <div>
                  <label className="block text-[11px] font-medium text-[#415A77] mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E0E1DD] rounded-md text-[#0D1B2A] focus:outline-none focus:ring-1 focus:ring-[#588157]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#415A77] mb-1">
                    Follow-up Focus
                  </label>
                  <select
                    value={followUpType}
                    onChange={(e) => setFollowUpType(e.target.value as FollowUpType)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E0E1DD] rounded-md text-[#0D1B2A] focus:outline-none focus:ring-1 focus:ring-[#588157]"
                  >
                    <option value="Sleep & Stress Follow-up">Sleep & Stress Follow-up</option>
                    <option value="Welfare Wellness Check">Welfare Wellness Check</option>
                    <option value="Family Communication Verify">Family Communication Verify</option>
                    <option value="Duty Station Check-in">Duty Station Check-in</option>
                    <option value="Medication & Rest Adherence">Medication & Rest Adherence</option>
                    <option value="Post-Intervention Review">Post-Intervention Review</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Update Case Status */}
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              Update Case Status
            </label>
            <select
              value={updateCaseStatusVal}
              onChange={(e) => setUpdateCaseStatusVal(e.target.value as CaseStatus)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
            >
              <option value="Active">Active (Ongoing Supportive Guidance)</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="On Hold">On Hold (Personnel On Movement / Duty)</option>
              <option value="Completed">Completed (Intervention Goals Reached)</option>
            </select>
          </div>

          {/* Footer Actions */}
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
              <FileCheck className="w-3.5 h-3.5" />
              <span>Complete & Archive Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
