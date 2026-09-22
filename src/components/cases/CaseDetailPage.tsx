import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Plus,
  Send,
  Save,
  Edit2,
  ChevronRight,
  AlertCircle,
  Video,
  ListTodo,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { InterventionStage, CaseStatus, CaseNote } from '../../types';
import { ScheduleSessionModal } from '../modals/ScheduleSessionModal';
import { CreateFollowUpModal } from '../modals/CreateFollowUpModal';
import { CompleteSessionModal } from '../modals/CompleteSessionModal';

interface CaseDetailPageProps {
  caseId: string;
}

const STAGES: InterventionStage[] = [
  'Request Received',
  'Reviewed',
  'Active Support',
  'Follow-up',
  'Completed',
];

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseId }) => {
  const {
    cases,
    caseNotes,
    sessions,
    followUps,
    navigateTo,
    updateCaseStatus,
    updateInterventionStage,
    addCaseNote,
    editCaseNote,
    user,
  } = useApp();

  const currentCase = cases.find((c) => c.id === caseId);

  // New Note Form State
  const [noteCategory, setNoteCategory] = useState<
    'Clinical Observation' | 'Support Discussion' | 'Action Item' | 'Welfare Referral'
  >('Clinical Observation');
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [isSubmittingNote, setIsSubmittingNote] = useState<boolean>(false);

  // Editing existing note state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');

  // Modals state
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [createFollowUpOpen, setCreateFollowUpOpen] = useState<boolean>(false);
  const [completingSession, setCompletingSession] = useState<any>(null);

  if (!currentCase) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-800">Case Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested case ID "{caseId}" could not be located in your authorized workspace.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('/cases')}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg"
        >
          Return to All Cases
        </button>
      </div>
    );
  }

  // Filter notes, sessions, and follow-ups for this case
  const notesForCase = caseNotes.filter((n) => n.caseId === caseId);
  const sessionsForCase = sessions.filter((s) => s.caseId === caseId);
  const followUpsForCase = followUps.filter((f) => f.caseId === caseId);

  const currentStageIndex = STAGES.indexOf(currentCase.interventionStage);

  const handleCreateNote = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setIsSubmittingNote(true);
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    addCaseNote({
      caseId: currentCase.id,
      category: noteCategory,
      date: today,
      time: timeNow,
      title: noteTitle.trim() || `${noteCategory} Log`,
      content: noteContent.trim(),
      isDraft,
    });

    setNoteTitle('');
    setNoteContent('');
    setIsSubmittingNote(false);
  };

  const startEditNote = (note: CaseNote) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveEditedNote = (noteId: string) => {
    editCaseNote(noteId, editContent, editTitle);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb / Return */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo('/cases')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#415A77] hover:text-[#0D1B2A] bg-white px-3 py-1.5 rounded-lg border border-[#E0E1DD] shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Case Management</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Session</span>
          </button>
          <button
            type="button"
            onClick={() => setCreateFollowUpOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-[#415A77] rounded-lg border border-[#E0E1DD] hover:bg-[#F8F9FA] transition-colors shadow-xs cursor-pointer"
          >
            <ListTodo className="w-3.5 h-3.5 text-[#778DA9]" />
            <span>Create Follow-up</span>
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-[#0D1B2A] tracking-tight">
                {currentCase.id}
              </h1>
              <StatusBadge status={currentCase.currentStatus} />
              <PriorityBadge priority={currentCase.priority} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#778DA9]">
              <span className="font-semibold text-[#0D1B2A]">{currentCase.personnelRef}</span>
              <span>•</span>
              <span>{currentCase.forceUnit}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-[#F0F2F5] text-[#415A77] font-medium border border-[#E0E1DD]">
                {currentCase.supportCategory}
              </span>
            </div>
          </div>

          {/* Quick Status Control Dropdown */}
          <div className="flex items-center gap-3 bg-[#F8F9FA] p-2 rounded-xl border border-[#E0E1DD]">
            <span className="text-xs font-semibold text-[#415A77] pl-1">Case Status:</span>
            <select
              value={currentCase.currentStatus}
              onChange={(e) => updateCaseStatus(currentCase.id, e.target.value as CaseStatus)}
              className="text-xs font-semibold px-2.5 py-1.5 bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
            >
              <option value="New">New</option>
              <option value="Active">Active</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Privacy Note Banner */}
        <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E0E1DD] text-xs text-[#415A77] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#588157] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#0D1B2A]">Authorized Personnel Privacy Shield:</strong> Identity details are pseudonymized under CAPF Welfare Directives. Automated mood scores and psychometric rankings are restricted. Support is driven by professional counselling ethics.
          </p>
        </div>
      </div>

      {/* Intervention Progress Pipeline */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#0D1B2A]">Intervention Progression</h2>
            <p className="text-xs text-[#778DA9]">
              Standard operational stages for CAPF mental welfare and intervention support.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#778DA9]">Advance Stage:</span>
            <select
              value={currentCase.interventionStage}
              onChange={(e) => updateInterventionStage(currentCase.id, e.target.value as InterventionStage)}
              className="text-xs font-semibold px-2.5 py-1 bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-1 focus:ring-[#588157]"
            >
              {STAGES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Progress Pipeline */}
        <div className="pt-3 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              let cardBg = 'bg-[#F8F9FA] text-[#778DA9] border-[#E0E1DD]';
              if (isPast) {
                cardBg = 'bg-[#ECF3ED] text-[#3A5A40] border-[#CDE3CF]';
              } else if (isCurrent) {
                cardBg = 'bg-[#1B263B] text-white border-[#1B263B] shadow-sm';
              }

              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => updateInterventionStage(currentCase.id, stage)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${cardBg}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                      Step {idx + 1}
                    </span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-[#588157]" />}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-[#588157] animate-ping" />}
                  </div>
                  <p className="text-xs font-bold leading-tight truncate">{stage}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Case Overview: Structured Objective & Intake Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Case Details & Case Notes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Overview Card */}
          <div className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#0D1B2A] border-b border-[#E0E1DD] pb-3">
              Case Intake & Support Objectives
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-[#778DA9] uppercase tracking-wider text-[11px] block mb-1">
                  Reason for Support Request
                </span>
                <p className="text-[#0D1B2A] bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E0E1DD] leading-relaxed font-medium">
                  {currentCase.reasonForRequest}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#778DA9] uppercase tracking-wider text-[11px] block mb-1">
                  Current Support Objective & Therapeutic Direction
                </span>
                <p className="text-[#0D1B2A] bg-[#ECF3ED] p-3.5 rounded-xl border border-[#CDE3CF] leading-relaxed font-medium">
                  {currentCase.supportObjective}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E0E1DD] text-[#415A77]">
                <div>
                  <span className="text-[11px] text-[#778DA9] block">Assigned Counsellor</span>
                  <span className="font-semibold text-[#0D1B2A] text-xs">
                    {currentCase.assignedCounsellor}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#778DA9] block">Assigned Date</span>
                  <span className="font-semibold text-[#0D1B2A] text-xs">
                    {currentCase.assignedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Case Notes Workspace */}
          <div className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E0E1DD] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#0D1B2A]">Confidential Case Notes</h2>
                <p className="text-[11px] text-[#778DA9]">
                  Official clinical logs, observations, and inter-agency coordination
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0F2F5] text-[#415A77]">
                {notesForCase.length} Entries
              </span>
            </div>

            {/* Add New Note Box */}
            <form
              onSubmit={(e) => handleCreateNote(e, false)}
              className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E0E1DD] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#0D1B2A] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#588157]" />
                  Append New Case Note
                </span>

                {/* Category selector */}
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="text-xs font-medium px-2.5 py-1 bg-white border border-[#E0E1DD] rounded-lg text-[#415A77] focus:outline-none focus:ring-1 focus:ring-[#588157]"
                >
                  <option value="Clinical Observation">Clinical Observation</option>
                  <option value="Support Discussion">Support Discussion</option>
                  <option value="Action Item">Action Item</option>
                  <option value="Welfare Referral">Welfare Referral</option>
                </select>
              </div>

              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note Title or Subject (e.g. Sleep routine assessment, Family desk liaison)..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
              />

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={3}
                required
                placeholder="Type confidential case observations, coping mechanisms reviewed, follow-up recommendations..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] resize-none leading-relaxed"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => handleCreateNote(e as any, true)}
                  disabled={!noteContent.trim() || isSubmittingNote}
                  className="px-3 py-1.5 text-xs font-medium text-[#415A77] bg-white border border-[#E0E1DD] rounded-lg hover:bg-[#F0F2F5] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                >
                  <Save className="w-3 h-3 text-[#778DA9]" />
                  <span>Save Draft</span>
                </button>
                <button
                  type="submit"
                  disabled={!noteContent.trim() || isSubmittingNote}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1B263B] hover:bg-[#0D1B2A] rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Log Note to Record</span>
                </button>
              </div>
            </form>

            {/* Notes Timeline List */}
            <div className="space-y-4 pt-2">
              {notesForCase.length > 0 ? (
                notesForCase.map((note) => {
                  const isEditing = editingNoteId === note.id;

                  return (
                    <div
                      key={note.id}
                      className="p-4 rounded-xl border border-[#E0E1DD] bg-white hover:border-[#778DA9] transition-colors space-y-2.5 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F0F2F5] text-[#415A77] border border-[#E0E1DD]">
                            {note.category}
                          </span>
                          {note.isDraft && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                              Draft
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-[#778DA9]">
                          <span>{note.date} at {note.time}</span>
                          {!isEditing && (
                            <button
                              type="button"
                              onClick={() => startEditNote(note)}
                              className="text-[#778DA9] hover:text-[#0D1B2A] transition-colors cursor-pointer"
                              title="Edit note"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs border border-[#E0E1DD] rounded-lg text-[#0D1B2A]"
                          />
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            className="w-full px-2.5 py-1.5 text-xs border border-[#E0E1DD] rounded-lg text-[#0D1B2A] resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(null)}
                              className="px-2.5 py-1 text-xs text-[#778DA9] hover:bg-[#F0F2F5] rounded cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEditedNote(note.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-[#588157] hover:bg-[#3A5A40] rounded cursor-pointer"
                            >
                              Save Updates
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xs font-bold text-[#0D1B2A]">{note.title}</h3>
                          <p className="text-xs text-[#415A77] leading-relaxed whitespace-pre-line font-normal">
                            {note.content}
                          </p>
                          <div className="pt-2 border-t border-[#E0E1DD] text-[11px] text-[#778DA9]">
                            Logged by <strong className="text-[#0D1B2A] font-medium">{note.authorName}</strong> ({note.authorRole})
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-[#778DA9] bg-[#F8F9FA] rounded-xl border border-[#E0E1DD]">
                  No case notes logged yet. Use the form above to add an initial clinical entry.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Scheduled Sessions & Follow-up History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Scheduled Sessions for this case */}
          <div className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0E1DD] pb-3">
              <h2 className="text-sm font-bold text-[#0D1B2A]">Sessions for this Case</h2>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(true)}
                className="text-xs text-[#588157] hover:text-[#3A5A40] font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Session</span>
              </button>
            </div>

            {sessionsForCase.length > 0 ? (
              <div className="space-y-3">
                {sessionsForCase.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3.5 rounded-xl border border-[#E0E1DD] bg-[#F8F9FA] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0D1B2A]">{sess.sessionType}</span>
                      <StatusBadge status={sess.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#778DA9]">
                      <span>{sess.date}</span>
                      <span>•</span>
                      <span>{sess.time} ({sess.durationMinutes}m)</span>
                      <span>•</span>
                      <span>{sess.mode}</span>
                    </div>

                    {sess.completionNotes && (
                      <div className="p-2 rounded bg-white border border-[#E0E1DD] text-[11px] text-[#415A77] italic">
                        "{sess.completionNotes}"
                      </div>
                    )}

                    {sess.status === 'In Progress' && (
                      <button
                        type="button"
                        onClick={() => setCompletingSession(sess)}
                        className="w-full mt-1 py-1 px-2 text-xs font-semibold bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Conclude Session</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#778DA9] bg-[#F8F9FA] rounded-xl border border-[#E0E1DD]">
                No sessions booked for this case yet.
              </div>
            )}
          </div>

          {/* Follow-up Actions for this case */}
          <div className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0E1DD] pb-3">
              <h2 className="text-sm font-bold text-[#0D1B2A]">Follow-up Actions</h2>
              <button
                type="button"
                onClick={() => setCreateFollowUpOpen(true)}
                className="text-xs text-[#588157] hover:text-[#3A5A40] font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Follow-up</span>
              </button>
            </div>

            {followUpsForCase.length > 0 ? (
              <div className="space-y-3">
                {followUpsForCase.map((flw) => (
                  <div
                    key={flw.id}
                    className="p-3.5 rounded-xl border border-[#E0E1DD] bg-[#F8F9FA] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0D1B2A]">{flw.followUpType}</span>
                      <StatusBadge status={flw.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#778DA9]">
                      <Calendar className="w-3 h-3 text-[#778DA9]" />
                      <span>Scheduled: {flw.followUpDate}</span>
                    </div>
                    {flw.notes && (
                      <p className="text-[11px] text-[#415A77] bg-white p-2 rounded border border-[#E0E1DD]">
                        {flw.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#778DA9] bg-[#F8F9FA] rounded-xl border border-[#E0E1DD]">
                No active follow-ups scheduled for this case.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduleSessionModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        preselectedCaseId={currentCase.id}
      />

      <CreateFollowUpModal
        isOpen={createFollowUpOpen}
        onClose={() => setCreateFollowUpOpen(false)}
        preselectedCaseId={currentCase.id}
      />

      <CompleteSessionModal
        session={completingSession}
        isOpen={!!completingSession}
        onClose={() => setCompletingSession(null)}
      />
    </div>
  );
};
