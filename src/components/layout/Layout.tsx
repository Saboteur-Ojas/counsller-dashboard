import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { ToastContainer } from './ToastContainer';
import { useApp } from '../../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1B263B] flex">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <TopNavbar />

        {/* Dynamic Page Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Natural Tones System Footer */}
        <footer className="h-10 bg-[#E0E1DD]/60 border-t border-[#E0E1DD] flex items-center justify-between px-6 sm:px-8 text-[10px] text-[#778DA9] font-medium">
          <p>© 2026 VeerSetu Personnel Welfare Ecosystem • Central Armed Police Forces</p>
          <div className="hidden sm:flex gap-4 uppercase tracking-wider">
            <span>Confidential Care Protocol</span>
            <span>MHA Directive 2026</span>
            <span className="text-[#1B263B] font-bold">V 2.1.0</span>
          </div>
        </footer>
      </div>

      {/* Global Notification Toast Container */}
      <ToastContainer />
    </div>
  );
};

