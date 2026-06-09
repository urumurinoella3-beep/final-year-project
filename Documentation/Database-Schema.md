# DQIMS Database Schema Documentation

## Overview
This document describes the complete database schema for the Data Quality Issues Management System (DQIMS) at Rwanda Revenue Authority (RRA).

**Database Name:** `dqims_db`  
**Database Type:** MySQL/MariaDB  
**Character Set:** UTF-8  
**Collation:** utf8mb4_unicode_ci

---

## Table of Contents
1. [Users Table](#1-users-table)
2. [Departments Table](#2-departments-table)
3. [Issues Table](#3-issues-table)
4. [Issue Comments Table](#4-issue_comments-table)
5. [Issue Attachments Table](#5-issue_attachments-table)
6. [Notifications Table](#6-notifications-table)
7. [Audit Logs Table](#7-audit_logs-table)
8. [Password History Table](#8-password_history-table)
9. [Validation Sessions Table](#9-validation_sessions-table)
10. [Validation Errors Table](#10-validation_errors-table)
11. [Entity Relationships](#entity-relationships)
12. [Indexes and Constraints](#indexes-and-constraints)

---

## 1. Users Table

**Table Name:** `users`

Stores all system users including Admins, HODs, and Staff members.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `employee_id` | VARCHAR(50) | UNIQUE, NOT NULL | RRA employee identification number |
| `name` | VARCHAR(255) | NOT NULL | Full name of the user |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email address (used for login) |
| `phone` | VARCHAR(20) | NOT NULL | Contact phone number |
| `password_hash` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `role` | ENUM('ADMIN', 'HOD', 'STAFF') | NOT NULL | User role in the system |
| `department` | VARCHAR(100) | NOT NULL | Department name |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account activation status |
| `is_first_login` | BOOLEAN | DEFAULT TRUE | Flag for first-time login |
| `password_reset_token` | VARCHAR(255) | NULL | Token for password reset |
| `password_reset_expiry` | DATETIME | NULL | Expiration time for reset token |
| `created_at` | DATETIME | NOT NULL | Account creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`
- UNIQUE INDEX on `employee_id`
- INDEX on `department`
- INDEX on `role`

**Sample Data:**
```sql
INSERT INTO users (employee_id, name, email, phone, password_hash, role, department) 
VALUES 
('EMP001', 'Admin User', 'admin@rra.gov.rw', '+250788000001', '$2a$10$...', 'ADMIN', 'IT'),
('EMP002', 'John Doe', 'john.doe@rra.gov.rw', '+250788000002', '$2a$10$...', 'HOD', 'Finance'),
('EMP003', 'Jane Smith', 'jane.smith@rra.gov.rw', '+250788000003', '$2a$10$...', 'STAFF', 'Finance');
```

---

## 2. Departments Table

**Table Name:** `departments`

Stores organizational departments within RRA.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique department identifier |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Department name |
| `description` | TEXT | NULL | Department description |
| `is_active` | BOOLEAN | DEFAULT TRUE | Department active status |
| `created_at` | DATETIME | NOT NULL | Creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `name`

**Sample Data:**
```sql
INSERT INTO departments (name, description) 
VALUES 
('Finance', 'Financial operations and accounting'),
('IT', 'Information Technology and systems'),
('HR', 'Human Resources management'),
('Operations', 'Operational activities'),
('Compliance', 'Regulatory compliance and auditing');
```

---

## 3. Issues Table

**Table Name:** `issues`

Core table storing all data quality issues reported in the system.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique issue identifier |
| `title` | VARCHAR(255) | NOT NULL | Issue title/summary |
| `description` | TEXT | NOT NULL | Detailed issue description |
| `source` | VARCHAR(100) | NOT NULL | Data source (e.g., "Tax Returns", "Customs") |
| `data_element` | VARCHAR(100) | NOT NULL | Specific data element affected |
| `issue_type` | VARCHAR(50) | NOT NULL | Type (e.g., "Missing Data", "Inconsistency") |
| `severity` | VARCHAR(20) | NOT NULL | Severity level (Low, Medium, High, Critical) |
| `priority` | VARCHAR(20) | NOT NULL | Priority (Low, Medium, High, Critical) |
| `status` | ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') | NOT NULL, DEFAULT 'OPEN' | Current issue status |
| `department` | VARCHAR(100) | NOT NULL | Department responsible |
| `reported_by` | BIGINT | FOREIGN KEY → users(id), NOT NULL | User who reported the issue |
| `assigned_to` | BIGINT | FOREIGN KEY → users(id), NULL | User assigned to resolve |
| `is_delegated` | BOOLEAN | DEFAULT FALSE | Whether issue was delegated |
| `delegated_from` | VARCHAR(100) | NULL | Original department if delegated |
| `created_at` | DATETIME | NOT NULL | Issue creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Last update timestamp |
| `resolved_at` | DATETIME | NULL | Resolution timestamp |
| `closed_at` | DATETIME | NULL | Closure timestamp |
| `closed_by` | BIGINT | FOREIGN KEY → users(id), NULL | User who closed the issue |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `status`
- INDEX on `department`
- INDEX on `priority`
- INDEX on `reported_by`
- INDEX on `assigned_to`
- INDEX on `created_at`

**Sample Data:**
```sql
INSERT INTO issues (title, description, source, data_element, issue_type, severity, priority, status, department, reported_by) 
VALUES 
('Missing TIN in tax records', 'Several tax records are missing TIN numbers', 'Tax Returns', 'TIN', 'Missing Data', 'High', 'High', 'OPEN', 'Finance', 3);
```

---

## 4. Issue Comments Table

**Table Name:** `issue_comments`

Stores comments and discussions on issues.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique comment identifier |
| `issue_id` | BIGINT | FOREIGN KEY → issues(id), NOT NULL | Associated issue |
| `user_id` | BIGINT | FOREIGN KEY → users(id), NOT NULL | Comment author |
| `content` | TEXT | NOT NULL | Comment text content |
| `created_at` | DATETIME | NOT NULL | Comment creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Last edit timestamp |
| `is_edited` | BOOLEAN | DEFAULT FALSE | Whether comment was edited |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `issue_id`
- INDEX on `user_id`
- INDEX on `created_at`

**Sample Data:**
```sql
INSERT INTO issue_comments (issue_id, user_id, content) 
VALUES 
(1, 2, 'I have assigned this to Jane for investigation'),
(1, 3, 'Working on identifying the root cause');
```

---

## 5. Issue Attachments Table

**Table Name:** `issue_attachments`

Stores file attachments associated with issues.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique attachment identifier |
| `issue_id` | BIGINT | FOREIGN KEY → issues(id), NOT NULL | Associated issue |
| `file_name` | VARCHAR(255) | NOT NULL | Original file name |
| `file_path` | VARCHAR(500) | NOT NULL | Server file path |
| `file_type` | VARCHAR(50) | NULL | MIME type (e.g., "application/pdf") |
| `file_size` | BIGINT | NULL | File size in bytes |
| `uploaded_by` | BIGINT | FOREIGN KEY → users(id), NOT NULL | User who uploaded |
| `uploaded_at` | DATETIME | NOT NULL | Upload timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `issue_id`
- INDEX on `uploaded_by`

**Sample Data:**
```sql
INSERT INTO issue_attachments (issue_id, file_name, file_path, file_type, file_size, uploaded_by) 
VALUES 
(1, 'missing_tin_report.xlsx', '/uploads/2024/01/abc123.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 45678, 3);
```

---

## 6. Notifications Table

**Table Name:** `notifications`

Stores in-app notifications for users.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique notification identifier |
| `user_id` | BIGINT | FOREIGN KEY → users(id), NOT NULL | Recipient user |
| `type` | ENUM('ISSUE_ASSIGNED', 'STATUS_UPDATED', 'PRIORITY_CHANGED', 'COMMENT_ADDED', 'ISSUE_CLOSED') | NOT NULL | Notification type |
| `title` | VARCHAR(255) | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification message |
| `issue_id` | BIGINT | FOREIGN KEY → issues(id), NULL | Related issue (if applicable) |
| `is_read` | BOOLEAN | DEFAULT FALSE | Read status |
| `created_at` | DATETIME | NOT NULL | Creation timestamp |
| `read_at` | DATETIME | NULL | Read timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `is_read`
- INDEX on `created_at`

**Sample Data:**
```sql
INSERT INTO notifications (user_id, type, title, message, issue_id) 
VALUES 
(3, 'ISSUE_ASSIGNED', 'New Issue Assigned', 'You have been assigned to issue: Missing TIN in tax records', 1);
```

---

## 7. Audit Logs Table

**Table Name:** `audit_logs`

Tracks all system activities for compliance and security.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique log identifier |
| `user_id` | BIGINT | FOREIGN KEY → users(id), NOT NULL | User who performed action |
| `action` | VARCHAR(100) | NOT NULL | Action performed (e.g., "LOGIN", "ISSUE_CREATED") |
| `entity_type` | VARCHAR(50) | NULL | Entity type affected (e.g., "Issue", "User") |
| `entity_id` | BIGINT | NULL | ID of affected entity |
| `details` | TEXT | NULL | Additional action details (JSON format) |
| `ip_address` | VARCHAR(45) | NULL | User's IP address |
| `user_agent` | TEXT | NULL | Browser/client user agent |
| `created_at` | DATETIME | NOT NULL | Action timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `action`
- INDEX on `entity_type`
- INDEX on `created_at`

**Sample Data:**
```sql
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address) 
VALUES 
(2, 'ISSUE_ASSIGNED', 'Issue', 1, '{"assignedTo": "Jane Smith", "department": "Finance"}', '192.168.1.100');
```

---

## 8. Password History Table

**Table Name:** `password_history`

Prevents password reuse for security compliance.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique history record identifier |
| `user_id` | BIGINT | FOREIGN KEY → users(id), NOT NULL | User account |
| `password_hash` | VARCHAR(255) | NOT NULL | Historical password hash |
| `created_at` | DATETIME | NOT NULL | Password creation timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `created_at`

**Sample Data:**
```sql
INSERT INTO password_history (user_id, password_hash) 
VALUES 
(3, '$2a$10$oldPasswordHash...');
```

---

## 9. Validation Sessions Table

**Table Name:** `validation_sessions`

Tracks data validation operations.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique session identifier |
| `user_id` | BIGINT | FOREIGN KEY → users(id), NOT NULL | User who performed validation |
| `file_name` | VARCHAR(255) | NOT NULL | Uploaded file name |
| `total_records` | INT | NOT NULL | Total records in file |
| `passed_records` | INT | NOT NULL | Records that passed validation |
| `failed_records` | INT | NOT NULL | Records that failed validation |
| `created_at` | DATETIME | NOT NULL | Validation timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `created_at`

**Sample Data:**
```sql
INSERT INTO validation_sessions (user_id, file_name, total_records, passed_records, failed_records) 
VALUES 
(3, 'tax_data_2024.csv', 1000, 950, 50);
```

---

## 10. Validation Errors Table

**Table Name:** `validation_errors`

Stores specific validation errors found during data validation.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique error identifier |
| `session_id` | BIGINT | FOREIGN KEY → validation_sessions(id), NOT NULL | Associated validation session |
| `row_number` | INT | NOT NULL | Row number in source file |
| `error_type` | VARCHAR(50) | NOT NULL | Error type (e.g., "MISSING_VALUE", "INVALID_FORMAT") |
| `field_name` | VARCHAR(100) | NOT NULL | Field/column name with error |
| `description` | TEXT | NOT NULL | Error description |
| `value` | VARCHAR(500) | NULL | Invalid value found |
| `created_at` | DATETIME | NOT NULL | Error detection timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `session_id`
- INDEX on `error_type`

**Sample Data:**
```sql
INSERT INTO validation_errors (session_id, row_number, error_type, field_name, description, value) 
VALUES 
(1, 45, 'MISSING_VALUE', 'TIN', 'TIN field is required but empty', NULL),
(1, 67, 'INVALID_FORMAT', 'Email', 'Email format is invalid', 'notanemail');
```

---

## Entity Relationships

### Relationship Diagram Summary

```
users (1) ----< (many) issues [reported_by]
users (1) ----< (many) issues [assigned_to]
users (1) ----< (many) issues [closed_by]
users (1) ----< (many) issue_comments
users (1) ----< (many) issue_attachments
users (1) ----< (many) notifications
users (1) ----< (many) audit_logs
users (1) ----< (many) password_history
users (1) ----< (many) validation_sessions

issues (1) ----< (many) issue_comments
issues (1) ----< (many) issue_attachments
issues (1) ----< (many) notifications

validation_sessions (1) ----< (many) validation_errors
```

### Foreign Key Constraints

| Child Table | Column | Parent Table | Parent Column | On Delete |
|------------|--------|--------------|---------------|-----------|
| issues | reported_by | users | id | RESTRICT |
| issues | assigned_to | users | id | SET NULL |
| issues | closed_by | users | id | SET NULL |
| issue_comments | issue_id | issues | id | CASCADE |
| issue_comments | user_id | users | id | RESTRICT |
| issue_attachments | issue_id | issues | id | CASCADE |
| issue_attachments | uploaded_by | users | id | RESTRICT |
| notifications | user_id | users | id | CASCADE |
| notifications | issue_id | issues | id | CASCADE |
| audit_logs | user_id | users | id | RESTRICT |
| password_history | user_id | users | id | CASCADE |
| validation_sessions | user_id | users | id | RESTRICT |
| validation_errors | session_id | validation_sessions | id | CASCADE |

---

## Indexes and Constraints

### Performance Indexes

**High-Priority Queries:**
1. Find issues by department and status
2. Find user notifications (unread)
3. Find issues assigned to user
4. Search audit logs by date range
5. Find validation errors by session

**Composite Indexes:**
```sql
CREATE INDEX idx_issues_dept_status ON issues(department, status);
CREATE INDEX idx_issues_assigned_status ON issues(assigned_to, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_audit_user_date ON audit_logs(user_id, created_at);
```

### Check Constraints

```sql
ALTER TABLE issues ADD CONSTRAINT chk_severity 
  CHECK (severity IN ('Low', 'Medium', 'High', 'Critical'));

ALTER TABLE issues ADD CONSTRAINT chk_priority 
  CHECK (priority IN ('Low', 'Medium', 'High', 'Critical'));

ALTER TABLE validation_sessions ADD CONSTRAINT chk_records 
  CHECK (total_records = passed_records + failed_records);
```

---

## Database Statistics

**Total Tables:** 10  
**Total Relationships:** 14  
**Estimated Storage (1 year):**
- Users: ~1,000 records (~100 KB)
- Issues: ~10,000 records (~5 MB)
- Comments: ~50,000 records (~10 MB)
- Attachments: ~20,000 records (~50 GB with files)
- Notifications: ~100,000 records (~20 MB)
- Audit Logs: ~500,000 records (~100 MB)
- Total: ~50 GB (including file storage)

---

## Backup and Maintenance

**Backup Schedule:**
- Full backup: Daily at 2:00 AM
- Incremental backup: Every 6 hours
- Retention: 30 days

**Maintenance Tasks:**
- Index optimization: Weekly
- Audit log archival: Monthly (older than 6 months)
- Validation session cleanup: Quarterly (older than 1 year)

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Author:** DQIMS Development Team  
**Organization:** Rwanda Revenue Authority (RRA)
