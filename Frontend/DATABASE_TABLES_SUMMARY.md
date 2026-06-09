# DQIMS - All Database Tables Summary
## Simple Explanation of All 20 Tables

---

## 📋 **QUICK OVERVIEW**

| # | Table Name | What It Stores | Why We Need It |
|---|------------|----------------|----------------|
| 1 | **departments** | RRA departments (IT, Tax, Customs, etc.) | Group users and issues by department |
| 2 | **users** | All people who use the system | Login, track who does what |
| 3 | **issue_categories** | Types of issues (Data Quality, System Error, etc.) | Classify and organize issues |
| 4 | **issues** | All reported problems/issues | Main table - core of the system |
| 5 | **issue_comments** | Comments and notes on issues | Discussion and updates |
| 6 | **related_issues** | Links between connected issues | Show duplicates, related problems |
| 7 | **issue_history** | Every change made to issues | Track what changed, when, by whom |
| 8 | **data_validation_rules** | Rules to check data quality | Define what to validate |
| 9 | **data_validation_executions** | Record of validation runs | Track when validations were run |
| 10 | **data_validation_failures** | Records that failed validation | Show exactly what's wrong |
| 11 | **root_cause_analysis** | Analysis of why issues happen | Find real causes, prevent future issues |
| 12 | **audit_logs** | Every action in the system | Who did what, when (compliance) |
| 13 | **notifications** | Alerts for users | Tell users about assignments, deadlines |
| 14 | **sla_configurations** | Deadline rules by severity | How long to resolve each type |
| 15 | **reports** | Generated reports and analytics | Store created reports |
| 16 | **dashboard_metrics** | Daily statistics snapshot | Fast dashboard loading |
| 17 | **integrations** | External system connections | Connect to other RRA systems |
| 18 | **integration_logs** | Sync history with external systems | Track integration success/failure |
| 19 | **attachments** | File uploads (PDFs, images, etc.) | Store file information |
| 20 | **system_settings** | System configuration | Global settings (timeouts, email, etc.) |

---

## 📚 **DETAILED EXPLANATIONS**

---

### **TABLE 1: departments**
**What it stores:** List of all RRA departments

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for department | `uuid-123...` |
| dept_code | Short code for department | `IT`, `DT`, `CT` |
| dept_name | Full department name | `Information Technology` |
| description | What the department does | `Manages all IT systems` |
| is_active | Is department still used? | `true` or `false` |
| created_at | When was it created | `2026-01-15 10:30:00` |
| updated_at | Last time it was changed | `2026-02-20 14:00:00` |

**Example Data:**
```
IT - Information Technology
DT - Domestic Tax
CT - Customs & Tax
HR - Human Resources
FINANCE - Finance & Accounting
AUDIT - Internal Audit
```

**Why we need it:** Users belong to departments, issues are tracked by department

---

### **TABLE 2: users**
**What it stores:** All people who can login to DQIMS

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for user | `uuid-456...` |
| employee_id | RRA employee number (PERMANENT) | `EMP001` |
| email | Email address (username) | `jean.paul@rra.gov.rw` |
| password_hash | Encrypted password | `$2b$10$rKzQ8VX4...` (hashed) |
| full_name | Person's full name | `Jean Paul HABIMANA` |
| role | Their permission level | `ADMIN`, `HOD`, `Secretary`, `Member` |
| department_id | Which department they work in | Links to departments table |
| phone | Phone number | `+250788123456` |
| is_active | Can they still login? | `true` or `false` |
| last_login | Last time they logged in | `2026-03-06 09:15:00` |
| created_at | When account was created | `2026-01-10 08:00:00` |
| updated_at | Last time info was changed | `2026-03-01 11:30:00` |

**Example Data:**
```
EMP001 - Jean Paul (ADMIN, IT Department)
EMP002 - Marie Claire (HOD, Domestic Tax)
EMP003 - Patrick (Member, IT Department)
```

**Why we need it:** 
- Know who can login
- Track who creates/updates issues
- Control what each person can see/do based on role

---

### **TABLE 3: issue_categories**
**What it stores:** Different types of issues

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for category | `uuid-789...` |
| category_code | Short code | `DATA_QUALITY`, `SYSTEM_ERROR` |
| category_name | Display name | `Data Quality Issue` |
| description | What this category means | `Issues with data accuracy` |
| severity_level | Default severity | `High`, `Critical` |
| color_code | Color for UI | `#E5BE01` (RRA Orange) |
| is_active | Still in use? | `true` or `false` |
| created_at | When created | `2026-01-05 10:00:00` |
| updated_at | Last changed | `2026-01-05 10:00:00` |

**Example Data:**
```
DATA_QUALITY - Data Quality Issues (High, Orange)
SYSTEM_ERROR - System Errors (Critical, Red)
INTEGRATION - Integration Problems (High, Orange)
SECURITY - Security Issues (Critical, Red)
DUPLICATE - Duplicate Records (Medium, Blue)
VALIDATION - Validation Failures (High, Orange)
```

**Why we need it:** 
- Organize issues into groups
- Quick filtering by type
- Automatic color coding in UI

---

### **TABLE 4: issues** ⭐ **MOST IMPORTANT TABLE**
**What it stores:** Every reported problem/issue

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for issue | `uuid-111...` |
| issue_number | Human-readable number (auto-generated) | `ISS-2026-0001` |
| title | Short description | `Duplicate TIN entries found` |
| description | Full details of problem | `145 taxpayers have duplicate TIN numbers...` |
| category_id | What type of issue | Links to issue_categories |
| severity | How serious is it | `Critical`, `High`, `Medium`, `Low` |
| priority | How urgent is it | `Critical`, `High`, `Medium`, `Low` |
| data_source | Which system has the problem | `Taxpayer Database`, `VAT System` |
| affected_records | How many records affected | `145` |
| data_field | Which field has the problem | `TIN`, `VAT_AMOUNT` |
| reported_by | Who reported it | Links to users table |
| assigned_to | Who is fixing it | Links to users table |
| department_id | Which department owns it | Links to departments table |
| status | Current state | `Open`, `In Progress`, `Resolved`, `Closed` |
| sla_due_date | Deadline to fix | `2026-03-08 18:00:00` |
| sla_status | Deadline status | `On Track`, `At Risk`, `Breached` |
| resolution_notes | How it was fixed | `Ran deduplication script...` |
| resolved_at | When it was fixed | `2026-03-07 15:30:00` |
| resolved_by | Who fixed it | Links to users table |
| is_duplicate | Is this a duplicate issue? | `true` or `false` |
| duplicate_of | Which issue is this duplicate of | Links to another issue |
| attachments | Files uploaded (JSON) | `[{file1.pdf}, {screenshot.png}]` |
| tags | Keywords for searching | `['taxpayer', 'urgent', 'data-quality']` |
| created_at | When reported | `2026-03-05 10:00:00` |
| updated_at | Last change | `2026-03-07 15:30:00` |

**Example Data:**
```
ISS-2026-0001 - Duplicate TIN entries (Critical, In Progress)
ISS-2026-0002 - VAT validation failing (High, Open)
ISS-2026-0003 - Integration timeout (High, Resolved)
```

**Why we need it:** 
- Core of the system
- Track every problem from creation to resolution
- Assign work to team members
- Monitor deadlines

---

### **TABLE 5: issue_comments**
**What it stores:** Comments and discussions on issues

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for comment | `uuid-222...` |
| issue_id | Which issue this is about | Links to issues table |
| user_id | Who wrote the comment | Links to users table |
| comment_text | The actual comment | `I found the root cause. It's the migration script...` |
| is_internal | Is this private (internal only)? | `true` or `false` |
| attachments | Files attached to comment | `[{log_file.txt}]` |
| created_at | When posted | `2026-03-06 11:00:00` |
| updated_at | If edited | `2026-03-06 11:05:00` |

**Example Data:**
```
"Started investigation. Found duplicates from Feb 28 migration."
"HOD: This is high priority. Update by end of day."
"Fixed. Ran cleanup script. 145 records corrected."
```

**Why we need it:** 
- Communication between team members
- Document investigation process
- Keep history of what was tried

---

### **TABLE 6: related_issues**
**What it stores:** Connections between issues

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for relationship | `uuid-333...` |
| issue_id | First issue | Links to issues table |
| related_issue_id | Second issue | Links to issues table |
| relationship_type | How they're related | `Duplicate`, `Related`, `Blocks`, `Caused By` |
| notes | Explanation | `Same root cause - migration error` |
| created_by | Who linked them | Links to users table |
| created_at | When linked | `2026-03-06 12:00:00` |

**Example Data:**
```
ISS-2026-0001 is a DUPLICATE of ISS-2026-0005
ISS-2026-0003 BLOCKS ISS-2026-0007
ISS-2026-0010 is CAUSED BY ISS-2026-0002
```

**Why we need it:** 
- Show duplicate issues
- Track dependencies (one issue blocks another)
- Find patterns (multiple issues from same cause)

---

### **TABLE 7: issue_history**
**What it stores:** Every change made to an issue

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for history entry | `uuid-444...` |
| issue_id | Which issue was changed | Links to issues table |
| changed_by | Who made the change | Links to users table |
| change_type | What kind of change | `StatusChange`, `Assignment`, `Update` |
| field_name | What was changed | `status`, `assigned_to`, `severity` |
| old_value | Value before change | `Open` |
| new_value | Value after change | `In Progress` |
| change_description | Summary | `Status changed from Open to In Progress` |
| created_at | When change happened | `2026-03-06 10:30:00` |

**Example Data:**
```
2026-03-05 10:00 - Issue created by Jean Paul
2026-03-05 14:00 - Status changed: Open → In Progress
2026-03-06 09:00 - Assigned to: Marie Claire
2026-03-07 15:30 - Status changed: In Progress → Resolved
```

**Why we need it:** 
- Complete audit trail
- See who changed what, when
- Undo changes if needed
- Compliance requirement

---

### **TABLE 8: data_validation_rules**
**What it stores:** Rules to check data quality

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for rule | `uuid-555...` |
| rule_code | Short code | `VAL-TIN-001` |
| rule_name | Display name | `TIN Uniqueness Check` |
| description | What it checks | `Ensures no duplicate TIN numbers` |
| data_source | Which system to check | `Taxpayer Database` |
| field_name | Which field to check | `TIN` |
| validation_type | Type of check | `Uniqueness`, `Format`, `Range`, `Completeness` |
| rule_logic | How to check (SQL/logic) | `SELECT TIN, COUNT(*) ... HAVING COUNT(*) > 1` |
| severity | How serious if fails | `Critical`, `High`, `Medium`, `Low` |
| is_active | Still in use? | `true` or `false` |
| created_by | Who created rule | Links to users table |
| created_at | When created | `2026-01-10 09:00:00` |
| updated_at | Last modified | `2026-02-15 11:00:00` |

**Example Data:**
```
VAL-TIN-001 - TIN must be unique (Uniqueness, Critical)
VAL-TIN-002 - TIN must be 9 digits (Format, High)
VAL-VAT-001 - VAT amount in valid range (Range, High)
VAL-ADDR-001 - Address fields not empty (Completeness, Medium)
```

**Why we need it:** 
- Define what "good data" looks like
- Automated quality checks
- Catch problems before they grow
- Reusable rules

---

### **TABLE 9: data_validation_executions**
**What it stores:** Each time a validation rule runs

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for execution | `uuid-666...` |
| execution_number | Human-readable number | `VAL-2026-0001` |
| rule_id | Which rule was run | Links to data_validation_rules |
| executed_by | Who ran it | Links to users table |
| execution_status | Current state | `Running`, `Completed`, `Failed` |
| total_records_checked | How many records checked | `15234` |
| records_passed | How many were OK | `15089` |
| records_failed | How many had problems | `145` |
| pass_rate | Success percentage | `99.05%` |
| started_at | When it started | `2026-03-06 10:00:00` |
| completed_at | When it finished | `2026-03-06 10:00:45` |
| execution_time_seconds | How long it took | `45` seconds |
| error_message | If it failed, why | `Connection timeout` |
| created_at | Timestamp | `2026-03-06 10:00:00` |

**Example Data:**
```
VAL-2026-0001 - TIN Uniqueness (15234 checked, 145 failed, 99.05% pass)
VAL-2026-0002 - VAT Range Check (8934 checked, 523 failed, 94.15% pass)
VAL-2026-0003 - Address Complete (15234 checked, 1247 failed, 91.82% pass)
```

**Why we need it:** 
- Track validation history
- Show data quality trends over time
- Know when problems were detected
- Performance monitoring

---

### **TABLE 10: data_validation_failures**
**What it stores:** Individual records that failed validation

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for failure | `uuid-777...` |
| execution_id | Which validation run | Links to data_validation_executions |
| rule_id | Which rule failed | Links to data_validation_rules |
| record_identifier | Which record failed | `TIN: 123456789` |
| field_name | Which field has problem | `TIN` |
| actual_value | What value it has | `123456789` |
| expected_value | What it should be | `Unique value` |
| failure_reason | Why it failed | `TIN appears 3 times in database` |
| issue_created | Was issue auto-created? | `true` or `false` |
| issue_id | Link to created issue | Links to issues table |
| created_at | When detected | `2026-03-06 10:00:15` |

**Example Data:**
```
TIN 123456789 - Duplicate (appears 3 times)
TIN ABC123456 - Invalid format (contains letters)
VAT Amount 999999999999 - Out of range (too large)
Address NULL - Missing required field
```

**Why we need it:** 
- See exactly which records have problems
- Auto-create issues for failures
- Fix specific records
- Evidence for reports

---

### **TABLE 11: root_cause_analysis**
**What it stores:** Analysis of why issues happen

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for analysis | `uuid-888...` |
| issue_id | Which issue analyzed | Links to issues table |
| analysis_method | Which method used | `5 Whys`, `Fishbone` |
| why_1 to why_5 | Five "why" questions | `Why duplicates? No validation in script...` |
| root_cause | Real underlying cause | `Inadequate migration planning` |
| people_factors | Human-related causes | `Staff not trained on new process` |
| process_factors | Process-related causes | `No validation step in migration` |
| technology_factors | Tech-related causes | `Old script doesn't check duplicates` |
| environment_factors | Environment causes | `Rushed timeline, no testing` |
| material_factors | Data/material causes | `Source data already had duplicates` |
| measurement_factors | Measurement causes | `No quality metrics defined` |
| corrective_actions | How to fix now | `Run cleanup script, notify departments` |
| preventive_actions | How to prevent future | `Add validation to all migrations` |
| analyzed_by | Who did the analysis | Links to users table |
| analyzed_at | When analyzed | `2026-03-07 14:00:00` |
| reviewed_by | Who approved it | Links to users table (HOD/ADMIN) |
| reviewed_at | When approved | `2026-03-08 09:00:00` |
| status | Current state | `Draft`, `Pending Review`, `Approved` |
| created_at | When created | `2026-03-07 14:00:00` |
| updated_at | Last modified | `2026-03-08 09:00:00` |

**Example Data:**
```
Issue ISS-2026-0001:
- Method: 5 Whys
- Root Cause: Inadequate migration planning
- Corrective: Run deduplication script
- Preventive: Add validation checkpoints to migrations
- Status: Approved
```

**Why we need it:** 
- Find real causes, not just symptoms
- Prevent same problems in future
- Learn and improve processes
- Required for critical issues

---

### **TABLE 12: audit_logs** ⭐ **COMPLIANCE REQUIREMENT**
**What it stores:** Every action in the system

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for log entry | `uuid-999...` |
| user_id | Who did the action | Links to users table |
| action_type | What kind of action | `CREATE`, `UPDATE`, `DELETE`, `VIEW`, `LOGIN`, `EXPORT` |
| module_name | Which part of system | `IssueReporting`, `UserManagement`, `Dashboard` |
| entity_type | What was affected | `Issue`, `User`, `ValidationRule` |
| entity_id | Specific item affected | `uuid of the issue/user/etc` |
| action_description | What happened | `Created new issue ISS-2026-0001` |
| old_values | Before (JSON) | `{"status": "Open"}` |
| new_values | After (JSON) | `{"status": "In Progress"}` |
| ip_address | User's IP address | `192.168.1.100` |
| user_agent | Browser/device info | `Chrome 98.0 on Windows 10` |
| session_id | Login session | `sess_abc123...` |
| action_result | Success or fail | `Success`, `Failed`, `Partial` |
| error_message | If failed, why | `Permission denied` |
| created_at | Exact timestamp | `2026-03-06 10:30:15.123` |

**Example Data:**
```
2026-03-06 08:15:00 - Jean Paul logged in (Success, IP: 192.168.1.100)
2026-03-06 10:30:00 - Jean Paul created issue ISS-2026-0001 (Success)
2026-03-06 11:00:00 - Marie Claire assigned issue to Patrick (Success)
2026-03-06 14:00:00 - Patrick updated status to Resolved (Success)
2026-03-06 15:00:00 - Jean Paul exported report (Success)
```

**Why we need it:** 
- Regulatory compliance (RRA requirement)
- Security monitoring (detect suspicious activity)
- Troubleshooting (what happened before error)
- Accountability (who did what)
- Cannot be deleted or modified

---

### **TABLE 13: notifications**
**What it stores:** Alerts and messages for users

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for notification | `uuid-aaa...` |
| user_id | Who receives it | Links to users table |
| notification_type | What kind of alert | `IssueAssigned`, `SLAWarning`, `IssueUpdated`, `ValidationComplete` |
| title | Short heading | `New Issue Assigned` |
| message | Full message | `You have been assigned issue ISS-2026-0001` |
| related_entity_type | What it's about | `Issue`, `Validation`, `Report` |
| related_entity_id | Specific item | `uuid of the issue/validation/etc` |
| priority | How urgent | `Low`, `Medium`, `High` |
| is_read | Has user seen it? | `true` or `false` |
| read_at | When they read it | `2026-03-06 11:30:00` |
| created_at | When sent | `2026-03-06 11:00:00` |

**Example Data:**
```
Jean Paul:
  - "New Issue Assigned: ISS-2026-0001" (Unread, High)
  - "SLA At Risk: ISS-2026-0003" (Read, High)
  - "Validation Complete: 99.05% pass rate" (Read, Low)

Marie Claire:
  - "Issue Resolved: ISS-2026-0002" (Unread, Medium)
```

**Why we need it:** 
- Tell users about assignments immediately
- Warn about approaching deadlines
- Keep team informed
- Reduce email overload
- Badge count in UI (red dot with number)

---

### **TABLE 14: sla_configurations**
**What it stores:** Deadline rules for different issue types

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for SLA rule | `uuid-bbb...` |
| sla_name | Rule name | `Critical Issues SLA` |
| severity | Which severity level | `Critical`, `High`, `Medium`, `Low` |
| priority | Which priority level | `Critical`, `High`, `Medium`, `Low` |
| category_id | Which category (optional) | Links to issue_categories |
| department_id | Which dept (optional) | Links to departments |
| response_time_hours | Hours to start working | `2` hours |
| resolution_time_hours | Hours to fix completely | `24` hours |
| warning_threshold_hours | When to show "At Risk" | `20` hours (before deadline) |
| use_business_hours_only | Count only work hours? | `true` or `false` |
| is_active | Still in use? | `true` or `false` |
| created_at | When created | `2026-01-05 10:00:00` |
| updated_at | Last modified | `2026-02-10 11:00:00` |

**Example Data:**
```
Critical Issues: Resolve in 24 hours, warn at 20 hours
High Priority: Resolve in 48 hours, warn at 40 hours
Medium Priority: Resolve in 120 hours (5 days), warn at 96 hours
Low Priority: Resolve in 240 hours (10 days), warn at 192 hours
```

**Why we need it:** 
- Automatic deadline calculation
- Warn before deadlines
- Track SLA compliance
- Different rules for different severity
- Management KPIs

---

### **TABLE 15: reports**
**What it stores:** Generated reports and analytics

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID for report | `uuid-ccc...` |
| report_number | Human-readable number | `REP-2026-0001` |
| report_name | Title of report | `February Department Performance` |
| report_type | What kind of report | `Issue Summary`, `SLA Compliance`, `Data Quality Trends` |
| description | What it shows | `Monthly performance for all departments` |
| parameters | Filters used (JSON) | `{"month": "Feb", "year": 2026, "dept": "all"}` |
| generated_by | Who created it | Links to users table |
| generated_at | When created | `2026-03-01 09:00:00` |
| report_data | Actual data (JSON) | `{charts, tables, statistics}` |
| file_url | Link to file if exported | `/reports/rep-2026-0001.pdf` |
| file_format | Export format | `PDF`, `Excel`, `CSV` |
| department_id | Dept-specific report? | Links to departments (NULL for all) |
| is_public | Can everyone see it? | `true` or `false` |
| created_at | Timestamp | `2026-03-01 09:00:00` |

**Example Data:**
```
REP-2026-0001 - Department Performance (Feb 2026, Excel)
REP-2026-0002 - SLA Compliance Report (Q1 2026, PDF)
REP-2026-0003 - Data Quality Trends (Jan-Mar 2026, PDF)
```

**Why we need it:** 
- Store generated reports
- Reuse reports (don't regenerate)
- Track what reports were created
- Share with management
- Archive historical data

---

### **TABLE 16: dashboard_metrics**
**What it stores:** Pre-calculated statistics for fast dashboard loading

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID | `uuid-ddd...` |
| metric_date | Which day's data | `2026-03-06` |
| department_id | Which dept (NULL for all) | Links to departments |
| total_issues | Total issue count | `150` |
| open_issues | Currently open | `45` |
| in_progress_issues | Being worked on | `38` |
| resolved_issues | Fixed but not closed | `12` |
| closed_issues | Completely done | `55` |
| sla_on_track | Meeting deadlines | `70` |
| sla_at_risk | Close to deadline | `15` |
| sla_breached | Past deadline | `10` |
| critical_issues | Critical severity | `8` |
| high_issues | High severity | `25` |
| medium_issues | Medium severity | `42` |
| low_issues | Low severity | `75` |
| validation_pass_rate | Data quality % | `96.5%` |
| total_validations_run | Validations today | `12` |
| active_users | Users who logged in | `45` |
| new_users | New accounts created | `2` |
| created_at | When calculated | `2026-03-07 00:00:00` (midnight) |

**Example Data:**
```
2026-03-06 (IT Department):
  - Total: 50, Open: 15, In Progress: 20, Resolved: 10, Closed: 5
  - SLA: 35 on track, 10 at risk, 5 breached
  - Validation Pass Rate: 98.2%

2026-03-06 (Domestic Tax):
  - Total: 75, Open: 20, In Progress: 30, Resolved: 15, Closed: 10
  - SLA: 50 on track, 15 at risk, 10 breached
  - Validation Pass Rate: 94.5%
```

**Why we need it:** 
- Dashboard loads instantly (no complex queries)
- Historical trends (compare today vs last week)
- Calculated once per day (at midnight)
- Reduces database load

---

### **TABLE 17: integrations**
**What it stores:** Connections to external RRA systems

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID | `uuid-eee...` |
| integration_name | System name | `Customs Data Sync` |
| integration_type | Type of connection | `API`, `Database`, `LDAP`, `File` |
| description | What it does | `Syncs customs import data with tax system` |
| endpoint_url | Where to connect | `https://customs.rra.gov.rw/api/v1/sync` |
| auth_type | How to authenticate | `API_KEY`, `OAuth`, `Basic Auth` |
| credentials | Login info (JSON, encrypted) | `{"api_key": "encrypted..."}` |
| config_parameters | Settings (JSON) | `{"batch_size": 1000, "timeout": 30}` |
| sync_frequency | How often to sync | `Real-time`, `Hourly`, `Daily` |
| last_sync_at | When it last ran | `2026-03-06 10:00:00` |
| next_sync_at | When it will run next | `2026-03-06 11:00:00` |
| is_active | Currently enabled? | `true` or `false` |
| status | Current state | `Active`, `Inactive`, `Error`, `Testing` |
| last_error | If failed, why | `Connection timeout after 30 seconds` |
| created_by | Who set it up | Links to users table |
| created_at | When configured | `2026-01-15 10:00:00` |
| updated_at | Last modified | `2026-03-01 14:00:00` |

**Example Data:**
```
Customs Data Sync (API, Active, Syncs hourly)
Bank Payment Gateway (API, Active, Real-time)
LDAP Active Directory (LDAP, Active, User auth)
Legacy Tax Database (Database, Inactive, Deprecated)
```

**Why we need it:** 
- Connect to other RRA systems
- Automatic data synchronization
- Monitor connection health
- Centralized integration management

---

### **TABLE 18: integration_logs**
**What it stores:** History of integration sync activities

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID | `uuid-fff...` |
| integration_id | Which integration | Links to integrations table |
| sync_status | Result | `Started`, `Success`, `Failed`, `Partial` |
| started_at | When sync began | `2026-03-06 10:00:00` |
| completed_at | When sync finished | `2026-03-06 10:02:30` |
| records_processed | Total records handled | `1500` |
| records_success | Successfully synced | `1450` |
| records_failed | Failed to sync | `50` |
| error_message | If failed, details | `Network timeout on batch 5 of 10` |
| sync_details | Extra info (JSON) | `{"batches": 10, "avg_time_per_batch": "15s"}` |
| created_at | Timestamp | `2026-03-06 10:00:00` |

**Example Data:**
```
2026-03-06 10:00 - Customs Sync (Success, 1500 records, 0 errors)
2026-03-06 09:00 - Payment Gateway (Success, 234 records, 0 errors)
2026-03-06 08:00 - Customs Sync (Failed, Connection timeout)
```

**Why we need it:** 
- Track sync success/failure
- Troubleshoot integration problems
- Performance monitoring
- Audit trail for data imports

---

### **TABLE 19: attachments**
**What it stores:** Metadata for uploaded files

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID | `uuid-ggg...` |
| entity_type | What the file is attached to | `Issue`, `Comment`, `RCA`, `Report` |
| entity_id | Specific item | `uuid of issue/comment/etc` |
| file_name | Original file name | `screenshot.png` |
| file_type | File format | `image/png`, `application/pdf` |
| file_size | Size in bytes | `245678` (245 KB) |
| file_path | Where file is stored | `/uploads/2026/03/06/abc123.png` |
| uploaded_by | Who uploaded it | Links to users table |
| created_at | When uploaded | `2026-03-06 11:00:00` |

**Example Data:**
```
Issue ISS-2026-0001:
  - screenshot_error.png (245 KB)
  - database_log.txt (12 KB)
  - duplicate_tins.xlsx (89 KB)
```

**Why we need it:** 
- Track uploaded files
- Link files to issues/comments
- File size monitoring
- Storage management
- Who uploaded what, when

---

### **TABLE 20: system_settings**
**What it stores:** Global system configuration

| Column Name | What It Means | Example |
|-------------|---------------|---------|
| id | Unique ID | `uuid-hhh...` |
| setting_key | Setting name | `session_timeout_minutes` |
| setting_value | Current value | `30` |
| setting_type | Data type | `String`, `Number`, `Boolean`, `JSON` |
| description | What it controls | `How long user stays logged in` |
| category | Grouping | `Security`, `Email`, `General`, `Notifications` |
| is_editable | Can ADMIN change it? | `true` or `false` |
| updated_by | Who last changed it | Links to users table |
| created_at | When created | `2026-01-01 10:00:00` |
| updated_at | Last modified | `2026-03-01 14:00:00` |

**Example Data:**
```
Security:
  - session_timeout_minutes = 30
  - password_min_length = 8
  - password_require_special = true

Email:
  - email_server = smtp.gmail.com
  - email_port = 587
  - notifications_enabled = true

General:
  - system_name = "DQIMS"
  - system_version = "1.0.0"
  - maintenance_mode = false
```

**Why we need it:** 
- Centralized configuration
- Change settings without code changes
- ADMIN can customize system
- Default values for new installs

---

## 🔗 **HOW TABLES CONNECT**

### **Main Relationships:**

```
departments (1) → (many) users
   ↓
users (1) → (many) issues (reported_by)
users (1) → (many) issues (assigned_to)
users (1) → (many) issues (resolved_by)
   ↓
issues (1) → (many) issue_comments
issues (1) → (many) related_issues
issues (1) → (1) root_cause_analysis
   ↓
issue_categories (1) → (many) issues

data_validation_rules (1) → (many) data_validation_executions
   ↓
data_validation_executions (1) → (many) data_validation_failures
   ↓
data_validation_failures (many) → (1) issues (auto-created)

users (1) → (many) audit_logs
users (1) → (many) notifications

integrations (1) → (many) integration_logs

Everything can have → attachments (files)
```

---

## 📊 **TABLE PRIORITIES**

### **Phase 1 - Core System (Start Here):**
1. ✅ departments
2. ✅ users
3. ✅ issue_categories
4. ✅ issues
5. ✅ issue_comments
6. ✅ notifications

### **Phase 2 - Data Validation:**
7. ✅ data_validation_rules
8. ✅ data_validation_executions
9. ✅ data_validation_failures

### **Phase 3 - Analysis & Compliance:**
10. ✅ root_cause_analysis
11. ✅ audit_logs
12. ✅ issue_history

### **Phase 4 - Advanced Features:**
13. ✅ related_issues
14. ✅ sla_configurations
15. ✅ reports
16. ✅ dashboard_metrics
17. ✅ integrations
18. ✅ integration_logs
19. ✅ attachments
20. ✅ system_settings

---

## 💡 **QUICK SUMMARY**

| Category | Tables | Purpose |
|----------|--------|---------|
| **Core System** | departments, users, issue_categories, issues, issue_comments | Basic functionality - create/track issues |
| **Data Quality** | data_validation_rules, executions, failures | Automated data checks |
| **Analysis** | root_cause_analysis, related_issues | Find causes, link issues |
| **Compliance** | audit_logs, issue_history | Track everything for regulations |
| **User Experience** | notifications, dashboard_metrics | Keep users informed, fast UI |
| **Configuration** | sla_configurations, system_settings | System rules and settings |
| **Reporting** | reports | Generate analytics |
| **Integration** | integrations, integration_logs | Connect external systems |
| **Storage** | attachments | File management |

---

## 🎯 **FOR YOUR DEFENSE**

### **Simple Explanation:**

**"I have 20 tables in my database:"**

1. **6 Core tables** - Store users, departments, and issues (the main data)
2. **3 Validation tables** - Check data quality automatically
3. **3 Analysis tables** - Find root causes and track relationships
4. **2 Compliance tables** - Audit logs for RRA regulations
5. **6 Supporting tables** - Notifications, reports, settings, integrations

**"They work together to:"**
- Track every data quality issue from creation to resolution
- Show who did what, when (audit trail)
- Automatically validate data and create issues
- Send notifications to keep everyone informed
- Generate reports for management

---

**Total: 20 Tables, ~15 GB storage capacity, supports 100+ users**

---

**Document Version:** 1.0  
**Created:** March 6, 2026  
**For:** DQIMS Final Year Project - AUCA
