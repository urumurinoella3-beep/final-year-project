# DQIMS - Entity Relationship Diagram

## Complete Database Schema Visualization

---

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DQIMS DATABASE SCHEMA                                    │
│                   Rwanda Revenue Authority (RRA)                                 │
└─────────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────┐
│   departments        │
├──────────────────────┤
│ PK id (UUID)         │
│ UK dept_code         │
│    dept_name         │
│    description       │
│    is_active         │
│    created_at        │
│    updated_at        │
└──────────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────────┐         ┌──────────────────────┐
│   users              │────────→│   issue_categories   │
├──────────────────────┤         ├──────────────────────┤
│ PK id (UUID)         │         │ PK id (UUID)         │
│ UK employee_id       │         │ UK category_code     │
│ UK email             │         │    category_name     │
│    password_hash     │         │    description       │
│    full_name         │         │    severity_level    │
│    role              │         │    color_code        │
│ FK department_id ────┘         │    is_active         │
│    phone             │         │    created_at        │
│    is_active         │         │    updated_at        │
│    last_login        │         └──────────────────────┘
│    created_at        │                   │
│    updated_at        │                   │ 1:N
└──────────────────────┘                   ↓
         │                        ┌──────────────────────┐
         │ 1:N                    │   issues             │
         ↓                        ├──────────────────────┤
┌──────────────────────┐         │ PK id (UUID)         │
│   issues             │         │ UK issue_number      │
├──────────────────────┤         │    title             │
│ PK id (UUID)         │         │    description       │
│ UK issue_number      │         │ FK category_id ──────┘
│    title             │         │    severity          │
│    description       │         │    priority          │
│ FK category_id       │         │    data_source       │
│    severity          │         │    affected_records  │
│    priority          │         │    data_field        │
│    data_source       │         │ FK reported_by ──────┐
│    affected_records  │         │ FK assigned_to ──────┤ Users
│    data_field        │         │ FK department_id ────┤
│ FK reported_by ──────┐         │    status            │
│ FK assigned_to ──────┤         │    sla_due_date      │
│ FK department_id ────┤         │    sla_status        │
│    status            │         │    resolution_notes  │
│    sla_due_date      │         │    resolved_at       │
│    sla_status        │         │ FK resolved_by ──────┤
│    resolution_notes  │         │    is_duplicate      │
│    resolved_at       │         │ FK duplicate_of ─────┤ Issues (self)
│ FK resolved_by       │         │    attachments       │
│    is_duplicate      │         │    tags              │
│ FK duplicate_of ─────┤         │    created_at        │
│    attachments       │         │    updated_at        │
│    tags              │         └──────────────────────┘
│    created_at        │                   │
│    updated_at        │                   │
└──────────────────────┘                   │
         │                                 │
         │ 1:N                            │ 1:N
         ↓                                 ↓
┌──────────────────────┐         ┌──────────────────────┐
│   issue_comments     │         │   related_issues     │
├──────────────────────┤         ├──────────────────────┤
│ PK id (UUID)         │         │ PK id (UUID)         │
│ FK issue_id ─────────┘         │ FK issue_id ─────────┘
│ FK user_id           │         │ FK related_issue_id  │
│    comment_text      │         │    relationship_type │
│    is_internal       │         │    notes             │
│    attachments       │         │ FK created_by        │
│    created_at        │         │    created_at        │
│    updated_at        │         └──────────────────────┘
└──────────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────────┐         ┌──────────────────────┐
│   root_cause_        │         │   issue_history      │
│   analysis           │         ├──────────────────────┤
├──────────────────────┤         │ PK id (UUID)         │
│ PK id (UUID)         │         │ FK issue_id ─────────┘
│ FK issue_id ─────────┘         │ FK changed_by        │
│    analysis_method   │         │    change_type       │
│    why_1..why_5      │         │    field_name        │
│    root_cause        │         │    old_value         │
│    people_factors    │         │    new_value         │
│    process_factors   │         │    change_description│
│    technology_factors│         │    created_at        │
│    environment_...   │         └──────────────────────┘
│    material_factors  │
│    measurement_...   │
│    corrective_actions│
│    preventive_actions│
│ FK analyzed_by       │
│    analyzed_at       │
│ FK reviewed_by       │
│    reviewed_at       │
│    status            │
│    created_at        │
│    updated_at        │
└──────────────────────┘


┌──────────────────────┐
│   data_validation_   │
│   rules              │
├──────────────────────┤
│ PK id (UUID)         │
│ UK rule_code         │
│    rule_name         │
│    description       │
│    data_source       │
│    field_name        │
│    validation_type   │
│    rule_logic        │
│    severity          │
│    is_active         │
│ FK created_by        │
│    created_at        │
│    updated_at        │
└──────────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────────┐
│   data_validation_   │
│   executions         │
├──────────────────────┤
│ PK id (UUID)         │
│ UK execution_number  │
│ FK rule_id ──────────┘
│ FK executed_by       │
│    execution_status  │
│    total_records_... │
│    records_passed    │
│    records_failed    │
│    pass_rate         │
│    started_at        │
│    completed_at      │
│    execution_time_...│
│    error_message     │
│    created_at        │
└──────────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────────┐
│   data_validation_   │
│   failures           │
├──────────────────────┤
│ PK id (UUID)         │
│ FK execution_id ─────┘
│ FK rule_id           │
│    record_identifier │
│    field_name        │
│    actual_value      │
│    expected_value    │
│    failure_reason    │
│    issue_created     │
│ FK issue_id          │
│    created_at        │
└──────────────────────┘


┌──────────────────────┐
│   audit_logs         │
├──────────────────────┤
│ PK id (UUID)         │
│ FK user_id           │
│    action_type       │
│    module_name       │
│    entity_type       │
│    entity_id         │
│    action_description│
│    old_values (JSONB)│
│    new_values (JSONB)│
│    ip_address        │
│    user_agent        │
│    session_id        │
│    action_result     │
│    created_at        │
└──────────────────────┘


┌──────────────────────┐
│   notifications      │
├──────────────────────┤
│ PK id (UUID)         │
│ FK user_id ──────────┘
│    notification_type │
│    title             │
│    message           │
│    related_entity_...│
│    related_entity_id │
│    priority          │
│    is_read           │
│    read_at           │
│    created_at        │
└──────────────────────┘


┌──────────────────────┐
│   sla_configurations │
├──────────────────────┤
│ PK id (UUID)         │
│    sla_name          │
│    severity          │
│    priority          │
│ FK category_id       │
│ FK department_id     │
│    response_time_hrs │
│    resolution_time_..│
│    warning_threshold_│
│    use_business_hrs  │
│    is_active         │
│    created_at        │
│    updated_at        │
└──────────────────────┘


┌──────────────────────┐
│   reports            │
├──────────────────────┤
│ PK id (UUID)         │
│ UK report_number     │
│    report_name       │
│    report_type       │
│    description       │
│    parameters (JSONB)│
│ FK generated_by      │
│    generated_at      │
│    report_data (JSONB│
│    file_url          │
│    file_format       │
│ FK department_id     │
│    is_public         │
│    created_at        │
└──────────────────────┘


┌──────────────────────┐
│   dashboard_metrics  │
├──────────────────────┤
│ PK id (UUID)         │
│    metric_date       │
│ FK department_id     │
│    total_issues      │
│    open_issues       │
│    in_progress_issues│
│    resolved_issues   │
│    closed_issues     │
│    sla_on_track      │
│    sla_at_risk       │
│    sla_breached      │
│    critical_issues   │
│    high_issues       │
│    medium_issues     │
│    low_issues        │
│    validation_pass_..│
│    total_validations_│
│    active_users      │
│    new_users         │
│    created_at        │
└──────────────────────┘


┌──────────────────────┐
│   integrations       │
├──────────────────────┤
│ PK id (UUID)         │
│    integration_name  │
│    integration_type  │
│    description       │
│    endpoint_url      │
│    auth_type         │
│    credentials (JSONB│
│    config_parameters │
│    sync_frequency    │
│    last_sync_at      │
│    next_sync_at      │
│    is_active         │
│    status            │
│    last_error        │
│ FK created_by        │
│    created_at        │
│    updated_at        │
└──────────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────────┐
│   integration_logs   │
├──────────────────────┤
│ PK id (UUID)         │
│ FK integration_id ───┘
│    sync_status       │
│    started_at        │
│    completed_at      │
│    records_processed │
│    records_success   │
│    records_failed    │
│    error_message     │
│    sync_details (JSONB
│    created_at        │
└──────────────────────┘


┌──────────────────────┐
│   attachments        │
├──────────────────────┤
│ PK id (UUID)         │
│    entity_type       │
│    entity_id         │
│    file_name         │
│    file_type         │
│    file_size         │
│    file_path         │
│ FK uploaded_by       │
│    created_at        │
└──────────────────────┘


┌──────────────────────┐
│   system_settings    │
├──────────────────────┤
│ PK id (UUID)         │
│ UK setting_key       │
│    setting_value     │
│    setting_type      │
│    description       │
│    category          │
│    is_editable       │
│ FK updated_by        │
│    created_at        │
│    updated_at        │
└──────────────────────┘
```

---

## Relationship Legend

```
PK = Primary Key
FK = Foreign Key
UK = Unique Key

Cardinality:
1:1  = One-to-One
1:N  = One-to-Many
N:M  = Many-to-Many

Arrows indicate FK direction:
parent ──→ child
```

---

## Core Relationships Summary

### 1. Department → Users (1:N)
- One department has many users
- Each user belongs to one department

### 2. Users → Issues (Multiple Relationships)
- **reported_by**: User who reported the issue (1:N)
- **assigned_to**: User assigned to resolve (1:N)
- **resolved_by**: User who resolved (1:N)

### 3. Issues → Issue Comments (1:N)
- One issue has many comments
- Each comment belongs to one issue

### 4. Issues → Related Issues (N:M via junction)
- Issues can be related to multiple issues
- Self-referential relationship

### 5. Issues → Root Cause Analysis (1:1 or 1:N)
- One issue can have one or more RCA records

### 6. Data Validation Rules → Executions (1:N)
- One rule can have many execution records

### 7. Data Validation Executions → Failures (1:N)
- One execution can identify many failures

### 8. Data Validation Failures → Issues (N:1)
- Multiple failures can create one issue

---

## Data Flow Diagrams

### Issue Lifecycle Flow

```
┌─────────────┐
│   User      │ Creates issue
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Issue     │ Status: Open
└──────┬──────┘
       │
       ↓ Assigned to user
┌─────────────┐
│   Issue     │ Status: In Progress
└──────┬──────┘
       │
       ↓ Add comments, RCA
┌─────────────┐
│   Issue     │ Status: Resolved
└──────┬──────┘
       │
       ↓ HOD/Admin approval
┌─────────────┐
│   Issue     │ Status: Closed
└─────────────┘
```

### Data Validation Flow

```
┌──────────────────┐
│ Validation Rule  │
└────────┬─────────┘
         │
         ↓ Execute
┌──────────────────┐
│   Execution      │ Status: Running
└────────┬─────────┘
         │
         ↓ Check records
┌──────────────────┐
│   Execution      │ Status: Completed
└────────┬─────────┘
         │
         ↓ If failures found
┌──────────────────┐
│   Failures       │ Store failed records
└────────┬─────────┘
         │
         ↓ Auto-create
┌──────────────────┐
│   Issues         │ Status: Open
└──────────────────┘
```

---

## Table Dependency Levels

### Level 1 (No Dependencies)
These tables can be created first:
- `departments`

### Level 2 (Depends on Level 1)
- `users` (depends on departments)
- `issue_categories`
- `system_settings`

### Level 3 (Depends on Level 2)
- `issues` (depends on users, departments, issue_categories)
- `data_validation_rules` (depends on users)
- `sla_configurations` (depends on departments, issue_categories)
- `integrations` (depends on users)

### Level 4 (Depends on Level 3)
- `issue_comments` (depends on issues, users)
- `related_issues` (depends on issues)
- `root_cause_analysis` (depends on issues, users)
- `issue_history` (depends on issues, users)
- `data_validation_executions` (depends on data_validation_rules, users)
- `reports` (depends on users, departments)
- `notifications` (depends on users)
- `audit_logs` (depends on users)
- `integration_logs` (depends on integrations)

### Level 5 (Depends on Level 4)
- `data_validation_failures` (depends on data_validation_executions, issues)
- `attachments` (depends on various entities)

---

## Index Strategy

### Primary Indexes (Automatic)
All `id` columns have primary key indexes

### Foreign Key Indexes
```sql
-- User-related
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_role ON users(role);

-- Issue-related
CREATE INDEX idx_issues_department ON issues(department_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX idx_issues_reported_by ON issues(reported_by);

-- Performance indexes
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

### Composite Indexes
```sql
-- For dashboard queries
CREATE INDEX idx_issues_dept_status ON issues(department_id, status);
CREATE INDEX idx_issues_dept_severity ON issues(department_id, severity);

-- For SLA monitoring
CREATE INDEX idx_issues_sla ON issues(sla_status, sla_due_date) 
WHERE status NOT IN ('Closed', 'Rejected');
```

---

## Database Views (Prebuilt Queries)

### 1. vw_active_issues
Combines issues with related entity names for easy querying

### 2. vw_department_performance
Aggregates department metrics

### 3. vw_validation_summary
Summarizes validation rule execution results

### 4. vw_user_activity
Shows user activity statistics

---

## Constraints Summary

### Check Constraints

```sql
-- User roles
role IN ('ADMIN', 'HOD', 'Secretary', 'Member')

-- Issue severity
severity IN ('Low', 'Medium', 'High', 'Critical')

-- Issue status
status IN ('Open', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Rejected')

-- SLA status
sla_status IN ('On Track', 'At Risk', 'Breached')
```

### Unique Constraints

```sql
-- Unique identifiers
departments.dept_code
users.employee_id
users.email
issues.issue_number
data_validation_rules.rule_code
```

---

## Sample ERD Visualization Tools

To create visual diagrams from this schema:

### 1. Using pgAdmin (PostgreSQL)
- Connect to database
- Right-click on database → Generate ERD

### 2. Using DBeaver
- Right-click on database → ER Diagram

### 3. Using draw.io
Import the schema and manually create diagram

### 4. Using dbdiagram.io
```
// Paste simplified schema
Table departments {
  id uuid [pk]
  dept_code varchar [unique]
  dept_name varchar
}

Table users {
  id uuid [pk]
  employee_id varchar [unique]
  department_id uuid [ref: > departments.id]
  role varchar
}

Table issues {
  id uuid [pk]
  issue_number varchar [unique]
  department_id uuid [ref: > departments.id]
  reported_by uuid [ref: > users.id]
  assigned_to uuid [ref: > users.id]
}
```

---

## Database Statistics

### Estimated Row Counts (Production)

| Table | Estimated Rows/Year |
|-------|---------------------|
| users | 100-200 |
| departments | 10-20 |
| issues | 5,000-10,000 |
| issue_comments | 15,000-30,000 |
| data_validation_executions | 10,000-20,000 |
| data_validation_failures | 50,000-100,000 |
| audit_logs | 100,000-500,000 |
| notifications | 20,000-50,000 |

### Storage Estimates

- **Year 1**: ~500 MB - 1 GB
- **Year 2**: ~1 GB - 2 GB
- **Year 3**: ~2 GB - 4 GB

**Recommendation**: Plan for 10 GB initial storage with auto-scaling

---

## For Your Presentation

When explaining the database to your defense committee:

1. **Start with Core Tables**: departments → users → issues
2. **Show Relationships**: How data flows through the system
3. **Highlight RBA**: How department_id filters data by role
4. **Demonstrate Audit Trail**: How every action is logged
5. **Show Data Quality**: Validation rules → Executions → Failures → Issues

---

**Document Version**: 1.0  
**Created**: March 6, 2026  
**For**: DQIMS Final Year Project Defense - AUCA  
**Rwanda Revenue Authority (RRA)**
