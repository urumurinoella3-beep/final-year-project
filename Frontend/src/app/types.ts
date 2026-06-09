export type UserRole = 'ADMIN' | 'HOD' | 'STAFF';
export type Department = 'VAT' | 'CUSTOMS' | 'DOMESTIC TAX' | 'IT' | 'TAX INVESTIGATIONS' | 'HR' | 'FINANCE';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: Department;
  isFirstLogin?: boolean;
  isActive?: boolean;
}

export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IssueType = 'DUPLICATE' | 'MISSING' | 'INCORRECT' | 'INCONSISTENT';
export type DataSource = 'VAT' | 'CUSTOMS' | 'TAXPAYER_SYSTEM' | 'OTHER';

export interface Issue {
  id: string;
  title: string;
  description: string;
  source: DataSource;
  dataElement: string;
  issueType: IssueType;
  severity: IssueSeverity;
  priority: IssuePriority;
  status: IssueStatus;
  reportedBy: string;
  reportedByName: string;
  assignedTo?: string;
  assignedToName?: string;
  department: Department;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  attachments?: string[];
  comments: Comment[];
  isDelegated?: boolean;
  delegatedFrom?: string;
}

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'ISSUE_ASSIGNED' | 'STATUS_UPDATED' | 'PRIORITY_CHANGED' | 'COMMENT_ADDED' | 'ISSUE_CLOSED';
  title: string;
  message: string;
  issueId?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole?: string;
  action: string;
  issueId?: string;
  details: string;
  timestamp: string;
}

export interface ValidationError {
  row: number;
  errorType: 'ACCURACY' | 'COMPLETENESS' | 'UNIQUENESS' | 'FORMAT';
  field: string;
  description: string;
  value?: string;
}
