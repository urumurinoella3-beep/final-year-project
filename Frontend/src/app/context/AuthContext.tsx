import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { User, Issue, Notification, AuditLog, Comment, Department } from '../types';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  issues: Issue[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  departments: Department[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (user: Omit<User, 'id' | 'isActive'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  createIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<void>;
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<void>;
  addComment: (issueId: string, content: string) => Promise<void>;
  loadAuditLogs: () => Promise<void>;
  fetchIssueComments: (issueId: string) => Promise<Comment[]>;
  fetchIssueAuditLogs: (issueId: string) => Promise<AuditLog[]>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  getUnreadNotificationsCount: () => number;
  addAuditLog: (action: string, details: string, issueId?: string) => void;
  addDepartment: (department: Department) => void;
  removeDepartment: (department: Department) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialDepartments: Department[] = ['Finance', 'IT', 'HR', 'Operations', 'Customs', 'VAT', 'Compliance', 'Data Management'];

function mapUser(u: any): User {
  return {
    id: String(u.id),
    employeeId: u.employeeId,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    department: u.department,
    isActive: u.isActive,
    isFirstLogin: u.isFirstLogin,
  };
}

function toIsoTimestamp(createdAt: unknown): string {
  if (createdAt == null) return new Date().toISOString();
  if (typeof createdAt === 'string') {
    const normalized = createdAt.includes(' ') && !createdAt.includes('T') ? createdAt.replace(' ', 'T') : createdAt;
    const d = new Date(normalized);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }
  if (Array.isArray(createdAt) && createdAt.length >= 3) {
    const [y, m, d, h = 0, min = 0, s = 0] = createdAt as number[];
    return new Date(y, m - 1, d, h, min, s).toISOString();
  }
  return new Date().toISOString();
}

function mapAuditApiRow(r: Record<string, unknown>): AuditLog {
  const entityType = r.entityType != null ? String(r.entityType).toUpperCase() : '';
  const entityId = r.entityId as number | undefined | null;
  const issueId = entityType === 'ISSUE' && entityId != null ? String(entityId) : undefined;
  return {
    id: String(r.id),
    userId: String(r.userId),
    userName: String(r.userName ?? ''),
    userRole: r.userRole != null ? String(r.userRole) : undefined,
    action: String(r.action ?? ''),
    issueId,
    details: r.details != null ? String(r.details) : '',
    timestamp: toIsoTimestamp(r.createdAt),
  };
}

function mapIssueComment(c: Record<string, unknown>, issueId: string): Comment {
  return {
    id: String(c.id),
    issueId,
    userId: String(c.userId),
    userName: String(c.userName ?? ''),
    content: String(c.content ?? ''),
    createdAt: toIsoTimestamp(c.createdAt),
  };
}

function mapIssue(i: any): Issue {
  return {
    id: String(i.id),
    title: i.title,
    description: i.description,
    source: i.source,
    dataElement: i.dataElement,
    issueType: i.issueType,
    severity: i.severity,
    priority: i.priority,
    status: i.status,
    reportedBy: String(i.reportedBy),
    reportedByName: i.reportedByName,
    assignedTo: i.assignedTo ? String(i.assignedTo) : undefined,
    assignedToName: i.assignedToName,
    department: i.department,
    createdAt: i.createdAt,
    updatedAt: i.updatedAt,
    resolvedAt: i.resolvedAt,
    closedAt: i.closedAt,
    comments: [],
    attachments: [],
    isDelegated: i.isDelegated,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dqims_token'));
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  const api = async (path: string, options: RequestInit = {}, customToken?: string) => {
    const headers = customToken 
      ? { Authorization: `Bearer ${customToken}` }
      : authHeaders;
    
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Request failed');
    }
    if (res.status === 204) return null;
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : null;
  };

  const loadUsers = async () => {
    try {
      // Admin gets all users, HOD gets only their department users
      if (currentUser?.role === 'ADMIN') {
        const data = await api('/users');
        setUsers(Array.isArray(data) ? data.map(mapUser) : []);
      } else if (currentUser?.role === 'HOD' && currentUser?.department) {
        const data = await api(`/users/department/${encodeURIComponent(currentUser.department)}`);
        setUsers(Array.isArray(data) ? data.map(mapUser) : []);
      } else {
        // STAFF and other roles don't need to see all users
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    }
  };

  const loadIssues = async () => {
    const data = await api('/issues?page=0&size=200');
    const content = data?.content || [];
    setIssues(content.map(mapIssue));
  };

  const loadAuditLogs = async () => {
    try {
      const data = await api('/audit-logs');
      const list = Array.isArray(data) ? data : [];
      setAuditLogs(list.map((r: Record<string, unknown>) => mapAuditApiRow(r)));
    } catch {
      setAuditLogs([]);
    }
  };

  const fetchIssueComments = async (issueId: string): Promise<Comment[]> => {
    const data = await api(`/issues/${issueId}/comments`);
    const list = Array.isArray(data) ? data : [];
    return list.map((c: Record<string, unknown>) => mapIssueComment(c, issueId));
  };

  const fetchIssueAuditLogs = async (issueId: string): Promise<AuditLog[]> => {
    try {
      const data = await api(`/audit-logs/issue/${issueId}`);
      const list = Array.isArray(data) ? data : [];
      return list.map((r: Record<string, unknown>) => mapAuditApiRow(r));
    } catch {
      return [];
    }
  };

  const loadNotifications = async () => {
    const data = await api('/notifications');
    const list = data?.notifications || [];
    setNotifications(list.map((n: any) => ({
      id: String(n.id),
      userId: currentUser?.id || '0',
      type: n.type,
      title: n.title,
      message: n.message,
      issueId: n.issueId ? String(n.issueId) : undefined,
      read: n.read,
      createdAt: n.createdAt,
    })));
  };

  const bootstrap = async () => {
    if (!token) return;
    try {
      const me = await api('/auth/me');
      const mapped = mapUser(me);
      setCurrentUser(mapped);
      
      // Load users based on role
      if (mapped.role === 'ADMIN') {
        const usersData = await api('/users');
        setUsers(Array.isArray(usersData) ? usersData.map(mapUser) : []);
      } else if (mapped.role === 'HOD' && mapped.department) {
        const usersData = await api(`/users/department/${encodeURIComponent(mapped.department)}`);
        setUsers(Array.isArray(usersData) ? usersData.map(mapUser) : []);
      } else {
        setUsers([]);
      }
      
      await Promise.all([loadIssues(), loadNotifications(), loadAuditLogs()]);
    } catch {
      localStorage.removeItem('dqims_token');
      setToken(null);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    void bootstrap();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const newToken = data.token;
      localStorage.setItem('dqims_token', newToken);
      setToken(newToken);
      const u = mapUser(data.user);
      setCurrentUser(u);
      
      // Use the new token directly for subsequent calls (not the stale authHeaders)
      // Load users based on role
      if (u.role === 'ADMIN') {
        const usersData = await api('/users', {}, newToken);
        setUsers(Array.isArray(usersData) ? usersData.map(mapUser) : []);
      } else if (u.role === 'HOD' && u.department) {
        const usersData = await api(`/users/department/${encodeURIComponent(u.department)}`, {}, newToken);
        setUsers(Array.isArray(usersData) ? usersData.map(mapUser) : []);
      } else {
        setUsers([]);
      }
      
      // Load other data with the new token
      const issuesData = await api('/issues?page=0&size=200', {}, newToken);
      const issuesContent = issuesData?.content || [];
      setIssues(issuesContent.map(mapIssue));
      
      const notifsData = await api('/notifications', {}, newToken);
      const notifsList = notifsData?.notifications || [];
      setNotifications(notifsList.map((n: any) => ({
        id: String(n.id),
        userId: u.id,
        type: n.type,
        title: n.title,
        message: n.message,
        issueId: n.issueId ? String(n.issueId) : undefined,
        read: n.read,
        createdAt: n.createdAt,
      })));
      
      const auditData = await api('/audit-logs', {}, newToken);
      const auditList = Array.isArray(auditData) ? auditData : [];
      setAuditLogs(auditList.map((r: Record<string, unknown>) => mapAuditApiRow(r)));
      
      toast.success(`Welcome back, ${u.name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials');
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem('dqims_token');
    setToken(null);
    setCurrentUser(null);
    setUsers([]);
    setIssues([]);
    setNotifications([]);
    toast.success('Logged out successfully');
  };

  const createUser = async (userData: Omit<User, 'id' | 'isActive'>) => {
    await api('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Reload users based on current user role
    if (currentUser?.role === 'ADMIN') {
      const data = await api('/users');
      setUsers(Array.isArray(data) ? data.map(mapUser) : []);
    } else if (currentUser?.role === 'HOD' && currentUser?.department) {
      const data = await api(`/users/department/${encodeURIComponent(currentUser.department)}`);
      setUsers(Array.isArray(data) ? data.map(mapUser) : []);
    }
    
    toast.success('User created successfully');
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    await api(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    // Reload users based on current user role
    if (currentUser?.role === 'ADMIN') {
      const data = await api('/users');
      setUsers(Array.isArray(data) ? data.map(mapUser) : []);
    } else if (currentUser?.role === 'HOD' && currentUser?.department) {
      const data = await api(`/users/department/${encodeURIComponent(currentUser.department)}`);
      setUsers(Array.isArray(data) ? data.map(mapUser) : []);
    }
    
    toast.success('User updated successfully');
  };

  const deleteUser = async (id: string) => {
    await api(`/users/${id}`, { method: 'DELETE' });
    
    // Reload users based on current user role
    if (currentUser?.role === 'ADMIN') {
      const data = await api('/users');
      setUsers(Array.isArray(data) ? data.map(mapUser) : []);
    } else if (currentUser?.role === 'HOD' && currentUser?.department) {
      const data = await api(`/users/department/${encodeURIComponent(currentUser.department)}`);
      setUsers(Array.isArray(data) ? data.map(mapUser) : []);
    }
    
    toast.success('User deactivated successfully');
  };

  const createIssue = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    await api('/issues', {
      method: 'POST',
      body: JSON.stringify({
        title: issueData.title,
        description: issueData.description,
        source: issueData.source,
        dataElement: issueData.dataElement,
        issueType: issueData.issueType,
        severity: issueData.severity,
        priority: issueData.priority,
        department: issueData.department,
        assignedTo: issueData.assignedTo ? Number(issueData.assignedTo) : null,
      }),
    });
    await Promise.all([loadIssues(), loadAuditLogs()]);
    toast.success('Issue created successfully');
  };

  const updateIssue = async (id: string, updates: Partial<Issue>) => {
    if (updates.status === 'CLOSED') {
      await api(`/issues/${id}/close`, { method: 'PUT' });
    } else {
      await api(`/issues/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: updates.title,
          description: updates.description,
          priority: updates.priority,
          status: updates.status,
          assignedTo: updates.assignedTo ? Number(updates.assignedTo) : null,
        }),
      });
    }
    await Promise.all([loadIssues(), loadNotifications(), loadAuditLogs()]);
    toast.success('Issue updated successfully');
  };

  const addComment = async (issueId: string, content: string) => {
    await api(`/issues/${issueId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    await loadAuditLogs();
    toast.success('Comment added');
  };

  const markNotificationAsRead = async (id: string) => {
    await api(`/notifications/${id}/read`, { method: 'PUT' });
    await loadNotifications();
  };

  const markAllNotificationsAsRead = async () => {
    await api('/notifications/read-all', { method: 'PUT' });
    await loadNotifications();
  };

  const getUnreadNotificationsCount = (): number => notifications.filter((n) => !n.read).length;

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await api('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      toast.success('Password changed successfully');
      return true;
    } catch {
      toast.error('Could not change password');
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await api('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      toast.success('Reset token sent');
      return true;
    } catch {
      toast.error('Email not found');
      return false;
    }
  };

  const addDepartment = (department: Department) => {
    if (departments.includes(department)) return;
    setDepartments([...departments, department]);
  };

  const removeDepartment = (department: Department) => {
    setDepartments(departments.filter((d) => d !== department));
  };

  const addAuditLog = (action: string, details: string, issueId?: string) => {
    if (!currentUser) return;
    setAuditLogs((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        userId: currentUser.id,
        userName: currentUser.name,
        action,
        issueId,
        details,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        issues,
        notifications,
        auditLogs,
        departments,
        login,
        logout,
        createUser,
        updateUser,
        deleteUser,
        changePassword,
        resetPassword,
        createIssue,
        updateIssue,
        addComment,
        loadAuditLogs,
        fetchIssueComments,
        fetchIssueAuditLogs,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getUnreadNotificationsCount,
        addAuditLog,
        addDepartment,
        removeDepartment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
