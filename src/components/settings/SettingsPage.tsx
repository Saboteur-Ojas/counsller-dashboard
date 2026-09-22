import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Clock,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Mail,
  Phone,
  ShieldCheck,
  Laptop,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportCategory } from '../../types';

export const SettingsPage: React.FC = () => {
  const { user, updateUserProfile, addToast } = useApp();

  // Profile fields
  const [name, setName] = useState<string>(user?.name || 'Dr. Ananya Sharma');
  const [email, setEmail] = useState<string>(user?.email || 'a.sharma@veersetu.nic.in');
  const [phone, setPhone] = useState<string>(user?.phone || '+91 98112 34567');
  const [specialization, setSpecialization] = useState<SupportCategory>(
    user?.specialization || 'Psychological Support'
  );
  const [dutyStation, setDutyStation] = useState<string>(
    user?.dutyStation || 'CRPF Base Hospital, Sector 4, R.K. Puram, New Delhi'
  );

  // Availability
  const [shiftStart, setShiftStart] = useState<string>('09:00');
  const [shiftEnd, setShiftEnd] = useState<string>('17:30');
  const [urgentSupportAvailable, setUrgentSupportAvailable] = useState<boolean>(true);
  const [defaultSessionDuration, setDefaultSessionDuration] = useState<number>(45);

  // Notifications
  const [notifyNewCase, setNotifyNewCase] = useState<boolean>(true);
  const [notifySessionReminder, setNotifySessionReminder] = useState<boolean>(true);
  const [notifyFollowUpDue, setNotifyFollowUpDue] = useState<boolean>(true);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [pwdMessage, setPwdMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      specialization,
      dutyStation,
    });
    addToast({
      title: 'Profile Updated',
      message: 'Your official counsellor credentials and contact info have been saved.',
      type: 'success',
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPwdMessage({ type: 'error', text: 'Current password is required.' });
      return;
    }
    if (newPassword.length < 8) {
      setPwdMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPwdMessage({ type: 'success', text: 'Password successfully updated under CAPF portal policy.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
          Counsellor Portal Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#778DA9] mt-1">
          Configure professional profile, clinical availability hours, and portal security parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Profile & Availability */}
        <div className="lg:col-span-7 space-y-6">
          {/* Professional Profile Card */}
          <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0E1DD] pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#588157]" />
                <h2 className="text-sm font-bold text-[#0D1B2A]">Professional Profile</h2>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F0F2F5] text-[#415A77] border border-[#E0E1DD]">
                {user?.counsellorId || 'CNS-CAPF-8821'}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#0D1B2A] font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0D1B2A] font-semibold mb-1">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                  />
                </div>
                <div>
                  <label className="block text-[#0D1B2A] font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0D1B2A] font-semibold mb-1">Area of Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value as SupportCategory)}
                  className="w-full px-3 py-2 border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                >
                  <option value="Counselling Support">Counselling Support</option>
                  <option value="Psychological Support">Psychological Support</option>
                  <option value="Family Support">Family Support</option>
                  <option value="Stress Management">Stress Management</option>
                  <option value="Crisis Support">Crisis Support</option>
                  <option value="General Welfare Support">General Welfare Support</option>
                  <option value="Duty Station Transition">Duty Station Transition</option>
                </select>
              </div>

              <div>
                <label className="block text-[#0D1B2A] font-semibold mb-1">Assigned Station / Unit</label>
                <input
                  type="text"
                  value={dutyStation}
                  onChange={(e) => setDutyStation(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {/* Clinical Availability Hours */}
          <div className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E0E1DD] pb-3">
              <Clock className="w-4 h-4 text-[#588157]" />
              <h2 className="text-sm font-bold text-[#0D1B2A]">Availability & Duty Hours</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0D1B2A] font-semibold mb-1">Shift Start Time (IST)</label>
                  <input
                    type="time"
                    value={shiftStart}
                    onChange={(e) => setShiftStart(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0E1DD] rounded-lg text-[#0D1B2A]"
                  />
                </div>
                <div>
                  <label className="block text-[#0D1B2A] font-semibold mb-1">Shift End Time (IST)</label>
                  <input
                    type="time"
                    value={shiftEnd}
                    onChange={(e) => setShiftEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0E1DD] rounded-lg text-[#0D1B2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0D1B2A] font-semibold mb-1">Default Session Duration</label>
                <div className="flex gap-2">
                  {[30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDefaultSessionDuration(mins)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                        defaultSessionDuration === mins
                          ? 'bg-[#1B263B] text-white border-[#1B263B]'
                          : 'bg-white text-[#415A77] border-[#E0E1DD] hover:bg-[#F8F9FA]'
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgent toggle */}
              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E0E1DD] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#0D1B2A]">Active On-Call Status</p>
                  <p className="text-[11px] text-[#778DA9] mt-0.5">
                    Flag profile as immediately reachable for urgent psychological triage.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={urgentSupportAvailable}
                    onChange={(e) => setUrgentSupportAvailable(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#E0E1DD] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E0E1DD] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#588157]" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Security, Notifications, Audit */}
        <div className="lg:col-span-5 space-y-6">
          {/* Notification Preferences */}
          <div className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E0E1DD] pb-3">
              <Bell className="w-4 h-4 text-[#588157]" />
              <h2 className="text-sm font-bold text-[#0D1B2A]">Notification Alerts</h2>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifyNewCase}
                  onChange={(e) => setNotifyNewCase(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#588157] border-[#E0E1DD] focus:ring-[#588157]"
                />
                <div>
                  <span className="font-semibold text-[#0D1B2A] block">New Case Assignment</span>
                  <span className="text-[11px] text-[#778DA9]">Alert immediately when an intake case is assigned</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifySessionReminder}
                  onChange={(e) => setNotifySessionReminder(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#588157] border-[#E0E1DD] focus:ring-[#588157]"
                />
                <div>
                  <span className="font-semibold text-[#0D1B2A] block">Session 15-Min Reminder</span>
                  <span className="text-[11px] text-[#778DA9]">Receive alert prior to scheduled consultations</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifyFollowUpDue}
                  onChange={(e) => setNotifyFollowUpDue(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#588157] border-[#E0E1DD] focus:ring-[#588157]"
                />
                <div>
                  <span className="font-semibold text-[#0D1B2A] block">Follow-up Due Daily Summary</span>
                  <span className="text-[11px] text-[#778DA9]">Summary notification on morning shift startup</span>
                </div>
              </label>
            </div>
          </div>

          {/* Change Password / Security */}
          <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E0E1DD] pb-3">
              <Lock className="w-4 h-4 text-[#588157]" />
              <h2 className="text-sm font-bold text-[#0D1B2A]">Security & Credentials</h2>
            </div>

            {pwdMessage && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  pwdMessage.type === 'success'
                    ? 'bg-[#ECF3ED] border border-[#CDE3CF] text-[#3A5A40]'
                    : 'bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C]'
                }`}
              >
                {pwdMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#588157] mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#B91C1C] mt-0.5" />
                )}
                <span>{pwdMessage.text}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#0D1B2A] font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 border border-[#E0E1DD] rounded-lg text-[#0D1B2A]"
                />
              </div>

              <div>
                <label className="block text-[#0D1B2A] font-semibold mb-1">New Secure Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-1.5 border border-[#E0E1DD] rounded-lg text-[#0D1B2A]"
                />
              </div>

              <div>
                <label className="block text-[#0D1B2A] font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-1.5 border border-[#E0E1DD] rounded-lg text-[#0D1B2A]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#1B263B] text-white rounded-lg hover:bg-[#0D1B2A] transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* Active Session Audit */}
          <div className="bg-white p-6 rounded-xl border border-[#E0E1DD] shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-[#0D1B2A] flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#778DA9]" />
              <span>Current Session Audit</span>
            </h2>
            <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E0E1DD] text-xs space-y-1">
              <div className="flex justify-between text-[#415A77]">
                <span>Network Node:</span>
                <span className="font-mono text-[#0D1B2A]">NIC-GOV-GATEWAY (CAPF INET)</span>
              </div>
              <div className="flex justify-between text-[#415A77]">
                <span>IP Address:</span>
                <span className="font-mono text-[#0D1B2A]">10.142.68.21</span>
              </div>
              <div className="flex justify-between text-[#415A77]">
                <span>Encryption:</span>
                <span className="text-[#3A5A40] font-semibold">TLS 1.3 End-to-End</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
