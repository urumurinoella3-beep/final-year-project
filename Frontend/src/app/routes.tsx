import { createBrowserRouter, Navigate } from 'react-router';
import { Root } from './pages/Root';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { IssueManagementPage } from './pages/IssueManagementPage';
import { IssueDetailsPage } from './pages/IssueDetailsPage';
import { DataValidationPage } from './pages/DataValidationPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { DepartmentManagementPage } from './pages/DepartmentManagementPage';
import { ReportingAnalyticsPage } from './pages/ReportingAnalyticsPage';
import { AuditHistoryPage } from './pages/AuditHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/forgot-password',
    Component: ForgotPasswordPage,
  },
  {
    path: '/change-password',
    Component: ChangePasswordPage,
  },
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        Component: DashboardPage,
      },
      {
        path: 'issues',
        Component: IssueManagementPage,
      },
      {
        path: 'issues/:id',
        Component: IssueDetailsPage,
      },
      {
        path: 'validation',
        Component: DataValidationPage,
      },
      {
        path: 'users',
        Component: UserManagementPage,
      },
      {
        path: 'departments',
        Component: DepartmentManagementPage,
      },
      {
        path: 'reports',
        Component: ReportingAnalyticsPage,
      },
      {
        path: 'audit',
        Component: AuditHistoryPage,
      },
      {
        path: 'settings',
        Component: SettingsPage,
      },
      {
        path: 'profile',
        Component: ProfilePage,
      },
    ],
  },
]);
