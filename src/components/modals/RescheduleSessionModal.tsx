import React, { useState } from 'react';
import { X, CalendarClock, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SessionItem } from '../../types';

interface RescheduleSessionModalProps {
  session: SessionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RescheduleSessionModal: React.FC<RescheduleSessionModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const { rescheduleSession } = useApp();

  const [date, setDate] = useState<string>(session?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(session?.time || '10:00');

  if (!isOpen || !session) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rescheduleSession(session.id, date, time);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/50 backdrop-blur-xs p-4">
      <div
        id="reschedule-modal"
        className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#E0E1DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E1DD] bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ECF3ED] flex items-center justify-center text-[#3A5A40]">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0D1B2A]">Reschedule Session</h2>
              <p className="text-xs text-[#778DA9]">
                {session.sessionType} • {session.caseId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#778DA9] hover:text-[#0D1B2A] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-xs text-[#415A77] space-y-1">
            <p>
              <span className="font-semibold text-[#0D1B2A]">Current Slot:</span> {session.date} at{' '}
              {session.time}
            </p>
            <p>
              <span className="font-semibold text-[#0D1B2A]">Personnel Ref:</span>{' '}
              {session.personnelRef}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              New Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
              New Time Slot <span className="text-rose-500">*</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-[#588157] hover:bg-[#3A5A40] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Confirm New Slot</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
