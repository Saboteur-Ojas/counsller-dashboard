import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  Calendar,
  CheckCheck,
  ExternalLink,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VeerSetuLogo } from '../common/VeerSetuLogo';

export const TopNavbar: React.FC = () => {
  const {
    user,
    notifications,
    unreadNotifCount,
    markNotificationRead,
    markAllNotificationsRead,
    navigateTo,
    cases,
    sidebarCollapsed,
    setSidebarCollapsed,
    logout,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter cases for quick jump
  const filteredCases = searchQuery.trim()
    ? cases.filter(
        (c) =>
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.personnelRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.supportCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.forceUnit.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleCaseSelect = (caseId: string) => {
    navigateTo(`/cases/${caseId}`, caseId);
    setSearchQuery('');
    setSearchFocused(false);
  };

  const todayStr = 'Friday, 04 September 2026';

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E0E1DD] h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left side: Mobile menu toggle & greeting/date */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="lg:hidden p-2 rounded-lg text-[#778DA9] hover:text-[#1B263B] hover:bg-[#F0F2F5] cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <VeerSetuLogo size={28} />
          <span className="font-semibold text-sm text-[#0D1B2A] tracking-tight">VeerSetu</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#415A77] bg-[#F0F2F5] px-2.5 py-1 rounded-full border border-[#E0E1DD]">
          <Calendar className="w-3.5 h-3.5 text-[#778DA9]" />
          <span>{todayStr}</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#588157] bg-[#ECF3ED] px-2.5 py-1 rounded-full border border-[#CDE3CF] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#588157]" />
          <span>Restricted Medical / Welfare Shield</span>
        </div>
      </div>

      {/* Middle: Quick Case Finder */}
      <div className="relative flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#778DA9] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search Case ID, Personnel ref, or Unit..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F9FA] border border-[#E0E1DD] rounded-lg text-[#1B263B] placeholder-[#778DA9] focus:outline-none focus:ring-2 focus:ring-[#588157]/20 focus:border-[#588157] transition-all focus:bg-white"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchFocused && searchQuery.trim() && (
          <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-xl shadow-xl border border-[#E0E1DD] max-h-80 overflow-y-auto z-50 p-2 divide-y divide-[#E0E1DD] animate-in fade-in zoom-in-95">
            <div className="px-2 py-1 text-[11px] font-semibold text-[#778DA9] uppercase tracking-wider">
              Matching Cases ({filteredCases.length})
            </div>
            {filteredCases.length > 0 ? (
              filteredCases.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCaseSelect(c.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#F8F9FA] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#0D1B2A] group-hover:text-[#588157]">
                        {c.id}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F0F2F5] text-[#415A77] font-medium border border-[#E0E1DD]">
                        {c.supportCategory}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#778DA9] truncate mt-0.5">
                      {c.personnelRef} • {c.forceUnit}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#778DA9] group-hover:text-[#588157] ml-2 shrink-0" />
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-[#778DA9]">
                No cases matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side: Notifications & Profile Menu */}
      <div className="flex items-center gap-2">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-toggle-btn"
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-[#415A77] hover:text-[#0D1B2A] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E63946] ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#E0E1DD] overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 bg-[#F0F2F5] border-b border-[#E0E1DD] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#0D1B2A]">Notifications</span>
                  {unreadNotifCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#FEF2F2] text-[#E63946] border border-[#FEE2E2]">
                      {unreadNotifCount} new
                    </span>
                  )}
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#588157] hover:text-[#3A5A40] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E0E1DD]">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.targetCaseId) {
                          handleCaseSelect(n.targetCaseId);
                          setNotifOpen(false);
                        }
                      }}
                      className={`p-3.5 text-left transition-colors cursor-pointer ${
                        !n.read ? 'bg-[#ECF3ED]/50 hover:bg-[#ECF3ED]/80' : 'hover:bg-[#F8F9FA]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#0D1B2A] leading-tight">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-[#778DA9] shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#415A77] mt-1 leading-relaxed">{n.message}</p>
                      {n.targetCaseId && (
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-[#588157]">
                          <span>View Case Record</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-[#778DA9]">
                    No notifications at this time.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            id="user-profile-menu-btn"
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#F0F2F5] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#1B263B] text-[#E0E1DD] font-semibold text-xs flex items-center justify-center border border-[#415A77] shadow-xs">
              {user ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'AS'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#1B263B] leading-tight">
                {user?.name || 'Dr. Ananya Sharma'}
              </span>
              <span className="text-[10px] text-[#778DA9]">{user?.counsellorId || 'CNS-CAPF-8821'}</span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E0E1DD] overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="p-4 bg-[#F0F2F5] border-b border-[#E0E1DD]">
                <p className="text-xs font-bold text-[#0D1B2A]">{user?.name}</p>
                <p className="text-[11px] text-[#588157] font-semibold mt-0.5">{user?.specialization}</p>
                <p className="text-[10px] text-[#778DA9] mt-1 truncate">{user?.dutyStation}</p>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    navigateTo('/settings');
                    setProfileOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg text-xs text-[#1B263B] hover:bg-[#F8F9FA] flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#778DA9]" />
                  <span>Counsellor Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full px-3 py-2 rounded-lg text-xs text-[#E63946] hover:bg-[#FEF2F2] flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#E63946]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
