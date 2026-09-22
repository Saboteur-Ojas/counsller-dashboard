import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Briefcase,
  BadgeCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportCategory } from '../../types';
import { VeerSetuLogo } from '../common/VeerSetuLogo';

export const AuthPage: React.FC = () => {
  const { login, register } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [rememberSession, setRememberSession] = useState<boolean>(true);
  const [forgotModalOpen, setForgotModalOpen] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotSubmitted, setForgotSubmitted] = useState<boolean>(false);

  // Login form state
  const [loginEmailOrId, setLoginEmailOrId] = useState<string>('a.sharma@veersetu.nic.in');
  const [loginPassword, setLoginPassword] = useState<string>('Counsellor@2026');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Register form state
  const [regFullName, setRegFullName] = useState<string>('');
  const [regCounsellorId, setRegCounsellorId] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regSpecialization, setRegSpecialization] = useState<SupportCategory>('Psychological Support');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regLoading, setRegLoading] = useState<boolean>(false);
  const [regError, setRegError] = useState<string>('');
  const [regSuccess, setRegSuccess] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmailOrId.trim()) {
      setLoginError('Please enter your Official Email or Counsellor ID.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your secure access password.');
      return;
    }

    setLoginLoading(true);
    try {
      const ok = await login(loginEmailOrId, loginPassword);
      setLoginLoading(false);
      if (!ok) {
        setLoginError('Invalid credentials. Please verify your official CAPF portal credentials.');
      }
    } catch (err: any) {
      setLoginLoading(false);
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regFullName.trim()) {
      setRegError('Full Name is required.');
      return;
    }
    if (!regCounsellorId.trim()) {
      setRegError('Professional / Counsellor ID is required (e.g. CNS-CRPF-9102).');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Valid official email address is required.');
      return;
    }
    if (!regPhone.trim()) {
      setRegError('Contact telephone number is required.');
      return;
    }
    if (regPassword.length < 8) {
      setRegError('Password must contain at least 8 characters with numbers and symbols.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    setRegLoading(true);
    try {
      const ok = await register({
        name: regFullName,
        counsellorId: regCounsellorId.toUpperCase(),
        email: regEmail,
        phone: regPhone,
        specialization: regSpecialization,
        dutyStation: 'CAPF Personnel Welfare Directorate',
        password: regPassword,
      });
      setRegLoading(false);
      if (ok) {
        setRegSuccess(true);
      }
    } catch (err: any) {
      setRegLoading(false);
      setRegError(err.message || 'Registration failed.');
    }
  };

  const fillDemoCredentials = () => {
    setLoginEmailOrId('a.sharma@veersetu.nic.in');
    setLoginPassword('Counsellor@2026');
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Accent Graphics */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center mb-3.5">
          <VeerSetuLogo size={68} />
        </div>
        <h1 className="text-2xl font-bold text-[#0D1B2A] tracking-tight flex items-center justify-center gap-2">
          <span>VeerSetu</span>
          <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-[#ECF3ED] text-[#3A5A40] border border-[#CDE3CF]">
            CAPF
          </span>
        </h1>
        <p className="text-xs text-[#778DA9] mt-1">
          Personnel Welfare & Support Ecosystem • Counsellor Portal
        </p>

        <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F2F5] border border-[#E0E1DD] text-[11px] text-[#415A77] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#588157]" />
          <span>Authorized Support Professionals Only</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-xl border border-[#E0E1DD]">
          {/* Segmented Control Tabs */}
          <div className="flex p-1 bg-[#F0F2F5] rounded-xl mb-6 border border-[#E0E1DD]">
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#0D1B2A] shadow-xs'
                  : 'text-[#778DA9] hover:text-[#0D1B2A]'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-register-btn"
              type="button"
              onClick={() => {
                setMode('register');
                setRegError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#0D1B2A] shadow-xs'
                  : 'text-[#778DA9] hover:text-[#0D1B2A]'
              }`}
            >
              Request Access / Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-xs text-[#B91C1C]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#B91C1C] mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1.5">
                  Official Email or Counsellor ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#778DA9] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email-input"
                    type="text"
                    value={loginEmailOrId}
                    onChange={(e) => setLoginEmailOrId(e.target.value)}
                    required
                    placeholder="e.g. a.sharma@veersetu.nic.in or CNS-CAPF-8821"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs text-[#588157] hover:text-[#3A5A40] font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#778DA9] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#778DA9] hover:text-[#0D1B2A] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="w-4 h-4 rounded text-[#588157] border-[#E0E1DD] focus:ring-[#588157]"
                  />
                  <span className="text-xs text-[#415A77]">Remember session on this device</span>
                </label>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#1B263B] hover:bg-[#0D1B2A] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {loginLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Authenticating Session...
                  </span>
                ) : (
                  <>
                    <span>Enter Counsellor Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Helper */}
              <div className="pt-4 border-t border-[#E0E1DD] text-center">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs text-[#3A5A40] hover:text-[#1B263B] font-medium inline-flex items-center gap-1.5 cursor-pointer bg-[#ECF3ED] border border-[#CDE3CF] px-3 py-1.5 rounded-lg transition-colors"
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-[#588157]" />
                  <span>Fill Demo Credentials (Dr. Ananya Sharma)</span>
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {regError && (
                <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2 text-xs text-[#B91C1C]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#B91C1C] mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 rounded-lg bg-[#ECF3ED] border border-[#CDE3CF] flex items-start gap-2 text-xs text-[#3A5A40]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#588157] mt-0.5" />
                  <span>Registration verified! Launching your portal workspace...</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#778DA9] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required
                    placeholder="e.g. Dr. Rajesh K. Verma"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1">
                    Counsellor ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={regCounsellorId}
                    onChange={(e) => setRegCounsellorId(e.target.value)}
                    required
                    placeholder="CNS-CRPF-9102"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#778DA9] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                      placeholder="+91 98123 45678"
                      className="w-full pl-8 pr-2.5 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1">
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#778DA9] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="name.force@veersetu.nic.in"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1">
                  Area of Specialization <span className="text-rose-500">*</span>
                </label>
                <select
                  value={regSpecialization}
                  onChange={(e) => setRegSpecialization(e.target.value as SupportCategory)}
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      placeholder="Min 8 chars"
                      className="w-full px-2.5 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A] uppercase tracking-wider mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                      placeholder="Repeat password"
                      className="w-full px-2.5 py-2 text-xs bg-white border border-[#E0E1DD] rounded-lg text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157]"
                    />
                  </div>
                </div>
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                disabled={regLoading}
                className="w-full mt-3 py-2.5 px-4 rounded-lg bg-[#588157] hover:bg-[#3A5A40] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {regLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Create Counsellor Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Security / Ethical Notice Footer */}
        <p className="text-center text-[11px] text-[#778DA9] mt-6 leading-relaxed max-w-sm mx-auto">
          VeerSetu operates under strict Indian Central Armed Police Forces (CAPF) personnel confidentiality mandates. All sessions and case notes are encrypted.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-[#E0E1DD] p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-semibold text-[#0D1B2A] mb-1">Password Recovery</h3>
            <p className="text-xs text-[#778DA9] mb-4">
              Enter your official CAPF email to receive secure recovery credentials via the Welfare Directorate.
            </p>
            {forgotSubmitted ? (
              <div className="p-3 rounded-lg bg-[#ECF3ED] border border-[#CDE3CF] text-xs text-[#3A5A40] mb-4">
                Recovery link dispatched to official inbox.
              </div>
            ) : (
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@veersetu.nic.in"
                className="w-full px-3 py-2 text-xs border border-[#E0E1DD] rounded-lg text-[#0D1B2A] mb-4 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-[#588157]"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(false);
                  setForgotSubmitted(false);
                }}
                className="px-3 py-1.5 text-xs text-[#415A77] hover:bg-[#F0F2F5] rounded-lg cursor-pointer"
              >
                Close
              </button>
              {!forgotSubmitted && (
                <button
                  type="button"
                  onClick={() => setForgotSubmitted(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1B263B] hover:bg-[#0D1B2A] rounded-lg cursor-pointer"
                >
                  Send Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
