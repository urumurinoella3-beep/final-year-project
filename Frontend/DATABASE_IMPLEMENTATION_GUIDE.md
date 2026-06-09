# DQIMS Database Implementation Guide

## Rwanda Revenue Authority (RRA)
### Data Quality Issues Management System

---

## Table of Contents

1. [Overview](#overview)
2. [Database Design](#database-design)
3. [Installation Instructions](#installation-instructions)
4. [Table Descriptions](#table-descriptions)
5. [Relationships & ERD](#relationships--erd)
6. [Security Considerations](#security-considerations)
7. [Performance Optimization](#performance-optimization)
8. [Backup & Recovery](#backup--recovery)
9. [API Integration Guidelines](#api-integration-guidelines)
10. [Testing & Validation](#testing--validation)

---

## Overview

The DQIMS database is designed to support a comprehensive data quality management system for Rwanda Revenue Authority. It handles:

- **User Management**: Role-based access control (ADMIN, HOD, Secretary, Member)
- **Issue Tracking**: Complete lifecycle management of data quality issues
- **Data Validation**: Automated validation rules and execution tracking
- **Audit & Compliance**: Full audit trail of all system activities
- **Analytics & Reporting**: Performance metrics and trend analysis
- **Integration**: External system connections and synchronization

### Technology Stack

- **Database**: PostgreSQL 14+ (recommended)
- **Alternative**: MySQL 8.0+, MariaDB 10.5+
- **Extensions**: uuid-ossp, pg_trgm (for PostgreSQL)

---

## Database Design

### Database Statistics

| Category | Count |
|----------|-------|
| Tables | 20 |
| Views | 4 |
| Functions | 4 |
| Triggers | 6 |
| Indexes | 20+ |

### Key Features

✅ UUID primary keys for security and scalability  
✅ Automated timestamp tracking  
✅ Referential integrity enforcement  
✅ Full audit trail  
✅ Role-based data access  
✅ Performance-optimized indexes  
✅ Business logic functions  
✅ Data validation triggers  

---

## Installation Instructions

### Step 1: Install PostgreSQL

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### On Windows:
Download and install from: https://www.postgresql.org/download/windows/

#### On macOS:
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Step 2: Create Database User

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create user
CREATE USER dqims_admin WITH PASSWORD 'your_secure_password_here';

# Grant privileges
ALTER USER dqims_admin CREATEDB;

# Exit
\q
```

### Step 3: Create Database and Schema

```bash
# Login as dqims_admin
psql -U dqims_admin -d postgres

# Or use the SQL file
psql -U dqims_admin -d postgres -f DATABASE_SCHEMA.sql
```

### Step 4: Load Sample Data (Optional)

```bash
psql -U dqims_admin -d dqims_rra -f SAMPLE_DATA_INSERTS.sql
```

### Step 5: Verify Installation

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check record counts
SELECT 'departments' as table_name, COUNT(*) FROM departments
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'issues', COUNT(*) FROM issues;
```

---

## Table Descriptions

### Core Tables

#### 1. **departments**
Stores RRA departments (IT, Domestic Tax, Customs, etc.)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| dept_code | VARCHAR(20) | Unique department code (e.g., 'IT', 'DT') |
| dept_name | VARCHAR(100) | Department full name |
| description | TEXT | Department description |
| is_active | BOOLEAN | Active status |

**Sample Data:**
```sql
INSERT INTO departments (dept_code, dept_name) VALUES 
('IT', 'Information Technology'),
('DT', 'Domestic Tax'),
('CT', 'Customs & Tax');
```

---

#### 2. **users**
All system users with role-based access

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| employee_id | VARCHAR(50) | Unique employee identifier |
| email | VARCHAR(100) | Email address (unique) |
| password_hash | VARCHAR(255) | Hashed password (bcrypt) |
| full_name | VARCHAR(100) | Full name |
| role | VARCHAR(20) | ADMIN, HOD, Secretary, Member |
| department_id | UUID | Foreign key to departments |
| is_active | BOOLEAN | Active status |
| last_login | TIMESTAMP | Last login time |

**Important Notes:**
- Passwords must be hashed using bcrypt with salt rounds ≥ 10
- HODs can only see/assign issues within their department
- ADMINs have system-wide access
- Members can only view/update issues assigned to them

---

#### 3. **issues**
Main table for data quality issues

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| issue_number | VARCHAR(50) | Auto-generated (ISS-2026-0001) |
| title | VARCHAR(200) | Issue title |
| description | TEXT | Detailed description |
| severity | VARCHAR(20) | Critical, High, Medium, Low |
| priority | VARCHAR(20) | Critical, High, Medium, Low |
| status | VARCHAR(20) | Open, In Progress, Pending, Resolved, Closed |
| sla_due_date | TIMESTAMP | SLA deadline |
| sla_status | VARCHAR(20) | On Track, At Risk, Breached |
| reported_by | UUID | User who reported |
| assigned_to | UUID | Assigned user |
| department_id | UUID | Department |
| category_id | UUID | Issue category |

**Status Workflow:**
```
Open → In Progress → Pending → Resolved → Closed
                    ↓
                 Rejected
```

---

#### 4. **issue_categories**
Predefined issue classification categories

| Column | Type | Description |
|--------|------|-------------|
| category_code | VARCHAR(20) | Unique code |
| category_name | VARCHAR(100) | Display name |
| severity_level | VARCHAR(20) | Default severity |
| color_code | VARCHAR(7) | Hex color for UI |

**Sample Categories:**
- DATA_QUALITY - Data accuracy/completeness issues
- SYSTEM_ERROR - Technical errors
- INTEGRATION - Integration problems
- VALIDATION - Validation rule failures
- COMPLIANCE - Regulatory compliance issues

---

#### 5. **data_validation_rules**
Validation rules for data quality checks

| Column | Type | Description |
|--------|------|-------------|
| rule_code | VARCHAR(20) | Unique rule code |
| rule_name | VARCHAR(100) | Rule display name |
| data_source | VARCHAR(100) | Target system/database |
| validation_type | VARCHAR(50) | Format, Range, Consistency, etc. |
| rule_logic | TEXT | SQL or business logic |
| severity | VARCHAR(20) | Rule severity level |

**Validation Types:**
- Format - Data format validation
- Range - Numeric/date range checks
- Consistency - Cross-field validation
- Completeness - Required field checks
- Uniqueness - Duplicate detection
- Referential Integrity - Foreign key validation
- Business Rule - Custom business logic

---

#### 6. **data_validation_executions**
Records of validation rule executions

| Column | Type | Description |
|--------|------|-------------|
| execution_number | VARCHAR(50) | VAL-2026-0001 |
| rule_id | UUID | Validation rule |
| executed_by | UUID | User who executed |
| execution_status | VARCHAR(20) | Running, Completed, Failed |
| total_records_checked | INTEGER | Total records |
| records_passed | INTEGER | Passed records |
| records_failed | INTEGER | Failed records |
| pass_rate | DECIMAL(5,2) | Success percentage |
| execution_time_seconds | INTEGER | Execution duration |

---

#### 7. **audit_logs**
Complete audit trail for compliance

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | User who performed action |
| action_type | VARCHAR(50) | CREATE, UPDATE, DELETE, VIEW, etc. |
| module_name | VARCHAR(50) | Module name |
| entity_type | VARCHAR(50) | Affected entity type |
| entity_id | UUID | Entity ID |
| old_values | JSONB | Previous state |
| new_values | JSONB | New state |
| ip_address | VARCHAR(45) | User IP address |
| action_result | VARCHAR(20) | Success, Failed |

**Action Types:**
- LOGIN/LOGOUT
- CREATE/UPDATE/DELETE
- VIEW/EXPORT
- ASSIGN/REASSIGN
- APPROVE/REJECT

---

### Supporting Tables

#### 8. **issue_comments**
Discussion threads for issues

#### 9. **related_issues**
Links between related issues (duplicate, blocks, causes, etc.)

#### 10. **root_cause_analysis**
RCA data using 5 Whys and Fishbone methods

#### 11. **sla_configurations**
SLA rules by severity/priority

#### 12. **notifications**
User notifications

#### 13. **reports**
Generated reports and analytics

#### 14. **dashboard_metrics**
Cached dashboard statistics

#### 15. **integrations**
External system connections

#### 16. **integration_logs**
Integration sync history

#### 17. **issue_history**
Change tracking for issues

#### 18. **attachments**
File attachment metadata

#### 19. **system_settings**
System configuration

#### 20. **data_validation_failures**
Individual validation failure records

---

## Relationships & ERD

### Key Relationships

```
departments
    ↓ (1:N)
users ← issues → issue_categories
    ↓              ↓
issue_comments  related_issues
    ↓
root_cause_analysis

data_validation_rules
    ↓ (1:N)
data_validation_executions
    ↓ (1:N)
data_validation_failures → issues

users → audit_logs
users → notifications
```

### Foreign Key Constraints

All foreign keys use **ON DELETE** actions:
- `CASCADE` - Automatically delete child records (comments, history)
- `SET NULL` - Set to NULL when parent deleted (optional relationships)
- `RESTRICT` - Prevent deletion if children exist (core entities)

---

## Security Considerations

### 1. Password Security

```javascript
// Use bcrypt for password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Hash password
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

// Verify password
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### 2. SQL Injection Prevention

✅ **Always use parameterized queries:**

```javascript
// ✅ GOOD - Parameterized
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [userEmail]);

// ❌ BAD - String concatenation
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

### 3. Row Level Security (RLS)

For production deployment:

```sql
-- Enable RLS
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Policy: Users see only their department's issues
CREATE POLICY dept_access_policy ON issues
    FOR SELECT
    USING (
        department_id IN (
            SELECT department_id FROM users 
            WHERE id = current_user_id()
        )
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = current_user_id() AND role = 'ADMIN'
        )
    );
```

### 4. Data Encryption

For sensitive columns:

```sql
-- Install pgcrypto extension
CREATE EXTENSION pgcrypto;

-- Encrypt data
UPDATE integrations 
SET credentials = pgp_sym_encrypt(credentials::text, 'encryption_key');

-- Decrypt data
SELECT pgp_sym_decrypt(credentials, 'encryption_key') FROM integrations;
```

### 5. Access Control

**Role Permissions Matrix:**

| Action | ADMIN | HOD | Secretary | Member |
|--------|-------|-----|-----------|--------|
| View all issues | ✅ | Department only | Department only | Assigned only |
| Create issue | ✅ | ✅ | ✅ | ✅ |
| Assign issue | ✅ | ✅ (dept) | ❌ | ❌ |
| Delete issue | ✅ | ❌ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ |
| View audit logs | ✅ | Department only | ❌ | ❌ |
| Run validations | ✅ | ✅ | ✅ | ✅ |
| Export reports | ✅ | ✅ (dept) | ✅ (dept) | ❌ |

---

## Performance Optimization

### 1. Indexes Created

```sql
-- Critical indexes for performance
CREATE INDEX idx_issues_department ON issues(department_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

### 2. Query Optimization Tips

```sql
-- ✅ Use indexes effectively
EXPLAIN ANALYZE
SELECT * FROM issues WHERE department_id = 'xxx';

-- ✅ Limit results
SELECT * FROM issues ORDER BY created_at DESC LIMIT 100;

-- ✅ Use views for complex queries
SELECT * FROM vw_active_issues;

-- ❌ Avoid SELECT *
SELECT id, title, status FROM issues;  -- Better
```

### 3. Partitioning (For large datasets)

```sql
-- Partition audit_logs by month
CREATE TABLE audit_logs_2026_03 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
```

### 4. Regular Maintenance

```bash
# Add to cron job (daily at 2 AM)
0 2 * * * psql -U dqims_admin -d dqims_rra -c "VACUUM ANALYZE;"
```

---

## Backup & Recovery

### 1. Automated Backups

```bash
#!/bin/bash
# backup_dqims.sh

BACKUP_DIR="/var/backups/dqims"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="dqims_backup_$DATE.sql"

# Create backup
pg_dump -U dqims_admin -d dqims_rra -F c -f "$BACKUP_DIR/$FILENAME"

# Compress
gzip "$BACKUP_DIR/$FILENAME"

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completed: $FILENAME.gz"
```

### 2. Restore from Backup

```bash
# Restore compressed backup
gunzip dqims_backup_20260306_020000.sql.gz
pg_restore -U dqims_admin -d dqims_rra -c dqims_backup_20260306_020000.sql
```

### 3. Point-in-Time Recovery

Enable WAL archiving in `postgresql.conf`:

```
wal_level = replica
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/wal_archive/%f'
```

---

## API Integration Guidelines

### 1. Connection String

```javascript
// Node.js with pg library
const { Pool } = require('pg');

const pool = new Pool({
  user: 'dqims_admin',
  host: 'localhost',
  database: 'dqims_rra',
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 20, // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 2. Sample API Functions

```javascript
// Get issues by department
async function getIssuesByDepartment(departmentId) {
  const query = `
    SELECT i.*, ic.category_name, d.dept_name
    FROM issues i
    LEFT JOIN issue_categories ic ON i.category_id = ic.id
    LEFT JOIN departments d ON i.department_id = d.id
    WHERE i.department_id = $1
    ORDER BY i.created_at DESC
  `;
  
  const result = await pool.query(query, [departmentId]);
  return result.rows;
}

// Create new issue
async function createIssue(issueData) {
  const query = `
    INSERT INTO issues (
      issue_number, title, description, severity, priority,
      reported_by, department_id, status
    ) VALUES (
      generate_issue_number(), $1, $2, $3, $4, $5, $6, 'Open'
    ) RETURNING id, issue_number
  `;
  
  const values = [
    issueData.title,
    issueData.description,
    issueData.severity,
    issueData.priority,
    issueData.reportedBy,
    issueData.departmentId
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Log audit entry
async function createAuditLog(logData) {
  const query = `
    INSERT INTO audit_logs (
      user_id, action_type, module_name, entity_type,
      entity_id, action_description, ip_address, action_result
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;
  
  await pool.query(query, [
    logData.userId,
    logData.actionType,
    logData.moduleName,
    logData.entityType,
    logData.entityId,
    logData.description,
    logData.ipAddress,
    'Success'
  ]);
}
```

### 3. Transaction Handling

```javascript
async function assignIssueWithNotification(issueId, userId, assignedBy) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Update issue
    await client.query(
      'UPDATE issues SET assigned_to = $1, status = $2 WHERE id = $3',
      [userId, 'In Progress', issueId]
    );
    
    // Create notification
    await client.query(
      `INSERT INTO notifications (user_id, notification_type, title, message)
       VALUES ($1, $2, $3, $4)`,
      [userId, 'IssueAssigned', 'New Issue Assigned', `Issue ${issueId} assigned to you`]
    );
    
    // Log audit
    await client.query(
      `INSERT INTO audit_logs (user_id, action_type, module_name, entity_id)
       VALUES ($1, $2, $3, $4)`,
      [assignedBy, 'ASSIGN', 'IssueTracking', issueId]
    );
    
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
```

---

## Testing & Validation

### 1. Sample Test Queries

```sql
-- Test 1: Verify all users have valid departments
SELECT u.email, u.department_id, d.dept_name
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
WHERE u.department_id IS NOT NULL AND d.id IS NULL;
-- Should return 0 rows

-- Test 2: Check for orphaned issues
SELECT i.issue_number, i.reported_by
FROM issues i
LEFT JOIN users u ON i.reported_by = u.id
WHERE u.id IS NULL;
-- Should return 0 rows

-- Test 3: Validate SLA calculations
SELECT issue_number, sla_due_date, sla_status,
       calculate_sla_status(id) as calculated_status
FROM issues
WHERE sla_due_date IS NOT NULL;
```

### 2. Data Integrity Checks

```sql
-- Check for duplicate TINs (if applicable)
SELECT tin, COUNT(*)
FROM taxpayers
GROUP BY tin
HAVING COUNT(*) > 1;

-- Verify audit log completeness
SELECT DATE(created_at) as date, COUNT(*) as log_count
FROM audit_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date;
```

---

## Database Maintenance Checklist

### Daily
- [ ] Monitor database size and growth
- [ ] Check for long-running queries
- [ ] Review error logs

### Weekly
- [ ] Run VACUUM ANALYZE
- [ ] Check index usage statistics
- [ ] Review slow query log

### Monthly
- [ ] Full database backup verification
- [ ] Archive old audit logs
- [ ] Review and optimize slow queries
- [ ] Update statistics

### Quarterly
- [ ] Review and update indexes
- [ ] Database performance tuning
- [ ] Capacity planning review

---

## Troubleshooting

### Common Issues

**Issue: Slow query performance**
```sql
-- Check missing indexes
SELECT schemaname, tablename, attname, n_distinct
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND tablename IN ('issues', 'audit_logs');
```

**Issue: Connection pool exhausted**
```javascript
// Increase pool size
const pool = new Pool({
  max: 50, // Increase from 20
  idleTimeoutMillis: 10000
});
```

**Issue: Database disk space full**
```bash
# Clean up old data
DELETE FROM audit_logs WHERE created_at < CURRENT_DATE - INTERVAL '1 year';
VACUUM FULL audit_logs;
```

---

## Contact & Support

For database-related issues during your project presentation:

- **Database Schema**: Refer to `DATABASE_SCHEMA.sql`
- **Sample Queries**: See `COMMON_QUERIES.sql`
- **Sample Data**: Check `SAMPLE_DATA_INSERTS.sql`

---

## Appendix: Quick Reference

### Generate New Issue Number
```sql
SELECT generate_issue_number();
-- Returns: ISS-2026-0001
```

### Get User's Department Issues
```sql
SELECT * FROM vw_active_issues
WHERE department = (SELECT dept_name FROM departments d
                    JOIN users u ON d.id = u.department_id
                    WHERE u.id = 'user-uuid-here');
```

### Export to CSV
```sql
\copy (SELECT * FROM vw_department_performance) TO 'report.csv' CSV HEADER;
```

---

**Document Version**: 1.0  
**Last Updated**: March 6, 2026  
**Author**: DQIMS Development Team - AUCA  
**For**: Rwanda Revenue Authority (RRA)
