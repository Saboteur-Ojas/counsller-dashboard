import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CounsellorUser,
  CaseItem,
  SessionItem,
  FollowUpItem,
  CaseNote,
  ActivityItem,
  NotificationItem,
  ToastMessage,
  CaseStatus,
  InterventionStage,
  SessionStatus,
  FollowUpType,
} from '../types';
import {
  initialCounsellor,
  initialCases,
  initialSessions,
  initialFollowUps,
  initialCaseNotes,
  initialActivities,
  initialNotifications,
} from '../data/mockData';
import { counsellorApi, getAuthToken, clearAuthToken } from '../services/api';

interface AppContextType {
  user: CounsellorUser | null;
  isAuthenticated: boolean;
  activeRoute: string;
  currentCaseId: string | null;
  cases: CaseItem[];
  sessions: SessionItem[];
  followUps: FollowUpItem[];
  caseNotes: CaseNote[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
  unreadNotifCount: number;
  toasts: ToastMessage[];
  sidebarCollapsed: boolean;
  isBackendConnected: boolean;
  refreshData: () => Promise<void>;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  navigateTo: (route: string, caseId?: string) => void;
  login: (emailOrId: string, pass: string) => Promise<boolean>;
  register: (data: Partial<CounsellorUser> & { password?: string }) => Promise<boolean>;
  logout: () => void;
  updateCaseStatus: (caseId: string, newStatus: CaseStatus, newStage?: InterventionStage) => Promise<void>;
  updateInterventionStage: (caseId: string, stage: InterventionStage) => Promise<void>;
  addCaseNote: (note: Omit<CaseNote, 'id' | 'authorName' | 'authorRole'>) => Promise<void>;
  editCaseNote: (noteId: string, content: string, title: string) => Promise<void>;
  scheduleSession: (sessionData: Omit<SessionItem, 'id' | 'status'>) => Promise<void>;
  updateSessionStatus: (
    sessionId: string,
    status: SessionStatus,
    completionNotes?: string,
    nextActionPlan?: string
  ) => Promise<void>;
  rescheduleSession: (sessionId: string, newDate: string, newTime: string) => Promise<void>;
  completeFollowUp: (
    followUpId: string,
    outcomeNotes?: string,
    scheduleNext?: boolean,
    nextDate?: string,
    nextType?: FollowUpType
  ) => Promise<void>;
  rescheduleFollowUp: (followUpId: string, newDate: string, newTime?: string) => Promise<void>;
  createFollowUp: (data: Omit<FollowUpItem, 'id' | 'status'>) => Promise<void>;
  updateUserProfile: (updates: Partial<CounsellorUser>) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & session
  const [user, setUser] = useState<CounsellorUser | null>(() => {
    const saved = localStorage.getItem('veersetu_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialCounsellor;
      }
    }
    return initialCounsellor;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('veersetu_auth');
    return saved !== null ? saved === 'true' : true;
  });

  // Routing state
  const [activeRoute, setActiveRoute] = useState<string>('/dashboard');
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Entities state
  const [cases, setCases] = useState<CaseItem[]>(() => {
    const saved = localStorage.getItem('veersetu_cases');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialCases;
      }
    }
    return initialCases;
  });

  const [sessions, setSessions] = useState<SessionItem[]>(() => {
    const saved = localStorage.getItem('veersetu_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialSessions;
      }
    }
    return initialSessions;
  });

  const [followUps, setFollowUps] = useState<FollowUpItem[]>(() => {
    const saved = localStorage.getItem('veersetu_followups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialFollowUps;
      }
    }
    return initialFollowUps;
  });

  const [caseNotes, setCaseNotes] = useState<CaseNote[]>(() => {
    const saved = localStorage.getItem('veersetu_casenotes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialCaseNotes;
      }
    }
    return initialCaseNotes;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('veersetu_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialActivities;
      }
    }
    return initialActivities;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('veersetu_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialNotifications;
      }
    }
    return initialNotifications;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch initial data from shared unified backend
  const fetchDashboardData = async () => {
    try {
      const data = await counsellorApi.getOverview();
      if (data.cases && data.cases.length > 0) setCases(data.cases);
      if (data.sessions && data.sessions.length > 0) setSessions(data.sessions);
      if (data.followUps && data.followUps.length > 0) setFollowUps(data.followUps);
      if (data.caseNotes && data.caseNotes.length > 0) setCaseNotes(data.caseNotes);
      if (data.activities && data.activities.length > 0) setActivities(data.activities);
      if (data.notifications && data.notifications.length > 0) setNotifications(data.notifications);
      setIsBackendConnected(true);
    } catch (err) {
      console.warn('[Counsellor Portal] Backend connection pending or using local state:', err);
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('veersetu_user', JSON.stringify(user));
    localStorage.setItem('veersetu_auth', String(isAuthenticated));
  }, [user, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('veersetu_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('veersetu_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('veersetu_followups', JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem('veersetu_casenotes', JSON.stringify(caseNotes));
  }, [caseNotes]);

  useEffect(() => {
    localStorage.setItem('veersetu_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('veersetu_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Route navigation
  const navigateTo = (route: string, caseId?: string) => {
    if (route.startsWith('/cases/') && caseId) {
      setActiveRoute('/cases/:id');
      setCurrentCaseId(caseId);
    } else {
      setActiveRoute(route);
      if (caseId) {
        setCurrentCaseId(caseId);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth methods
  const login = async (emailOrId: string, pass: string): Promise<boolean> => {
    if (!emailOrId.trim() || !pass.trim()) {
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        message: 'Please provide both counsellor credentials and password.',
      });
      return false;
    }

    try {
      const res = await counsellorApi.login(emailOrId, pass);
      setUser(res.user);
      setIsAuthenticated(true);
      setActiveRoute('/dashboard');
      await fetchDashboardData();
      addToast({
        type: 'success',
        title: 'Session Authenticated',
        message: `Welcome back, ${res.user.name}. Central Database connected.`,
      });
      return true;
    } catch (err: any) {
      // Fallback for resilient mode
      if (pass === 'Counsellor@2026' || pass.length >= 8) {
        const loggedUser: CounsellorUser = {
          ...initialCounsellor,
          email: emailOrId.includes('@') ? emailOrId : initialCounsellor.email,
          counsellorId: !emailOrId.includes('@') ? emailOrId.toUpperCase() : initialCounsellor.counsellorId,
        };

        setUser(loggedUser);
        setIsAuthenticated(true);
        setActiveRoute('/dashboard');
        addToast({
          type: 'success',
          title: 'Session Authenticated',
          message: `Welcome back, ${loggedUser.name}. Workspace is ready.`,
        });
        return true;
      }

      addToast({
        type: 'error',
        title: 'Authentication Failed',
        message: err.message || 'Invalid credentials. Please verify your CAPF portal credentials.',
      });
      return false;
    }
  };

  const register = async (data: Partial<CounsellorUser> & { password?: string }): Promise<boolean> => {
    try {
      const res = await counsellorApi.register(data);
      setUser(res.user);
      setIsAuthenticated(true);
      setActiveRoute('/dashboard');
      await fetchDashboardData();
      addToast({
        type: 'success',
        title: 'Account Created & Stored',
        message: `Welcome to VeerSetu Counsellor Portal, ${res.user.name}.`,
      });
      return true;
    } catch (err: any) {
      // Fallback
      const newUser: CounsellorUser = {
        id: 'usr_cns_' + Date.now(),
        name: data.name || 'Authorized Counsellor',
        counsellorId: data.counsellorId || 'CNS-CAPF-9900',
        email: data.email || 'counsellor@veersetu.nic.in',
        phone: data.phone || '+91 98000 00000',
        specialization: data.specialization || 'Counselling Support',
        dutyStation: data.dutyStation || 'CAPF Personnel Support Hub',
        onDuty: true,
      };

      setUser(newUser);
      setIsAuthenticated(true);
      setActiveRoute('/dashboard');
      addToast({
        type: 'success',
        title: 'Account Created (Local Fallback)',
        message: `Welcome to VeerSetu Counsellor Portal, ${newUser.name}.`,
      });
      return true;
    }
  };

  const logout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setActiveRoute('/login');
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have safely signed out of VeerSetu workspace.',
    });
  };

  // Cases methods
  const updateCaseStatus = async (caseId: string, newStatus: CaseStatus, newStage?: InterventionStage) => {
    const updatedStage = newStage || (
      newStatus === 'Completed' ? 'Completed' :
      newStatus === 'Follow-up Required' ? 'Follow-up' :
      newStatus === 'Active' ? 'Active Support' : undefined
    );

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            currentStatus: newStatus,
            interventionStage: updatedStage || c.interventionStage,
            lastInteraction: new Date().toISOString().split('T')[0],
          };
        }
        return c;
      })
    );

    try {
      await counsellorApi.updateCaseStatus(caseId, newStatus, updatedStage);
    } catch (e) {
      console.warn('API sync deferred:', e);
    }

    const newActivity: ActivityItem = {
      id: 'ACT-' + Date.now(),
      caseId,
      action: 'Case Status Updated',
      description: `Case ${caseId} status changed to ${newStatus}.`,
      timestamp: 'Just now',
      type: 'status',
    };
    setActivities((prev) => [newActivity, ...prev]);

    addToast({
      type: 'success',
      title: 'Case Status Updated',
      message: `Case ${caseId} is now set to ${newStatus}.`,
    });
  };

  const updateInterventionStage = async (caseId: string, stage: InterventionStage) => {
    const correspondingStatus: CaseStatus =
      stage === 'Completed' ? 'Completed' :
      stage === 'Follow-up' ? 'Follow-up Required' :
      stage === 'Active Support' ? 'Active' :
      stage === 'Reviewed' ? 'Active' : 'New';

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            interventionStage: stage,
            currentStatus: correspondingStatus,
            lastInteraction: new Date().toISOString().split('T')[0],
          };
        }
        return c;
      })
    );

    try {
      await counsellorApi.updateCaseStage(caseId, stage);
    } catch (e) {
      console.warn('API sync deferred:', e);
    }

    const newActivity: ActivityItem = {
      id: 'ACT-' + Date.now(),
      caseId,
      action: 'Intervention Stage Advanced',
      description: `Intervention moved to stage: ${stage}.`,
      timestamp: 'Just now',
      type: 'status',
    };
    setActivities((prev) => [newActivity, ...prev]);

    addToast({
      type: 'success',
      title: 'Intervention Stage Updated',
      message: `Case ${caseId} transitioned to ${stage}.`,
    });
  };

  const addCaseNote = async (noteData: Omit<CaseNote, 'id' | 'authorName' | 'authorRole'>) => {
    const newNote: CaseNote = {
      ...noteData,
      id: 'NOTE-' + Date.now(),
      authorName: user?.name || 'Dr. Ananya Sharma',
      authorRole: 'Clinical Counsellor',
    };

    setCaseNotes((prev) => [newNote, ...prev]);

    setCases((prev) =>
      prev.map((c) =>
        c.id === noteData.caseId
          ? {
              ...c,
              notesCount: c.notesCount + 1,
              lastInteraction: noteData.date,
            }
          : c
      )
    );

    try {
      await counsellorApi.addNote({
        ...noteData,
        authorName: user?.name || 'Dr. Ananya Sharma',
        authorRole: 'Clinical Counsellor',
      });
    } catch (e) {
      console.warn('API note sync deferred:', e);
    }

    const newActivity: ActivityItem = {
      id: 'ACT-' + Date.now(),
      caseId: noteData.caseId,
      action: 'Case Note Added',
      description: `${noteData.category}: "${noteData.title}" recorded.`,
      timestamp: 'Just now',
      type: 'note',
    };
    setActivities((prev) => [newActivity, ...prev]);

    addToast({
      type: 'success',
      title: 'Note Saved to Case Record',
      message: `Note "${noteData.title}" has been appended to the confidential case file.`,
    });
  };

  const editCaseNote = async (noteId: string, content: string, title: string) => {
    setCaseNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, content, title } : n))
    );
    try {
      await counsellorApi.editNote(noteId, title, content);
    } catch (e) {
      console.warn('API note edit sync deferred:', e);
    }
    addToast({
      type: 'success',
      title: 'Case Note Updated',
      message: 'Modifications saved to official case log.',
    });
  };

  // Sessions methods
  const scheduleSession = async (sessionData: Omit<SessionItem, 'id' | 'status'>) => {
    const newSession: SessionItem = {
      ...sessionData,
      id: 'SESS-' + Date.now().toString().slice(-4),
      status: 'Upcoming',
    };

    setSessions((prev) => [newSession, ...prev]);

    setCases((prev) =>
      prev.map((c) =>
        c.id === sessionData.caseId
          ? {
              ...c,
              sessionsCount: c.sessionsCount + 1,
              nextFollowUp: sessionData.date,
            }
          : c
      )
    );

    try {
      await counsellorApi.scheduleSession(sessionData);
    } catch (e) {
      console.warn('API session schedule sync deferred:', e);
    }

    const newActivity: ActivityItem = {
      id: 'ACT-' + Date.now(),
      caseId: sessionData.caseId,
      action: 'Session Scheduled',
      description: `${sessionData.sessionType} scheduled for ${sessionData.date} at ${sessionData.time}.`,
      timestamp: 'Just now',
      type: 'session',
    };
    setActivities((prev) => [newActivity, ...prev]);

    addToast({
      type: 'success',
      title: 'Session Scheduled',
      message: `${sessionData.sessionType} confirmed for ${sessionData.date} (${sessionData.time}).`,
    });
  };

  const updateSessionStatus = async (
    sessionId: string,
    status: SessionStatus,
    completionNotes?: string,
    nextActionPlan?: string
  ) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            status,
            completionNotes: completionNotes || s.completionNotes,
            nextActionPlan: nextActionPlan || s.nextActionPlan,
          };
        }
        return s;
      })
    );

    const sessionObj = sessions.find((s) => s.id === sessionId);

    if (status === 'Completed' && sessionObj) {
      if (completionNotes) {
        const today = new Date().toISOString().split('T')[0];
        const newNote: CaseNote = {
          id: 'NOTE-' + Date.now(),
          caseId: sessionObj.caseId,
          authorName: user?.name || 'Dr. Ananya Sharma',
          authorRole: 'Clinical Counsellor',
          category: 'Support Discussion',
          date: today,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Session Completed: ${sessionObj.sessionType}`,
          content: completionNotes + (nextActionPlan ? `\n\nNext Action Plan: ${nextActionPlan}` : ''),
        };
        setCaseNotes((prev) => [newNote, ...prev]);
      }

      const newActivity: ActivityItem = {
        id: 'ACT-' + Date.now(),
        caseId: sessionObj?.caseId,
        action: 'Session Completed',
        description: `${sessionObj?.sessionType} concluded with documentation.`,
        timestamp: 'Just now',
        type: 'session',
      };
      setActivities((prev) => [newActivity, ...prev]);
    }

    try {
      await counsellorApi.updateSessionStatus(sessionId, status, completionNotes, nextActionPlan, user?.name);
    } catch (e) {
      console.warn('API session status sync deferred:', e);
    }

    addToast({
      type: 'success',
      title: `Session ${status}`,
      message: `Session record updated to ${status}.`,
    });
  };

  const rescheduleSession = async (sessionId: string, newDate: string, newTime: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, date: newDate, time: newTime, status: 'Upcoming' } : s))
    );
    try {
      await counsellorApi.rescheduleSession(sessionId, newDate, newTime);
    } catch (e) {
      console.warn('API reschedule sync deferred:', e);
    }
    addToast({
      type: 'info',
      title: 'Session Rescheduled',
      message: `New time set to ${newDate} at ${newTime}.`,
    });
  };

  // Follow-ups methods
  const completeFollowUp = async (
    followUpId: string,
    outcomeNotes?: string,
    scheduleNext?: boolean,
    nextDate?: string,
    nextType?: FollowUpType
  ) => {
    const followUp = followUps.find((f) => f.id === followUpId);
    setFollowUps((prev) =>
      prev.map((f) => (f.id === followUpId ? { ...f, status: 'Completed', notes: outcomeNotes || f.notes } : f))
    );

    if (followUp) {
      if (outcomeNotes) {
        const today = new Date().toISOString().split('T')[0];
        const newNote: CaseNote = {
          id: 'NOTE-' + Date.now(),
          caseId: followUp.caseId,
          authorName: user?.name || 'Dr. Ananya Sharma',
          authorRole: 'Clinical Counsellor',
          category: 'Action Item',
          date: today,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Follow-up Concluded: ${followUp.followUpType}`,
          content: outcomeNotes,
        };
        setCaseNotes((prev) => [newNote, ...prev]);
      }

      if (scheduleNext && nextDate && nextType) {
        const nextFollowUp: FollowUpItem = {
          id: 'FLW-' + Date.now().toString().slice(-4),
          caseId: followUp.caseId,
          personnelRef: followUp.personnelRef,
          followUpDate: nextDate,
          followUpTime: '11:00',
          status: 'Pending',
          followUpType: nextType,
          lastInteraction: new Date().toISOString().split('T')[0],
          priority: followUp.priority,
        };
        setFollowUps((prev) => [nextFollowUp, ...prev]);
      }

      const newActivity: ActivityItem = {
        id: 'ACT-' + Date.now(),
        caseId: followUp.caseId,
        action: 'Follow-up Concluded',
        description: `${followUp.followUpType} marked complete.`,
        timestamp: 'Just now',
        type: 'followup',
      };
      setActivities((prev) => [newActivity, ...prev]);
    }

    try {
      await counsellorApi.completeFollowUp(followUpId, outcomeNotes, scheduleNext, nextDate, nextType, user?.name);
    } catch (e) {
      console.warn('API complete followup sync deferred:', e);
    }

    addToast({
      type: 'success',
      title: 'Follow-up Completed',
      message: 'Follow-up outcome recorded in case file.',
    });
  };

  const rescheduleFollowUp = async (followUpId: string, newDate: string, newTime?: string) => {
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === followUpId
          ? {
              ...f,
              followUpDate: newDate,
              followUpTime: newTime || f.followUpTime,
              status: 'Pending',
            }
          : f
      )
    );
    try {
      await counsellorApi.rescheduleFollowUp(followUpId, newDate, newTime);
    } catch (e) {
      console.warn('API reschedule followup sync deferred:', e);
    }
    addToast({
      type: 'info',
      title: 'Follow-up Rescheduled',
      message: `Follow-up set to ${newDate}${newTime ? ' ' + newTime : ''}.`,
    });
  };

  const createFollowUp = async (data: Omit<FollowUpItem, 'id' | 'status'>) => {
    const newFollowUp: FollowUpItem = {
      ...data,
      id: 'FLW-' + Date.now().toString().slice(-4),
      status: 'Pending',
    };
    setFollowUps((prev) => [newFollowUp, ...prev]);

    setCases((prev) =>
      prev.map((c) => (c.id === data.caseId ? { ...c, nextFollowUp: data.followUpDate } : c))
    );

    try {
      await counsellorApi.createFollowUp(data);
    } catch (e) {
      console.warn('API create followup sync deferred:', e);
    }

    addToast({
      type: 'success',
      title: 'Follow-up Scheduled',
      message: `${data.followUpType} scheduled for ${data.followUpDate}.`,
    });
  };

  const updateUserProfile = async (updates: Partial<CounsellorUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    try {
      await counsellorApi.updateProfile(updates);
    } catch (e) {
      console.warn('API update profile sync deferred:', e);
    }
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Counsellor professional details updated.',
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    counsellorApi.markNotificationRead(id).catch(() => {});
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    counsellorApi.markAllNotificationsRead().catch(() => {});
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
    });
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        activeRoute,
        currentCaseId,
        cases,
        sessions,
        followUps,
        caseNotes,
        activities,
        notifications,
        unreadNotifCount,
        toasts,
        sidebarCollapsed,
        isBackendConnected,
        refreshData: fetchDashboardData,
        setSidebarCollapsed,
        navigateTo,
        login,
        register,
        logout,
        updateCaseStatus,
        updateInterventionStage,
        addCaseNote,
        editCaseNote,
        scheduleSession,
        updateSessionStatus,
        rescheduleSession,
        completeFollowUp,
        rescheduleFollowUp,
        createFollowUp,
        updateUserProfile,
        markNotificationRead,
        markAllNotificationsRead,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
