import React, { useState } from 'react';
import { X, Calendar, Clock, Video, FileText, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SessionType, SessionMode } from '../../types';

interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCaseId?: string;
}

export const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({
  isOpen,
  onClose,
  preselectedCaseId,
}) => {
  const { cases, scheduleSession } = useApp();

  const activeCases = cases.filter((c) => c.currentStatus !== 'Completed');
  const defaultCaseId = preselectedCaseId || (activeCases.length > 0 ? activeCases[0].id : '');

  const [caseId, setCaseId] = useState<string>(defaultCaseId);
  const [date, setDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [time, setTime] = useState<string>('10:00');
  const [sessionType, setSessionType] = useState<SessionType>('Individual Counselling');
  const [mode, setMode] = useState<SessionMode>('Secure Tele-link');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;

    setSubmitting(true);
    const selectedCase = cases.find((c) => c.id === caseId);

    scheduleSession({
      caseId,
      personnelRef: selectedCase?.personnelRef || `Personnel (${caseId})`,
      sessionType,
      date,
      time,
      durationMinutes,
      mode,
      notes: notes.trim() || undefined,
    });

    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        id="schedule-session-modal"
        className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-[#E0E1DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E1DD] bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ECF3ED] flex items-center justify-center text-[#3A5A40]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0D1B2A]">Schedule Counselling Session</h2>
              <p className="text-xs text-[#778DA9]">Plan a confidential support appointment</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Select Case */}
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
                  {c.id} — {c.personnelRef} ({c.forceUnit.split('(')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
                Session Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
                Time <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                />
              </div>
            </div>
          </div>

          {/* Session Type */}
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              Session Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value as SessionType)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
            >
              <option value="Individual Counselling">Individual Counselling</option>
              <option value="Family Tele-Support">Family Tele-Support</option>
              <option value="Stress Debrief">Stress Debrief</option>
              <option value="Follow-up Check-in">Follow-up Check-in</option>
              <option value="Intake Assessment">Intake Assessment</option>
              <option value="Re-integration Check">Re-integration Check</option>
            </select>
          </div>

          {/* Mode & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
                Engagement Mode <span className="text-rose-500">*</span>
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as SessionMode)}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
              >
                <option value="Secure Tele-link">Secure Tele-link (Audio/Video)</option>
                <option value="Duty Station Office">Duty Station Office (In-Person)</option>
                <option value="Confidential Audio">Confidential Audio Tele-call</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
                Duration
              </label>
              <div className="flex gap-2">
                {[30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      durationMinutes === mins
                        ? 'bg-[#1B263B] text-white border-[#1B263B]'
                        : 'bg-[#F8F9FA] text-[#415A77] border-[#E0E1DD] hover:bg-[#F0F2F5]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Preparation Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              Preparation / Clinical Focus (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="E.g., Review sleep log; follow up on relaxation practice..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] resize-none"
            />
          </div>

          {/* Actions */}
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
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#588157] hover:bg-[#3A5A40] rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-70"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Schedule Session</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
