import React, { useState } from 'react';
import { X, CalendarPlus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FollowUpType, CasePriority } from '../../types';

interface CreateFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCaseId?: string;
}

export const CreateFollowUpModal: React.FC<CreateFollowUpModalProps> = ({
  isOpen,
  onClose,
  preselectedCaseId,
}) => {
  const { cases, createFollowUp } = useApp();

  const activeCases = cases.filter((c) => c.currentStatus !== 'Completed');
  const defaultCaseId = preselectedCaseId || (activeCases.length > 0 ? activeCases[0].id : '');

  const [caseId, setCaseId] = useState<string>(defaultCaseId);
  const [followUpDate, setFollowUpDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [followUpTime, setFollowUpTime] = useState<string>('11:00');
  const [followUpType, setFollowUpType] = useState<FollowUpType>('Sleep & Stress Follow-up');
  const [notes, setNotes] = useState<string>('');
  const [priority, setPriority] = useState<CasePriority>('Moderate');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;

    const selectedCase = cases.find((c) => c.id === caseId);

    createFollowUp({
      caseId,
      personnelRef: selectedCase?.personnelRef || `Personnel (${caseId})`,
      followUpDate,
      followUpTime,
      followUpType,
      lastInteraction: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
      priority,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        id="create-followup-modal"
        className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-[#E0E1DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E1DD] bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ECF3ED] flex items-center justify-center text-[#3A5A40]">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0D1B2A]">Schedule Follow-up Action</h2>
              <p className="text-xs text-[#778DA9]">Continuous welfare monitoring check-in</p>
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
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              Assigned Case <span className="text-rose-500">*</span>
            </label>
            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
            >
              {activeCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.personnelRef}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
                Target Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
                Preferred Time
              </label>
              <input
                type="time"
                value={followUpTime}
                onChange={(e) => setFollowUpTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
                Follow-up Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={followUpType}
                onChange={(e) => setFollowUpType(e.target.value as FollowUpType)}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
              >
                <option value="Welfare Wellness Check">Welfare Wellness Check</option>
                <option value="Sleep & Stress Follow-up">Sleep & Stress Follow-up</option>
                <option value="Family Communication Verify">Family Communication Verify</option>
                <option value="Duty Station Check-in">Duty Station Check-in</option>
                <option value="Medication & Rest Adherence">Medication & Rest Adherence</option>
                <option value="Post-Intervention Review">Post-Intervention Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CasePriority)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
              >
                <option value="Routine">Routine</option>
                <option value="Moderate">Moderate</option>
                <option value="Priority">Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              Follow-up Checklist / Objectives
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="E.g. Inquire about shift roster adjustment, check family welfare desk update..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] resize-none"
            />
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
              <Check className="w-3.5 h-3.5" />
              <span>Save Follow-up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
