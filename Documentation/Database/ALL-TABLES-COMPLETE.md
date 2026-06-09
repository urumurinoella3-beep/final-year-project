# DQIMS Complete Database Tables Documentation

## All 10 Tables with Complete Field Information

---

## TABLE 1: users

**Purpose:** Store all system users (Admin, HOD, Staff)

| Field Name | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGINT(20) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each user |
| employee_id | VARCHAR(50) | UNIQUE, NOT NULL | Permanent RRA Employee ID (e.g., EMP001) |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address (used as username for login) |
| phone | VARCHAR(20) | NOT NULL | Contact phone number |
| password_hash | VARCHAR(255) | NOT NULL | BCrypt encrypted password |
| role | VARCHAR(20) | NOT NULL | User role: ADMIN, HOD, or STAFF |
| department | VARCHAR(100) | NOT NULL | Department name |
| is_active | BOOLEAN | DEFAULT TRUE | Account active status (true/false) |
| is_first_login | BOOLEAN | DEFAULT TRUE | First time login flag (forces password change) |
| password_reset_token | VARCHAR(255) | NULL | Token for password reset functionality |
| password_reset_expiry | DATETIME | NULL | Expiration time for reset token (1 hour) |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `email`
- UNIQUE INDEX: `employee_id`
- INDEX: `department`
- INDEX: `role`

**Sample Data:**
```sql
INSERT INTO users (employee_id, name, email, phone, password_hash, role, department) 
VALUES 
('EMP001', 'Admin User', 'admin@rra.gov.rw', '+250788000001', '$2a$10$...', 'ADMIN', 'IT'),
('EMP002', 'John Doe', 'john.doe@rra.gov.rw', '+250788000002', '$2a$10$...', 'HOD', 'Finance'),
('EMP003', 'Jane Smith', 'jane.smith@rra.gov.rw', '+250788000003', '$2a$10$...', 'STAFF', 'Finance');
```

---

## TABLE 2: departments

**Purpose:** Store organizational departments within RRA

| Field Name | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGINT(20) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each department |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Department name (e.g., Finance, IT, HR) |
| description | TEXT | NULL | Department description and responsibilities |
| is_active | BOOLEAN | DEFAULT TRUE | Department active status |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Department creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `name`

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

## TABLE 3: issues

**Purpose:** Core table storing all data quality issues

| Field Name | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGINT(20) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each issue |
| title | VARCHAR(255) | NOT NULL | Issue title/summary |
| description | TEXT | NOT NULL | Detailed issue description |
| source | VARCHAR(100) | NOT NULL | Data source (e.g., "Tax Returns", "Customs Data") |
| data_element | VARCHAR(100) | NOT NULL | Specific data element affected (e.g., "TIN", "Amount") |
| issue_type | VARCHAR(50) | NOT NULL | Type: Missing Data, Inconsistency, Duplication, etc. |
| severity | VARCHAR(20) | NOT NULL | Severity level: Low, Medium, High, Critical |
| priority | VARCHAR(20) | NOT NULL | Priority level: Low, Medium, High, Critical |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'OPEN' | Current status: OPEN, IN_PROGRESS, RESOLVED, CLOSED |
| department | VARCHAR(100) | NOT NULL | Department responsible for the issue |
| reported_by | BIGINT(20) | FOREIGN KEY → users(id), NOT NULL | User who reported the issue |
| assigned_to | BIGINT(20) | FOREIGN KEY → users(id), NULL | User assigned to resolve the issue |
| closed_by | BIGINT(20) | FOREIGN KEY → users(id), NULL | User who closed the issue (HOD only) |
| is_delegated | BOOLEAN | DEFAULT FALSE | Whether issue was delegated to another department |
| delegated_from | VARCHAR(100) | NULL | Original department if issue was delegated |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Issue creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |
| resolved_at | DATETIME | NULL | Timestamp when issue was marked as resolved |
| closed_at | DATETIME | NULL | Timestamp when issue was closed by HOD |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `status`
- INDEX: `department`
- INDEX: `priority`
- INDEX: `reported_by`
- INDEX: `assigned_to`
- INDEX: `created_at`

**Foreign Keys:**
- `reported_by` → `users(id)` ON DELETE RESTRICT
- `assigned_to` → `users(id)` ON DELETE SET NULL
- `closed_by` → `users(id)` ON DELETE SET NULL

**Sample Data:**
```sql
INSERT INTO issues (title, description, source, data_element, issue_type, severity, priority, status, department, reported_by) 
VALUES 
('Missing TIN in tax records', 'Several tax records are missing TIN numbers', 'Tax Returns', 'TIN', 'Missing Data', 'High', 'High', 'OPEN', 'Finance', 3);
```

---

## TABLE 4: issue_comments

**Purpose:** Store comments and discussions on issues

| Field Name | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGINT(20) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each comment |
| issue_id | BIGINT(20) | FOREIGN KEY → issues(id), NOT NULL | Associated issue |
| user_id | BIGINT(20) | FOREIGN KEY → users(id), NOT NULL | Comment author |
| content | TEXT | NOT NULL | Comment text content |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Comment creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last edit timestamp |
| is_edited | BOOLEAN | DEFAULT FALSE | Whether comment was edited after posting |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `issue_id`
- INDEX: `user_id`
- INDEX: `created_at`

**Foreign Keys:**
- `issue_id` → `issues(id)` ON DELETE CASCADE
- `user_id` → `users(id)` ON DELETE RESTRICT

**Sample Data:**
```sql
INSERT INTO issue_comments (issue_id, user_id, content) 
VALUES 
(1, 2, 'I have assigned this to Jane for investigation'),
(1, 3, 'Working on identifying the root cause');
```

---

## TABLE 5: issue_attachments

**Purpose:** Store file attachments associated with issues

| Field Name | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGINT(20) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each attachment |
| issue_id | BIGINT(20) | FOREIGN KEY → issues(id), NOT NULL | Associated issue |
| file_name | VARCHAR(255) | NOT NULL | Original file name |
| file_path | VARCHAR(500) | NOT NULL | Server file path (e.g., /var/dqims/files/...) |
| file_type | VARCHAR(50) | NULL | MIME type (e.g., "application/pdf", "text/csv") |
| file_size | BIGINT | NULL | File size in bytes |
| uploaded_by | BIGINT(20) | FOREIGN KEY → users(id), NOT NULL | User who uploaded the file |
| uploaded_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Upload timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `issue_id`
- INDEX: `uploaded_by`

**Foreign Keys:**
- `issue_id` → `issues(id)` ON DELETE CASCADE
- `uploaded_by` → `users(id)` ON DELETE RESTRICT

**Sample Data:**
```sql
INSERT INTO issue_attachments (issue_id, file_name, file_path, file_type, file_size, uploaded_by) 
VALUES 
(1, 'missing_tin_report.xlsx', '/var/dqims/files/2024/01/abc123.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 45678, 3);
```

---

## TABLE 6: notifications

**Purpose:** Store in-app notifications for users

| Field Name | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGINT(20) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each notification |
| user_id | BIGINT(20) | FOREIGN KEY → users(id), NOT NULL | Recipient user |
| type | VARCHAR(50) | NOT NULL | Notification type: ISSUE_ASSIGNED, STATUS_UPDATED, PRIORITY_CHANGED, COMMENT_ADDED, ISSUE_CLOSED |
| title | VARCHAR(255) | NOT NULL | Notification title/heading |
| message | TEXT | NOT NULL | Notification message content |
| issue_id | BIGINT(20) | FOREIGN KEY → issues(id), NULL | Related issue (if applicable) |
| is_read | BOOLEAN | DEFAULT FALSE | Read status (true if user has read it) |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Notification creation timestamp |
| read_at | DATETIME | NULL | Timestamp when notification was read |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `user_id`
- INDEX: `is_read`
- INDEX: `created_at`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE
- `issue_id` → `issues(id)` ON DELETE CASCADE

**Sample Data:**
```sql
INSERT INTO notifications (user_id, type, title, message, issue_id) 
VALUES 
(3, 'ISSUE_ASSIGNED', 'New Issue Assigned', 'You have been assigned to issue: Missing TIN in tax records', 1);
```

---

## TABLE 7: audit_logs

**Purpose:** Track all system activities for compliance and security

| Field Name | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGINT(20) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each log entry |
| user_id | BIGINT(20) | FOREIGN KEY → users(id), NOT NULL | User who performed the action |
| action | VARCHAR(100) | NOT NULL | Action performed (e.g., LOGIN, ISSUE_CREATED, USER_CREATED, STATUS_CHANGED) |
| entity_type | VARCHAR(50) | NULL | Entity type affected (e.g., Issue, User, Department) |
| entity_id | BIGINT | NULL | ID of the affected entity |
| details | TEXT | NULL | Additional action details in JSON format |
| ip_address | VARCHAR(45) | NULL | User's IP address (supports IPv4 and IPv6) |
| user_agent | TEXT | NULL | Browser/client user agent string |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Action timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `user_id`
- INDEX: `action`
- INDEX: `entity_type`
- INDEX: `created_at`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE RESTRICT

**Sample Data:**
```sql
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address) 
VALUES 
(2, 'ISSUE_ASSIGNED', 'Issue', 1, '{"assignedTo": "Jane Smith", "department": "Finance"}', '192.168.1.100');
```

---

## TABLE 8: password_history

**Purpose:** Prevent password reuse for security compliance

| Field Name | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGINT(20) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each history record |
| user_id | BIGINT(20) | FOREIGN KEY → users(id), NOT NULL | User account |
| password_hash | VARCHAR(255) | NOT NULL | Historical password hash (BCrypt) |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Password creation timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `user_id`
- INDEX: `created_at`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

**Sample Data:**
```sql
INSERT INTO password_history (user_id, password_hash) 
VALUES 
(3, '$2a$10$oldPasswordHash...');
```

**Note:** System prevents reuse of last 5 passwords

---

## TABLE 9: validation_sessions

**Purpose:** Track data validation operations

| Field Name | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGINT(20) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each validation session |
| user_id | BIGINT(20) | FOREIGN KEY → users(id), NOT NULL | User who performed the validation |
| file_name | VARCHAR(255) | NOT NULL | Uploaded file name |
| total_records | INT | NOT NULL | Total number of records in the file |
| passed_records | INT | NOT NULL | Number of records that passed validation |
| failed_records | INT | NOT NULL | Number of records that failed validation |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Validation timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `user_id`
- INDEX: `created_at`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE RESTRICT

**Sample Data:**
```sql
INSERT INTO validation_sessions (user_id, file_name, total_records, passed_records, failed_records) 
VALUES 
(3, 'tax_data_2024.csv', 1000, 950, 50);
```

**Calculated Field:**
- Success Rate = (passed_records / total_records) * 100

---

## TABLE 10: validation_errors

**Purpose:** Store specific validation errors found during data validation

| Field Name | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGINT(20) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each error |
| session_id | BIGINT(20) | FOREIGN KEY → validation_sessions(id), NOT NULL | Associated validation session |
| row_number | INT | NOT NULL | Row number in the source file where error occurred |
| error_type | VARCHAR(50) | NOT NULL | Error type: MISSING_VALUE, INVALID_FORMAT, DATA_TYPE_MISMATCH, BUSINESS_RULE_VIOLATION |
| field_name | VARCHAR(100) | NOT NULL | Field/column name that has the error |
| description | TEXT | NOT NULL | Detailed error description |
| value | VARCHAR(500) | NULL | The invalid value that was found |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Error detection timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `session_id`
- INDEX: `error_type`

**Foreign Keys:**
- `session_id` → `validation_sessions(id)` ON DELETE CASCADE

**Sample Data:**
```sql
INSERT INTO validation_errors (session_id, row_number, error_type, field_name, description, value) 
VALUES 
(1, 45, 'MISSING_VALUE', 'TIN', 'TIN field is required but empty', NULL),
(1, 67, 'INVALID_FORMAT', 'Email', 'Email format is invalid', 'notanemail');
```

---

## RELATIONSHIPS SUMMARY

### Total Relationships: 14 Foreign Keys

1. **issues.reported_by** → users.id (Who reported the issue)
2. **issues.assigned_to** → users.id (Who is assigned to fix it)
3. **issues.closed_by** → users.id (Who closed the issue)
4. **issue_comments.issue_id** → issues.id (Comment belongs to issue)
5. **issue_comments.user_id** → users.id (Comment author)
6. **issue_attachments.issue_id** → issues.id (Attachment belongs to issue)
7. **issue_attachments.uploaded_by** → users.id (Who uploaded the file)
8. **notifications.user_id** → users.id (Notification recipient)
9. **notifications.issue_id** → issues.id (Related issue)
10. **audit_logs.user_id** → users.id (Who performed the action)
11. **password_history.user_id** → users.id (Password belongs to user)
12. **validation_sessions.user_id** → users.id (Who ran the validation)
13. **validation_errors.session_id** → validation_sessions.id (Error belongs to session)

---

## ENUMERATIONS

### User Roles
- `ADMIN` - System Administrator
- `HOD` - Head of Department
- `STAFF` - Staff Member

### Issue Status
- `OPEN` - Newly reported, not yet assigned or started
- `IN_PROGRESS` - Staff is working on it
- `RESOLVED` - Staff has resolved, waiting for HOD approval
- `CLOSED` - HOD has approved and closed the issue

### Issue Severity
- `Low` - Minor impact
- `Medium` - Moderate impact
- `High` - Significant impact
- `Critical` - Severe impact, urgent attention needed

### Issue Priority
- `Low` - Can be addressed later
- `Medium` - Should be addressed soon
- `High` - Should be addressed quickly
- `Critical` - Must be addressed immediately

### Notification Types
- `ISSUE_ASSIGNED` - Issue assigned to staff
- `STATUS_UPDATED` - Issue status changed
- `PRIORITY_CHANGED` - Issue priority modified
- `COMMENT_ADDED` - New comment added
- `ISSUE_CLOSED` - Issue closed by HOD

### Validation Error Types
- `MISSING_VALUE` - Required field is empty
- `INVALID_FORMAT` - Data format is incorrect
- `DATA_TYPE_MISMATCH` - Wrong data type
- `BUSINESS_RULE_VIOLATION` - Violates business rules

---

## DATABASE STATISTICS

| Metric | Value |
|--------|-------|
| Total Tables | 10 |
| Total Fields | 90+ |
| Primary Keys | 10 |
| Foreign Keys | 14 |
| Unique Constraints | 4 (users.email, users.employee_id, departments.name) |
| Indexes | 25+ |
| Enumerations | 5 types |

---

## STORAGE ESTIMATES (1 YEAR)

| Table | Estimated Records | Estimated Storage |
|-------|------------------|-------------------|
| users | ~100 | ~10 KB |
| departments | ~10 | ~1 KB |
| issues | ~10,000 | ~5 MB |
| issue_comments | ~50,000 | ~10 MB |
| issue_attachments | ~20,000 | ~50 GB (with files) |
| notifications | ~100,000 | ~20 MB |
| audit_logs | ~500,000 | ~100 MB |
| password_history | ~500 | ~50 KB |
| validation_sessions | ~1,000 | ~100 KB |
| validation_errors | ~50,000 | ~10 MB |
| **TOTAL** | | **~50 GB** |

---

## CASCADE RULES

### ON DELETE CASCADE (Child records deleted automatically)
- issue_comments (when issue is deleted)
- issue_attachments (when issue is deleted)
- notifications (when user or issue is deleted)
- password_history (when user is deleted)
- validation_errors (when validation session is deleted)

### ON DELETE RESTRICT (Prevents deletion if child records exist)
- users (if they have reported issues or audit logs)
- issues (if they have comments or attachments)

### ON DELETE SET NULL (Sets foreign key to NULL)
- issues.assigned_to (when assigned user is deleted)
- issues.closed_by (when closing user is deleted)

---

## SECURITY FEATURES

1. **Password Security**
   - BCrypt hashing (10 rounds)
   - Password history (prevents reuse)
   - First-time password change required

2. **Access Control**
   - Role-based permissions
   - Department-based data filtering
   - Audit logging for all actions

3. **Data Integrity**
   - Foreign key constraints
   - Unique constraints on critical fields
   - NOT NULL constraints on required fields

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Database:** MySQL 8.0  
**Character Set:** UTF-8 (utf8mb4_unicode_ci)  
**Project:** Data Quality Issues Management System (DQIMS)  
**Organization:** Rwanda Revenue Authority (RRA)
