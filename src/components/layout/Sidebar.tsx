import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderHeart,
  CalendarDays,
  ClockAlert,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';
import { VeerSetuLogo } from '../common/VeerSetuLogo';

export const Sidebar: React.FC = () => {
  const {
    activeRoute,
    navigateTo,
    logout,
    cases,
    sessions,
    followUps,
    sidebarCollapsed,
    setSidebarCollapsed,
    user,
  } = useApp();

  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  // Calculate active counts
  const activeCasesCount = cases.filter((c) => c.currentStatus !== 'Completed').length;
  const todaySessionsCount = sessions.filter((s) => s.date === '2026-09-04' && s.status === 'Upcoming').length;
  const pendingFollowUpsCount = followUps.filter((f) => f.status === 'Pending').length;

  const navItems = [
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'nav-cases',
      label: 'My Cases',
      route: '/cases',
      icon: FolderHeart,
      badge: activeCasesCount > 0 ? activeCasesCount : null,
      badgeColor: 'bg-[#415A77] text-white',
    },
    {
      id: 'nav-sessions',
      label: 'Sessions',
      route: '/sessions',
      icon: CalendarDays,
      badge: todaySessionsCount > 0 ? todaySessionsCount : null,
      badgeColor: 'bg-[#588157] text-white',
    },
    {
      id: 'nav-followups',
      label: 'Follow-ups',
      route: '/follow-ups',
      icon: ClockAlert,
      badge: pendingFollowUpsCount > 0 ? pendingFollowUpsCount : null,
      badgeColor: 'bg-[#E63946] text-white',
    },
    {
      id: 'nav-settings',
      label: 'Settings',
      route: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const isCurrentActive = (itemRoute: string) => {
    if (itemRoute === '/cases') {
      return activeRoute === '/cases' || activeRoute.startsWith('/cases/');
    }
    return activeRoute === itemRoute;
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 bottom-0 z-30 bg-[#0D1B2A] text-white border-r border-[#1B263B] transition-all duration-200 flex flex-col justify-between ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#1B263B]">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                <VeerSetuLogo size={36} />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white text-base tracking-tight">VeerSetu</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#1B263B] text-[#778DA9] border border-[#415A77]/40">
                      CAPF
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#778DA9] font-medium truncate">
                    Counsellor Portal
                  </span>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex items-center justify-center">
                <VeerSetuLogo size={32} />
              </div>
            )}

            {/* Collapse toggle button */}
            <button
              id="sidebar-toggle-btn"
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="hidden lg:flex p-1.5 rounded-lg text-[#778DA9] hover:text-white hover:bg-[#1B263B] transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* User Brief Bar (if not collapsed) */}
          {!sidebarCollapsed && user && (
            <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-[#1B263B]/60 border border-[#1B263B] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E0E1DD] text-[#0D1B2A] text-xs font-bold flex items-center justify-center shrink-0">
                {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#588157]" />
                  <span className="text-[10px] text-[#778DA9] font-medium">ID: {user.counsellorId || 'CN-2026-882'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const active = isCurrentActive(item.route);
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  id={item.id}
                  type="button"
                  onClick={() => navigateTo(item.route)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer group relative ${
                    active
                      ? 'bg-[#1B263B] text-white shadow-xs'
                      : 'text-[#778DA9] hover:bg-[#1B263B] hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                      active ? 'text-white' : 'opacity-70 text-[#778DA9] group-hover:text-white'
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge !== null && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-[#1B263B] text-[#E0E1DD] border border-[#415A77]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2.5 px-2.5 py-1 bg-[#1B263B] text-white text-xs font-medium rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: Confidentiality badge & Logout */}
        <div className="p-3 border-t border-[#1B263B] space-y-2">
          {!sidebarCollapsed && (
            <div className="p-2.5 rounded-lg bg-[#1B263B]/40 border border-[#1B263B] text-[11px] text-[#778DA9] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#588157] mt-0.5" />
              <div className="leading-tight">
                <span className="font-semibold text-white block mb-0.5">
                  Restricted Access
                </span>
                CAPF Mental Health & Welfare Directive
              </div>
            </div>
          )}

          <button
            id="nav-logout-btn"
            type="button"
            onClick={() => setShowLogoutModal(true)}
            title={sidebarCollapsed ? 'Sign Out' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#778DA9] hover:text-white hover:bg-[#1B263B] transition-colors cursor-pointer group relative"
          >
            <LogOut className="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100" />
            {!sidebarCollapsed && <span className="flex-1 text-left">Sign Out</span>}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2.5 px-2.5 py-1 bg-[#1B263B] text-white text-xs font-medium rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
