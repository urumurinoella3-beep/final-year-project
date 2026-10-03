# 📚 DQIMS Database Documentation

Complete reference for all database tables, columns, and relationships.

---

## 📊 TABLE OF CONTENTS

1. [Database Overview](#database-overview)
2. [Table Definitions](#table-definitions)
3. [Relationships](#relationships)
4. [Indexes](#indexes)
5. [Constraints](#constraints)
6. [Sample Queries](#sample-queries)

---

## 📋 DATABASE OVERVIEW

**Database Name:** `dqims_db`
**PostgreSQL Version:** 15.x or higher
**Character Set:** UTF8
**Collation:** Default
**Total Tables:** 10 (plus flyway_schema_history)

### Tables Summary

| # | Table Name | Primary Purpose | Records (Initial) |
|---|------------|-----------------|-------------------|
| 1 | users | User accounts & authentication | 33 |
| 2 | departments | Organizational departments | 8 |
| 3 | issues | Data quality issues | 0* |
| 4 | issue_attachments | File attachments | 0* |
| 5 | issue_comments | Issue comments/discussions | 0* |
| 6 | notifications | Email & system notifications | 0* |
| 7 | audit_logs | System audit trail | 0* |
| 8 | validation_sessions | Data validation sessions | 0* |
| 9 | validation_errors | Validation error details | 0* |
| 10 | password_history | Password change history | 0* |

*Populated during application usage

---

## 📄 TABLE DEFINITIONS

### 1. USERS TABLE

**Purpose:** Stores all user accounts with authentication and profile information

**Table:** `users`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | AUTO | Primary key |
| employee_id | VARCHAR(50) | NO | - | Unique employee identifier |
| name | VARCHAR(100) | NO | - | Full name |
| email | VARCHAR(100) | NO | - | Email address (unique) |
| phone | VARCHAR(20) | NO | - | Phone number |
| password_hash | VARCHAR(255) | NO | - | BCrypt hashed password |
| role | VARCHAR(20) | NO | - | User role (ADMIN/HOD/STAFF) |
| department | VARCHAR(50) | NO | - | Department name |
| is_active | BOOLEAN | YES | TRUE | Account active status |
| is_first_login | BOOLEAN | YES | TRUE | First login flag |
| password_reset_token | VARCHAR(255) | YES | NULL | Password reset token |
| password_reset_expiry | TIMESTAMP | YES | NULL | Token expiry time |
| created_at | TIMESTAMP | YES | NOW() | Record creation time |
| updated_at | TIMESTAMP | YES | NOW() | Last update time |

**Constraints:**
- PRIMARY KEY: id
- UNIQUE: employee_id, email
- CHECK: role IN ('ADMIN', 'HOD', 'STAFF')

**Indexes:**
- idx_users_email
- idx_users_employee_id
- idx_users_department
- idx_users_role

---

### 2. DEPARTMENTS TABLE

**Purpose:** Organizational departments within RRA

**Table:** `departments`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | AUTO | Primary key |
| name | VARCHAR(100) | NO | - | Department name (unique) |
| description | TEXT | YES | NULL | Department description |
| is_active | BOOLEAN | YES | TRUE | Active status |
| created_at | TIMESTAMP | YES | NOW() | Creation time |
| updated_at | TIMESTAMP | YES | NOW() | Last update time |

**Constraints:**
- PRIMARY KEY: id
- UNIQUE: name

**Indexes:**
- idx_departments_name

**Seeded Departments:**
1. VAT
2. CUSTOMS
3. DOMESTIC TAX
4. IT
5. TAX INVESTIGATIONS
6. HR
7. FINANCE
8. DATA MANAGEMENT

---

### 3. ISSUES TABLE

**Purpose:** Data quality issues reported by users

**Table:** `issues`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | AUTO | Primary key |
| title | VARCHAR(255) | NO | - | Issue title |
| description | TEXT | NO | - | Detailed description |
| source | VARCHAR(50) | NO | - | Data source |
| data_element | VARCHAR(100) | NO | - | Affected data element |
| issue_type | VARCHAR(50) | NO | - | Type of issue |
| severity | VARCHAR(20) | NO | - | Severity level |
| priority | VARCHAR(20) | NO | - | Priority level |
| status | VARCHAR(20) | NO | OPEN | Current status |
| department | VARCHAR(50) | NO | - | Responsible department |
| reported_by | BIGINT | NO | - | Reporter user ID (FK) |
| assigned_to | BIGINT | YES | NULL | Assigned user ID (FK) |
| is_delegated | BOOLEAN | YES | FALSE | Delegation flag |
| delegated_from | VARCHAR(100) | YES | NULL | Original reporter |
| created_at | TIMESTAMP | YES | NOW() | Creation time |
| updated_at | TIMESTAMP | YES | NOW() | Last update time |
| resolved_at | TIMESTAMP | YES | NULL | Resolution time |
| closed_at | TIMESTAMP | YES | NULL | Closure time |
| closed_by | BIGINT | YES | NULL | Closer user ID (FK) |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: reported_by → users(id)
- FOREIGN KEY: assigned_to → users(id)
- FOREIGN KEY: closed_by → users(id)

**Indexes:**
- idx_issues_status
- idx_issues_priority
- idx_issues_department
- idx_issues_reported_by
- idx_issues_assigned_to
- idx_issues_created_at (DESC)

**Valid Values:**
- **status:** OPEN, IN_PROGRESS, RESOLVED, CLOSED
- **priority:** HIGH, MEDIUM, LOW
- **severity:** CRITICAL, HIGH, MEDIUM, LOW
- **source:** VAT, CUSTOMS, TAXPAYER_SYSTEM, OTHER
- **issue_type:** DUPLICATE, MISSING, INCORRECT, INCONSISTENT

---

### 4. ISSUE_ATTACHMENTS TABLE

**Purpose:** File attachments for issues

**Table:** `issue_attachments`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | AUTO | Primary key |
| issue_id | BIGINT | NO | - | Related issue ID (FK) |
| file_name | VARCHAR(255) | NO | - | Original filename |
| file_path | VARCHAR(500) | NO | - | Storage path |
| file_type | VARCHAR(100) | YES | NULL | MIME type |
| file_size | BIGINT | YES | NULL | Size in bytes |
| uploaded_by | BIGINT | NO | - | Uploader user ID (FK) |
| uploaded_at | TIMESTAMP | YES | NOW() | Upload time |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: issue_id → issues(id) ON DELETE CASCADE
- FOREIGN KEY: uploaded_by → users(id)

**Indexes:**
- idx_attachments_issue_id
- idx_attachments_uploaded_by

---

### 5. ISSUE_COMMENTS TABLE

**Purpose:** Comments and discussions on issues

**Table:** `issue_comments`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | AUTO | Primary key |
| issue_id | BIGINT | NO | - | Related issue ID (FK) |
| user_id | BIGINT | NO | - | Comment author ID (FK) |
| content | TEXT | NO | - | Comment text |
| created_at | TIMESTAMP | YES | NOW() | Creation time |
| updated_at | TIMESTAMP | YES | NOW() | Last edit time |
| is_edited | BOOLEAN | YES | FALSE | Edit flag |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: issue_id → issues(id) ON DELETE CASCADE
- FOREIGN KEY: user_id → users(id)

**Indexes:**
- idx_comments_issue_id
- idx_comments_user_id
- idx_comments_created_at (DESC)

---

### 6. NOTIFICATIONS TABLE

**Purpose:** Email and system notifications

**Table:** `notifications`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | AUTO | Primary key |
| user_id | BIGINT | NO | - | Recipient user ID (FK) |
| type | VARCHAR(50) | NO | - | Notification type |
| title | VARCHAR(255) | NO | - | Notification title |
| message | TEXT | NO | - | Notification message |
| issue_id | BIGINT | YES | NULL | Related issue ID (FK) |
| is_read | BOOLEAN | YES | FALSE | Read status |
| created_at | TIMESTAMP | YES | NOW() | Creation time |
| read_at | TIMESTAMP | YES | NULL | Read time |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: user_id → users(id)
- FOREIGN KEY: issue_id → issues(id)

**Indexes:**
- idx_notifications_user_id
- idx_notifications_issue_id
- idx_notifications_is_read
- idx_notifications_created_at (DESC)

**Notification Types:**
- ISSUE_ASSIGNED
- ISSUE_UPDATED
- ISSUE_RESOLVED
- ISSUE_CLOSED
- COMMENT_ADDED

---

### 7. AUDIT_LOGS TABLE

**Purpose:** System audit trail for compliance

**Table:** `audit_logs`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | AUTO | Primary key |
| user_id | BIGINT | NO | - | Acting user ID (FK) |
| action | VARCHAR(100) | NO | - | Action performed |
| entity_type | VARCHAR(50) | YES | NULL | Entity affected |
| entity_id | BIGINT | YES | NULL | Entity record ID |
| details | TEXT | YES | NULL | Action details (JSON) |
| ip_address | VARCHAR(45) | YES | NULL | Client IP address |
| user_agent | TEXT | YES | NULL | Client user agent |
| created_at | TIMESTAMP | YES | NOW() | Action timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: user_id → users(id)

**Indexes:**
- idx_audit_user_id
- idx_audit_action
- idx_audit_entity_type
- idx_audit_created_at (DESC)

**Common Actions:**
- CREATE_USER, UPDATE_USER, DELETE_USER
- CREATE_ISSUE, UPDATE_ISSUE, DELETE_ISSUE
- LOGIN, LOGOUT, PASSWORD_CHANGE

---

### 8. VALIDATION_SESSIONS TABLE

**Purpose:** Data validation file upload sessions

**Table:** `validation_sessions`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | AUTO | Primary key |
| user_id | BIGINT | NO | - | Validator user ID (FK) |
| file_name | VARCHAR(255) | NO | - | Uploaded filename |
| total_records | INTEGER | NO | - | Total records in file |
| passed_records | INTEGER | NO | - | Valid records count |
| failed_records | INTEGER | NO | - | Invalid records count |
| created_at | TIMESTAMP | YES | NOW() | Upload timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: user_id → users(id)

**Indexes:**
- idx_validation_user_id
- idx_validation_created_at (DESC)

---

### 9. VALIDATION_ERRORS TABLE

**Purpose:** Detailed validation errors

**Table:** `validation_errors`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | AUTO | Primary key |
| session_id | BIGINT | NO | - | Session ID (FK) |
| row_number | INTEGER | NO | - | Row number in file |
| error_type | VARCHAR(50) | NO | - | Error category |
| field_name | VARCHAR(100) | NO | - | Field with error |
| description | TEXT | NO | - | Error description |
| value | TEXT | YES | NULL | Invalid value |
| created_at | TIMESTAMP | YES | NOW() | Detection time |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: session_id → validation_sessions(id) ON DELETE CASCADE

**Indexes:**
- idx_validation_errors_session_id
- idx_validation_errors_error_type

**Error Types:**
- COMPLETENESS (missing data)
- FORMAT (wrong format)
- ACCURACY (incorrect value)
- UNIQUENESS (duplicate)

---

### 10. PASSWORD_HISTORY TABLE

**Purpose:** Password change history for security

**Table:** `password_history`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | AUTO | Primary key |
| user_id | BIGINT | NO | - | User ID (FK) |
| password_hash | VARCHAR(255) | NO | - | Previous password hash |
| created_at | TIMESTAMP | YES | NOW() | Change timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: user_id → users(id) ON DELETE CASCADE

**Indexes:**
- idx_password_history_user_id
- idx_password_history_created_at (DESC)

---

## 🔗 RELATIONSHIPS

### Entity Relationship Diagram (Text)

```
users (1) ----< (M) issues [reported_by]
users (1) ----< (M) issues [assigned_to]
users (1) ----< (M) issues [closed_by]
users (1) ----< (M) issue_attachments [uploaded_by]
users (1) ----< (M) issue_comments [user_id]
users (1) ----< (M) notifications [user_id]
users (1) ----< (M) audit_logs [user_id]
users (1) ----< (M) validation_sessions [user_id]
users (1) ----< (M) password_history [user_id]

issues (1) ----< (M) issue_attachments [issue_id]
issues (1) ----< (M) issue_comments [issue_id]
issues (1) ----< (M) notifications [issue_id]

validation_sessions (1) ----< (M) validation_errors [session_id]
```

---

## 📊 SAMPLE QUERIES

### User Management

```sql
-- Get all users by role
SELECT role, COUNT(*) as count
FROM users
GROUP BY role
ORDER BY role;

-- Get users by department
SELECT department, COUNT(*) as staff_count
FROM users
WHERE role = 'STAFF'
GROUP BY department
ORDER BY department;

-- Find user by email
SELECT id, name, email, role, department
FROM users
WHERE email = 'admin@rra.gov.rw';
```

### Issue Management

```sql
-- Get issues by status
SELECT status, COUNT(*) as count
FROM issues
GROUP BY status
ORDER BY status;

-- Get open issues by department
SELECT department, COUNT(*) as open_issues
FROM issues
WHERE status = 'OPEN'
GROUP BY department
ORDER BY open_issues DESC;

-- Get user's assigned issues
SELECT i.id, i.title, i.status, i.priority, i.created_at
FROM issues i
WHERE i.assigned_to = (SELECT id FROM users WHERE email = 'john.doe@rra.gov.rw')
ORDER BY i.created_at DESC;
```

### Reporting

```sql
-- Issue resolution time (average days)
SELECT 
    AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/86400) as avg_resolution_days
FROM issues
WHERE resolved_at IS NOT NULL;

-- Most active users (by comments)
SELECT 
    u.name,
    u.department,
    COUNT(c.id) as comment_count
FROM users u
JOIN issue_comments c ON u.id = c.user_id
GROUP BY u.id, u.name, u.department
ORDER BY comment_count DESC
LIMIT 10;
```

---

## 🎯 INDEX STRATEGY

**Performance Optimization:**

- Foreign keys are indexed for JOIN operations
- Status and priority fields are indexed for filtering
- Timestamps are indexed (DESC) for chronological queries
- Email and employee_id are indexed for authentication
- Composite indexes may be added based on query patterns

---

## 💾 BACKUP STRATEGY

```sql
-- Full backup
pg_dump -U postgres -d dqims_db -f full_backup.sql

-- Schema only
pg_dump -U postgres -d dqims_db --schema-only -f schema_backup.sql

-- Data only
pg_dump -U postgres -d dqims_db --data-only -f data_backup.sql

-- Specific table
pg_dump -U postgres -d dqims_db -t users -f users_backup.sql
```

---

**Documentation Version:** 1.0
**Last Updated:** June 16, 2026
**Database Version:** PostgreSQL 15.x
