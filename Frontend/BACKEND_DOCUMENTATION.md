# DQIMS Backend Documentation
# Data Quality Issues Management System - Spring Boot Implementation Guide

**Project:** Rwanda Revenue Authority (RRA) - DQIMS  
**Frontend:** React + TypeScript  
**Backend:** Spring Boot + PostgreSQL/MySQL  
**Version:** 1.0.0  
**Date:** April 2026

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Authentication & Authorization](#authentication--authorization)
5. [Business Logic](#business-logic)
6. [Email Notifications](#email-notifications)
7. [File Upload System](#file-upload-system)
8. [Security Requirements](#security-requirements)

---

## System Overview

DQIMS is a web-based system for managing data quality issues across Rwanda Revenue Authority departments (VAT, CUSTOMS, DOMESTIC TAX, IT, etc.).

### User Roles
- **ADMIN**: Full system access, manages users and departments
- **HOD** (Head of Department): Manages department issues, assigns to members, closes issues
- **MEMBER**: Reports issues, updates assigned issues, adds comments

### Key Features
- Role-based access control
- Issue lifecycle management (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- Real-time notifications
- Audit logging
- File attachments
- Data validation
- Reporting & analytics

---

## Database Schema

### Technology Stack
- **Database**: PostgreSQL 14+ (preferred) or MySQL 8+
- **ORM**: Spring Data JPA / Hibernate
- **Connection Pool**: HikariCP

### Tables

#### 1. users
Primary user management table

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'HOD', 'MEMBER')),
    department VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_first_login BOOLEAN DEFAULT TRUE,
    password_reset_token VARCHAR(255),
    password_reset_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_role ON users(role);
```

#### 2. departments
Department management

```sql
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_departments_name ON departments(name);

-- Insert default departments
INSERT INTO departments (name, description) VALUES
('VAT', 'Value Added Tax Department'),
('CUSTOMS', 'Customs Department'),
('DOMESTIC TAX', 'Domestic Tax Department'),
('IT', 'Information Technology Department'),
('TAX INVESTIGATIONS', 'Tax Investigations Department'),
('HR', 'Human Resources Department'),
('FINANCE', 'Finance Department');
```

#### 3. issues
Core issue tracking table

```sql
CREATE TABLE issues (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    source VARCHAR(50) NOT NULL CHECK (source IN ('VAT', 'CUSTOMS', 'TAXPAYER_SYSTEM', 'OTHER')),
    data_element VARCHAR(100) NOT NULL,
    issue_type VARCHAR(50) NOT NULL CHECK (issue_type IN ('DUPLICATE', 'MISSING', 'INCORRECT', 'INCONSISTENT')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    department VARCHAR(50) NOT NULL,
    reported_by BIGINT NOT NULL,
    assigned_to BIGINT,
    is_delegated BOOLEAN DEFAULT FALSE,
    delegated_from VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    closed_by BIGINT,
    FOREIGN KEY (reported_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (closed_by) REFERENCES users(id)
);

CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_priority ON issues(priority);
CREATE INDEX idx_issues_department ON issues(department);
CREATE INDEX idx_issues_reported_by ON issues(reported_by);
CREATE INDEX idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
```

#### 4. issue_attachments
File attachments for issues

```sql
CREATE TABLE issue_attachments (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    uploaded_by BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE INDEX idx_attachments_issue_id ON issue_attachments(issue_id);
```

#### 5. issue_comments
Comments/discussions on issues

```sql
CREATE TABLE issue_comments (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_comments_issue_id ON issue_comments(issue_id);
CREATE INDEX idx_comments_created_at ON issue_comments(created_at DESC);
```

#### 6. notifications
User notifications

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ISSUE_ASSIGNED', 'STATUS_UPDATED', 'PRIORITY_CHANGED', 'COMMENT_ADDED', 'ISSUE_CLOSED')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    issue_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

#### 7. audit_logs
System activity tracking

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
```

#### 8. validation_sessions
Data validation tracking

```sql
CREATE TABLE validation_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    total_records INTEGER NOT NULL,
    passed_records INTEGER NOT NULL,
    failed_records INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_validation_user_id ON validation_sessions(user_id);
CREATE INDEX idx_validation_created_at ON validation_sessions(created_at DESC);
```

#### 9. validation_errors
Detailed validation error records

```sql
CREATE TABLE validation_errors (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL,
    row_number INTEGER NOT NULL,
    error_type VARCHAR(50) NOT NULL CHECK (error_type IN ('ACCURACY', 'COMPLETENESS', 'UNIQUENESS', 'FORMAT')),
    field_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES validation_sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_validation_errors_session_id ON validation_errors(session_id);
```

#### 10. password_history
Track password changes (for security policy)

```sql
CREATE TABLE password_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_password_history_user_id ON password_history(user_id);
```

---

## API Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication Endpoints

#### POST /auth/login
Login user
```json
// Request
{
  "email": "john.mugisha@rra.gov.rw",
  "password": "password123"
}

// Response (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "employeeId": "EMP001",
    "name": "John Mugisha",
    "email": "john.mugisha@rra.gov.rw",
    "phone": "+250788123456",
    "role": "HOD",
    "department": "VAT",
    "isFirstLogin": false
  }
}

// Error Response (401 Unauthorized)
{
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

#### POST /auth/logout
Logout user (invalidate token)
```json
// Request Headers
Authorization: Bearer <token>

// Response (200 OK)
{
  "message": "Logged out successfully"
}
```

#### POST /auth/forgot-password
Request password reset
```json
// Request
{
  "email": "john.mugisha@rra.gov.rw"
}

// Response (200 OK)
{
  "message": "Password reset link sent to email"
}
```

#### POST /auth/reset-password
Reset password with token
```json
// Request
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}

// Response (200 OK)
{
  "message": "Password reset successfully"
}
```

#### POST /auth/change-password
Change password (authenticated)
```json
// Request Headers
Authorization: Bearer <token>

// Request Body
{
  "oldPassword": "currentPassword123",
  "newPassword": "newSecurePassword123"
}

// Response (200 OK)
{
  "message": "Password changed successfully"
}

// Error Response (400 Bad Request)
{
  "error": "INVALID_PASSWORD",
  "message": "Current password is incorrect"
}
```

---

### User Management Endpoints

#### GET /users
Get all users (ADMIN only)
```json
// Request Headers
Authorization: Bearer <token>

// Query Parameters (optional)
?page=0&size=20&sort=name,asc&department=VAT&role=MEMBER&isActive=true

// Response (200 OK)
{
  "content": [
    {
      "id": 1,
      "employeeId": "EMP001",
      "name": "John Mugisha",
      "email": "john.mugisha@rra.gov.rw",
      "phone": "+250788123456",
      "role": "HOD",
      "department": "VAT",
      "isActive": true,
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "totalElements": 50,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 20
}
```

#### POST /users
Create new user (ADMIN only)
```json
// Request Headers
Authorization: Bearer <token>

// Request Body
{
  "employeeId": "EMP006",
  "name": "Alice Uwera",
  "email": "alice.uwera@rra.gov.rw",
  "phone": "+250788678901",
  "role": "MEMBER",
  "department": "VAT"
}

// Response (201 Created)
{
  "id": 6,
  "employeeId": "EMP006",
  "name": "Alice Uwera",
  "email": "alice.uwera@rra.gov.rw",
  "phone": "+250788678901",
  "role": "MEMBER",
  "department": "VAT",
  "isActive": true,
  "isFirstLogin": true,
  "createdAt": "2026-04-23T14:25:00Z"
}

// Note: Temporary password sent to email
```

#### GET /users/{id}
Get user by ID
```json
// Request Headers
Authorization: Bearer <token>

// Response (200 OK)
{
  "id": 1,
  "employeeId": "EMP001",
  "name": "John Mugisha",
  "email": "john.mugisha@rra.gov.rw",
  "phone": "+250788123456",
  "role": "HOD",
  "department": "VAT",
  "isActive": true,
  "createdAt": "2026-01-15T10:30:00Z"
}
```

#### PUT /users/{id}
Update user (ADMIN only)
```json
// Request Headers
Authorization: Bearer <token>

// Request Body
{
  "name": "John Updated Mugisha",
  "phone": "+250788999999",
  "role": "HOD",
  "department": "CUSTOMS",
  "isActive": true
}

// Response (200 OK)
{
  "id": 1,
  "employeeId": "EMP001",
  "name": "John Updated Mugisha",
  "email": "john.mugisha@rra.gov.rw",
  "phone": "+250788999999",
  "role": "HOD",
  "department": "CUSTOMS",
  "isActive": true,
  "updatedAt": "2026-04-23T15:00:00Z"
}
```

#### DELETE /users/{id}
Delete/deactivate user (ADMIN only)
```json
// Request Headers
Authorization: Bearer <token>

// Response (200 OK)
{
  "message": "User deactivated successfully"
}
```

---

### Department Endpoints

#### GET /departments
Get all departments
```json
// Request Headers
Authorization: Bearer <token>

// Response (200 OK)
[
  {
    "id": 1,
    "name": "VAT",
    "description": "Value Added Tax Department",
    "isActive": true,
    "userCount": 12,
    "issueCount": 45,
    "hodName": "John Mugisha"
  },
  {
    "id": 2,
    "name": "CUSTOMS",
    "description": "Customs Department",
    "isActive": true,
    "userCount": 8,
    "issueCount": 32,
    "hodName": "David Nkusi"
  }
]
```

#### POST /departments
Create department (ADMIN only)
```json
// Request Headers
Authorization: Bearer <token>

// Request Body
{
  "name": "TAX COMPLIANCE",
  "description": "Tax Compliance and Enforcement Department"
}

// Response (201 Created)
{
  "id": 8,
  "name": "TAX COMPLIANCE",
  "description": "Tax Compliance and Enforcement Department",
  "isActive": true,
  "createdAt": "2026-04-23T16:00:00Z"
}
```

#### DELETE /departments/{id}
Delete department (ADMIN only)
```json
// Request Headers
Authorization: Bearer <token>

// Response (200 OK)
{
  "message": "Department deleted successfully"
}

// Error Response (400 Bad Request)
{
  "error": "DEPARTMENT_HAS_USERS",
  "message": "Cannot delete department with active users"
}
```

---

### Issue Endpoints

#### GET /issues
Get issues (filtered by role)
```json
// Request Headers
Authorization: Bearer <token>

// Query Parameters
?page=0&size=20&status=OPEN&priority=HIGH&department=VAT&assignedTo=3

// Response (200 OK)
{
  "content": [
    {
      "id": 1,
      "title": "Duplicate TIN entries in VAT system",
      "description": "Multiple taxpayers found with identical TIN numbers",
      "source": "VAT",
      "dataElement": "TIN",
      "issueType": "DUPLICATE",
      "severity": "CRITICAL",
      "priority": "HIGH",
      "status": "OPEN",
      "department": "VAT",
      "reportedBy": {
        "id": 3,
        "name": "Sarah Uwase"
      },
      "assignedTo": {
        "id": 3,
        "name": "Sarah Uwase"
      },
      "isDelegated": false,
      "attachmentCount": 2,
      "commentCount": 5,
      "createdAt": "2026-04-20T10:30:00Z",
      "updatedAt": "2026-04-22T14:25:00Z"
    }
  ],
  "totalElements": 125,
  "totalPages": 7,
  "currentPage": 0
}
```

#### POST /issues
Create issue
```json
// Request Headers
Authorization: Bearer <token>
Content-Type: multipart/form-data

// Request Body (multipart/form-data)
{
  "title": "Missing taxpayer names in customs",
  "description": "Over 50 customs declarations have empty taxpayer names",
  "source": "CUSTOMS",
  "dataElement": "Name",
  "issueType": "MISSING",
  "severity": "HIGH",
  "priority": "MEDIUM",
  "isDelegated": false,
  "files": [File1, File2]  // Optional file attachments
}

// Response (201 Created)
{
  "id": 125,
  "title": "Missing taxpayer names in customs",
  "description": "Over 50 customs declarations have empty taxpayer names",
  "source": "CUSTOMS",
  "dataElement": "Name",
  "issueType": "MISSING",
  "severity": "HIGH",
  "priority": "MEDIUM",
  "status": "OPEN",
  "department": "CUSTOMS",
  "reportedBy": {
    "id": 5,
    "name": "Grace Umutoni"
  },
  "createdAt": "2026-04-23T16:30:00Z"
}
```

#### GET /issues/{id}
Get issue details
```json
// Request Headers
Authorization: Bearer <token>

// Response (200 OK)
{
  "id": 1,
  "title": "Duplicate TIN entries in VAT system",
  "description": "Multiple taxpayers found with identical TIN numbers in the VAT database",
  "source": "VAT",
  "dataElement": "TIN",
  "issueType": "DUPLICATE",
  "severity": "CRITICAL",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "department": "VAT",
  "reportedBy": {
    "id": 3,
    "name": "Sarah Uwase",
    "email": "sarah.uwase@rra.gov.rw"
  },
  "assignedTo": {
    "id": 3,
    "name": "Sarah Uwase",
    "email": "sarah.uwase@rra.gov.rw"
  },
  "isDelegated": false,
  "attachments": [
    {
      "id": 1,
      "fileName": "duplicate_tins.xlsx",
      "fileType": "application/vnd.ms-excel",
      "fileSize": 52480,
      "uploadedBy": "Sarah Uwase",
      "uploadedAt": "2026-04-20T10:32:00Z"
    }
  ],
  "comments": [
    {
      "id": 1,
      "userId": 3,
      "userName": "Sarah Uwase",
      "content": "Identified 15 duplicate TIN entries. Working on resolution.",
      "createdAt": "2026-04-21T09:15:00Z"
    }
  ],
  "createdAt": "2026-04-20T10:30:00Z",
  "updatedAt": "2026-04-22T14:25:00Z"
}
```

#### PUT /issues/{id}
Update issue
```json
// Request Headers
Authorization: Bearer <token>

// Request Body
{
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "assignedTo": 3
}

// Response (200 OK)
{
  "id": 1,
  "title": "Duplicate TIN entries in VAT system",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "assignedTo": {
    "id": 3,
    "name": "Sarah Uwase"
  },
  "updatedAt": "2026-04-23T17:00:00Z"
}
```

#### PUT /issues/{id}/close
Close issue (HOD/ADMIN only)
```json
// Request Headers
Authorization: Bearer <token>

// Request Body
{
  "resolution": "All duplicate TINs have been merged and resolved"
}

// Response (200 OK)
{
  "id": 1,
  "status": "CLOSED",
  "closedBy": {
    "id": 2,
    "name": "John Mugisha"
  },
  "closedAt": "2026-04-23T17:15:00Z"
}
```

---

### Comment Endpoints

#### POST /issues/{issueId}/comments
Add comment to issue
```json
// Request Headers
Authorization: Bearer <token>

// Request Body
{
  "content": "I've identified the root cause and working on a fix"
}

// Response (201 Created)
{
  "id": 15,
  "issueId": 1,
  "userId": 3,
  "userName": "Sarah Uwase",
  "content": "I've identified the root cause and working on a fix",
  "createdAt": "2026-04-23T17:30:00Z"
}
```

#### PUT /issues/{issueId}/comments/{commentId}
Update comment
```json
// Request Headers
Authorization: Bearer <token>

// Request Body
{
  "content": "Updated comment content"
}

// Response (200 OK)
{
  "id": 15,
  "content": "Updated comment content",
  "isEdited": true,
  "updatedAt": "2026-04-23T17:35:00Z"
}
```

---

### Notification Endpoints

#### GET /notifications
Get user notifications
```json
// Request Headers
Authorization: Bearer <token>

// Query Parameters
?isRead=false&page=0&size=20

// Response (200 OK)
{
  "content": [
    {
      "id": 1,
      "type": "ISSUE_ASSIGNED",
      "title": "New Issue Assigned",
      "message": "You have been assigned to 'Duplicate TIN entries in VAT system'",
      "issueId": 1,
      "isRead": false,
      "createdAt": "2026-04-20T10:35:00Z"
    }
  ],
  "unreadCount": 5,
  "totalElements": 25
}
```

#### PUT /notifications/{id}/read
Mark notification as read
```json
// Request Headers
Authorization: Bearer <token>

// Response (200 OK)
{
  "id": 1,
  "isRead": true,
  "readAt": "2026-04-23T18:00:00Z"
}
```

#### PUT /notifications/read-all
Mark all notifications as read
```json
// Request Headers
Authorization: Bearer <token>

// Response (200 OK)
{
  "message": "All notifications marked as read",
  "count": 5
}
```

---

### Audit Log Endpoints

#### GET /audit-logs
Get audit logs (ADMIN/HOD)
```json
// Request Headers
Authorization: Bearer <token>

// Query Parameters
?page=0&size=20&action=ISSUE_CREATED&userId=3&startDate=2026-04-01&endDate=2026-04-23

// Response (200 OK)
{
  "content": [
    {
      "id": 1,
      "userId": 3,
      "userName": "Sarah Uwase",
      "action": "ISSUE_CREATED",
      "entityType": "ISSUE",
      "entityId": 1,
      "details": "Created issue: Duplicate TIN entries in VAT system",
      "ipAddress": "192.168.1.100",
      "createdAt": "2026-04-20T10:30:00Z"
    }
  ],
  "totalElements": 500
}
```

---

### Data Validation Endpoints

#### POST /validation/upload
Upload and validate data file
```json
// Request Headers
Authorization: Bearer <token>
Content-Type: multipart/form-data

// Request Body
{
  "file": File,
  "validationType": "TIN_VALIDATION"
}

// Response (200 OK)
{
  "sessionId": 1,
  "fileName": "taxpayer_data.xlsx",
  "totalRecords": 500,
  "passedRecords": 475,
  "failedRecords": 25,
  "errors": [
    {
      "row": 5,
      "errorType": "COMPLETENESS",
      "field": "TIN",
      "description": "Missing TIN value",
      "value": ""
    },
    {
      "row": 12,
      "errorType": "ACCURACY",
      "field": "Amount",
      "description": "Negative amount not allowed",
      "value": "-5000"
    }
  ],
  "summary": {
    "ACCURACY": 3,
    "COMPLETENESS": 12,
    "UNIQUENESS": 8,
    "FORMAT": 2
  }
}
```

#### GET /validation/sessions
Get validation history
```json
// Request Headers
Authorization: Bearer <token>

// Response (200 OK)
[
  {
    "id": 1,
    "fileName": "taxpayer_data.xlsx",
    "totalRecords": 500,
    "passedRecords": 475,
    "failedRecords": 25,
    "createdAt": "2026-04-23T14:00:00Z"
  }
]
```

---

### Reporting Endpoints

#### GET /reports/dashboard-stats
Get dashboard statistics
```json
// Request Headers
Authorization: Bearer <token>

// Response (200 OK)
{
  "totalIssues": 125,
  "openIssues": 45,
  "inProgressIssues": 32,
  "resolvedIssues": 48,
  "highPriorityIssues": 28,
  "issuesByDepartment": [
    {
      "department": "VAT",
      "total": 45,
      "open": 15,
      "resolved": 20
    }
  ],
  "issuesByStatus": {
    "OPEN": 45,
    "IN_PROGRESS": 32,
    "RESOLVED": 35,
    "CLOSED": 13
  },
  "issuesByPriority": {
    "HIGH": 28,
    "MEDIUM": 57,
    "LOW": 40
  },
  "recentIssues": [...]
}
```

#### POST /reports/generate-pdf
Generate PDF report
```json
// Request Headers
Authorization: Bearer <token>

// Request Body
{
  "reportType": "DEPARTMENT_SUMMARY",
  "department": "VAT",
  "startDate": "2026-04-01",
  "endDate": "2026-04-23",
  "includeCharts": true
}

// Response (200 OK)
// Content-Type: application/pdf
// Binary PDF data
```

---

## Authentication & Authorization

### JWT Token Implementation

#### Token Structure
```json
{
  "sub": "john.mugisha@rra.gov.rw",
  "userId": 2,
  "role": "HOD",
  "department": "VAT",
  "iat": 1714752000,
  "exp": 1714755600
}
```

#### Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // JWT Secret: Minimum 512 bits
    // Token Expiry: 1 hour
    // Refresh Token: 7 days
}
```

### Role-Based Access Control

#### Permission Matrix

| Endpoint | ADMIN | HOD | MEMBER |
|----------|-------|-----|--------|
| POST /users | ✓ | ✗ | ✗ |
| GET /users | ✓ | ✓ (dept only) | ✗ |
| PUT /users/{id} | ✓ | ✗ | ✗ |
| DELETE /users/{id} | ✓ | ✗ | ✗ |
| POST /departments | ✓ | ✗ | ✗ |
| DELETE /departments/{id} | ✓ | ✗ | ✗ |
| GET /issues | ✓ | ✓ (dept) | ✓ (assigned) |
| POST /issues | ✓ | ✓ | ✓ |
| PUT /issues/{id} | ✓ | ✓ (dept) | ✓ (assigned) |
| PUT /issues/{id}/close | ✓ | ✓ | ✗ |
| GET /audit-logs | ✓ | ✓ (dept) | ✗ |
| POST /validation/upload | ✓ | ✓ | ✓ |
| POST /reports/generate-pdf | ✓ | ✓ | ✓ |

---

## Business Logic

### Issue Lifecycle

1. **OPEN** (Initial state)
   - Created by any user
   - Can be assigned by HOD/ADMIN
   - Priority can be changed by HOD/ADMIN

2. **IN_PROGRESS**
   - Updated by assigned MEMBER
   - Comments can be added
   - Attachments can be added

3. **RESOLVED**
   - Marked by assigned MEMBER
   - Awaits HOD approval

4. **CLOSED**
   - Only HOD/ADMIN can close
   - Cannot be reopened (create new issue instead)

### Password Policy

- Minimum 8 characters
- Must contain: uppercase, lowercase, number, special character
- Cannot reuse last 5 passwords
- Expires after 90 days
- Reset token expires after 1 hour
- Max 5 login attempts before lockout (15 minutes)

### Department Rules

- Each department must have at least one HOD
- Cannot delete department with active users
- Cannot delete department with open issues
- Department names are unique and uppercase

### Notification Triggers

1. **ISSUE_ASSIGNED**: When issue assigned to user
2. **STATUS_UPDATED**: When issue status changes to RESOLVED/CLOSED
3. **PRIORITY_CHANGED**: When priority changed to HIGH
4. **COMMENT_ADDED**: When someone comments on user's issue
5. **ISSUE_CLOSED**: When HOD closes an issue

---

## Email Notifications

### SMTP Configuration

```properties
spring.mail.host=smtp.rra.gov.rw
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Email Templates

#### 1. User Creation Email
```
Subject: Welcome to DQIMS - Rwanda Revenue Authority

Dear [User Name],

Your account has been created in the Data Quality Issues Management System.

Employee ID: [EMPLOYEE_ID]
Email: [EMAIL]
Role: [ROLE]
Department: [DEPARTMENT]

Temporary Password: [TEMP_PASSWORD]

Please log in and change your password immediately.

Login URL: https://dqims.rra.gov.rw

Best regards,
DQIMS System
Rwanda Revenue Authority
```

#### 2. Password Reset Email
```
Subject: Password Reset Request - DQIMS

Dear [User Name],

We received a request to reset your password.

Click the link below to reset your password:
[RESET_LINK]

This link will expire in 1 hour.

If you did not request this, please ignore this email.

Best regards,
DQIMS System
```

#### 3. Issue Assigned Email
```
Subject: New Issue Assigned - [ISSUE_TITLE]

Dear [User Name],

A new issue has been assigned to you:

Title: [ISSUE_TITLE]
Priority: [PRIORITY]
Department: [DEPARTMENT]
Reported By: [REPORTER_NAME]

View Issue: https://dqims.rra.gov.rw/issues/[ISSUE_ID]

Best regards,
DQIMS System
```

---

## File Upload System

### Storage Configuration

```properties
# Local file storage
file.upload.dir=/var/dqims/uploads
file.max-size=10MB
file.allowed-types=pdf,doc,docx,xls,xlsx,jpg,jpeg,png

# Or AWS S3
aws.s3.bucket=rra-dqims-files
aws.s3.region=eu-west-1
```

### File Naming Convention
```
{userId}_{timestamp}_{originalFileName}
Example: 3_1714752000_report.pdf
```

### Security
- Validate file types (whitelist only)
- Scan for viruses (ClamAV integration)
- Check file size limits
- Sanitize file names
- Store outside web root
- Generate download tokens (expires in 1 hour)

---

## Security Requirements

### 1. Input Validation
- Validate all user inputs
- Sanitize HTML content in comments
- Prevent SQL injection (use parameterized queries)
- Prevent XSS attacks

### 2. CORS Configuration
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("https://dqims.rra.gov.rw"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setExposedHeaders(Arrays.asList("X-Total-Count"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        return new CorsFilter(source);
    }
}
```

### 3. Rate Limiting
- Login: 5 attempts per 15 minutes per IP
- Password reset: 3 attempts per hour per email
- API calls: 100 requests per minute per user
- File upload: 10 files per hour per user

### 4. Logging
- Log all authentication attempts
- Log all authorization failures
- Log all data modifications
- Include: timestamp, user, IP, action, result
- Rotate logs daily
- Retain logs for 1 year

### 5. HTTPS Only
- Force HTTPS in production
- HSTS headers enabled
- Secure cookie flags

---

## Error Handling

### Standard Error Response Format

```json
{
  "timestamp": "2026-04-23T18:30:00Z",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Validation failed for field 'email'",
  "details": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ],
  "path": "/api/v1/users"
}
```

### HTTP Status Codes

- **200 OK**: Success
- **201 Created**: Resource created
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate resource
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error

---

## Performance Requirements

### Response Time Targets
- Authentication: < 500ms
- List endpoints: < 1s
- Detail endpoints: < 500ms
- File upload: < 5s (per 5MB)
- Report generation: < 10s

### Database Optimization
- Index all foreign keys
- Index frequently queried columns
- Use pagination for large datasets
- Implement caching (Redis) for:
  - User sessions
  - Dashboard statistics
  - Department lists

### Caching Strategy
```java
@Cacheable(value = "dashboardStats", key = "#userId")
public DashboardStats getDashboardStats(Long userId) {
    // ...
}

@CacheEvict(value = "dashboardStats", allEntries = true)
public void createIssue(IssueDTO issue) {
    // ...
}
```

---

## Testing Requirements

### Unit Tests
- Service layer: 80% coverage minimum
- Repository layer: All CRUD operations
- Security: All permission checks

### Integration Tests
- All API endpoints
- Database transactions
- File upload/download
- Email sending

### Test Data
```sql
-- Create test users for each role
INSERT INTO users (employee_id, name, email, phone, password_hash, role, department)
VALUES
('TEST_ADMIN', 'Test Admin', 'admin.test@rra.gov.rw', '+250788000001', '$2a$...', 'ADMIN', 'IT'),
('TEST_HOD', 'Test HOD', 'hod.test@rra.gov.rw', '+250788000002', '$2a$...', 'HOD', 'VAT'),
('TEST_MEMBER', 'Test Member', 'member.test@rra.gov.rw', '+250788000003', '$2a$...', 'MEMBER', 'VAT');
```

---

## Deployment Configuration

### Application Properties

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/dqims
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=3600000
jwt.refresh-expiration=604800000

# Email
spring.mail.host=${MAIL_HOST}
spring.mail.port=${MAIL_PORT}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
file.upload-dir=/var/dqims/uploads

# Logging
logging.level.rw.rra.dqims=INFO
logging.file.name=/var/log/dqims/application.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} - %msg%n

# Server
server.port=8080
server.compression.enabled=true
```

### Environment Variables

```bash
# Database
export DB_USERNAME=dqims_user
export DB_PASSWORD=secure_password

# JWT
export JWT_SECRET=your-512-bit-secret-key

# Email
export MAIL_HOST=smtp.rra.gov.rw
export MAIL_PORT=587
export MAIL_USERNAME=noreply@rra.gov.rw
export MAIL_PASSWORD=email_password

# AWS (if using S3)
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=eu-west-1
```

---

## API Documentation

### Swagger/OpenAPI

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
            .select()
            .apis(RequestHandlerSelectors.basePackage("rw.rra.dqims.controller"))
            .paths(PathSelectors.any())
            .build()
            .securitySchemes(Arrays.asList(apiKey()))
            .securityContexts(Arrays.asList(securityContext()));
    }
}
```

Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

---

## Monitoring & Health Checks

### Health Check Endpoint

```
GET /actuator/health
```

Response:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "mail": {
      "status": "UP"
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 500GB,
        "free": 250GB
      }
    }
  }
}
```

### Metrics to Track
- Request count per endpoint
- Average response time
- Error rate
- Active user sessions
- Database connection pool usage
- File storage usage

---

## Summary

This documentation provides a complete specification for implementing the DQIMS backend using Spring Boot. Key points:

1. **Database**: 10 normalized tables with proper indexes and constraints
2. **API**: RESTful endpoints with JWT authentication
3. **Security**: Role-based access control, input validation, rate limiting
4. **Files**: Support for attachments with virus scanning
5. **Email**: Automated notifications for key events
6. **Audit**: Complete activity logging
7. **Performance**: Caching, pagination, optimization

The backend should be production-ready with:
- Comprehensive error handling
- Input validation
- Security best practices
- Performance optimization
- Monitoring and logging
- Test coverage

All endpoints follow REST conventions and return consistent JSON responses.

---

**End of Documentation**
