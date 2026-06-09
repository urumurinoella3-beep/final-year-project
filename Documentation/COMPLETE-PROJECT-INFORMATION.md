# CHAPTER 3: REQUIREMENTS ANALYSIS AND DESIGN OF THE NEW SYSTEM
## Data Quality Issues Management System (DQIMS)

---

## 📋 COMPLETE PROJECT INFORMATION FOR AI ASSISTANCE

This document contains ALL information about the DQIMS project that you can provide to another AI to help you write your thesis Chapter 3.

---

## 🎯 PROJECT OVERVIEW

### Project Name
**Data Quality Issues Management System (DQIMS)**

### Organization
**Rwanda Revenue Authority (RRA)**

### Project Type
Internal Web-Based Data Quality Management System

### Purpose
To replace manual data quality issue management processes (hand-written letters, verbal reports, meetings) with an automated, centralized, web-based system that enables efficient issue reporting, tracking, assignment, and resolution.

---

## 👥 SYSTEM USERS (3 ROLES)

### 1. System Administrator (ADMIN)
- **Count:** 1-2 users
- **Responsibilities:**
  - Full system oversight
  - Create and manage all user accounts
  - Assign permanent Employee IDs
  - Manage departments
  - View all issues across all departments (read-only)
  - Add comments to any issue for guidance
  - Generate system-wide reports
  - View audit logs
  - System configuration

- **Permissions:**
  - ✅ Create users (with permanent Employee ID + email + role + department)
  - ✅ Auto-generate temporary passwords
  - ✅ Send welcome emails with credentials
  - ✅ View all issues (cannot assign or change status)
  - ✅ Comment on any issue
  - ✅ Generate all reports
  - ✅ View audit logs
  - ❌ Cannot assign issues
  - ❌ Cannot change issue status or priority

### 2. Head of Department (HOD)
- **Count:** 5-10 users (one per department)
- **Responsibilities:**
  - Manage department-specific issues
  - Assign issues to department staff
  - Change issue priority
  - Review and approve issue resolutions
  - Close or reopen issues
  - Generate department reports
  - Monitor department performance

- **Permissions:**
  - ✅ View department issues only
  - ✅ Report new issues
  - ✅ Assign issues to staff
  - ✅ Change issue priority
  - ✅ Change issue status (all transitions)
  - ✅ Close issues (RESOLVED → CLOSED)
  - ✅ Reopen issues (CLOSED → IN_PROGRESS)
  - ✅ Add comments
  - ✅ Upload/download attachments
  - ✅ Generate department reports
  - ❌ Cannot see other departments' issues

### 3. Staff Member (STAFF)
- **Count:** 50-100 users
- **Responsibilities:**
  - Report new data quality issues
  - Work on assigned issues
  - Update issue status
  - Add progress comments
  - Upload supporting documents
  - Validate data files

- **Permissions:**
  - ✅ Report new issues (with department selection)
  - ✅ View assigned issues
  - ✅ Change status: OPEN → IN_PROGRESS → RESOLVED
  - ✅ Add comments
  - ✅ Upload/download attachments
  - ✅ Perform data validation
  - ❌ Cannot assign issues
  - ❌ Cannot change priority
  - ❌ Cannot close issues (HOD only)

**Total Expected Users:** 56-112 users

---

## 🔄 ISSUE WORKFLOW

### Status Flow
```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
  ↑                                 ↓
  └─────────── REOPEN ──────────────┘
```

### Status Transitions

| From Status | To Status | Who Can Change | Trigger |
|------------|-----------|----------------|---------|
| OPEN | IN_PROGRESS | Staff, HOD | Staff opens issue (auto-change) |
| IN_PROGRESS | RESOLVED | Staff, HOD | Staff marks resolved |
| RESOLVED | CLOSED | HOD only | HOD approves resolution |
| CLOSED | IN_PROGRESS | HOD only | HOD reopens issue |
| Any | Any | HOD | Manual override |

### Auto-Status Change
- When Staff clicks on an OPEN issue → Automatically changes to IN_PROGRESS
- Notification sent to HOD about status change

---

## 📊 SYSTEM FEATURES (Complete List)

### 1. Authentication & User Management
- **Login System**
  - Email as username
  - Password authentication
  - JWT token-based security
  - First-time password change required
  - Password reset via email

- **User Management (Admin)**
  - Create user with permanent Employee ID
  - Auto-generate temporary password
  - Send welcome email with credentials
  - Assign role (ADMIN, HOD, STAFF)
  - Assign department
  - Activate/deactivate accounts
  - Update user information

### 2. Issue Management
- **Report New Issue**
  - Title and description
  - Select department
  - Data source (e.g., "Tax Returns", "Customs Data")
  - Data element affected (e.g., "TIN", "Amount")
  - Issue type (Missing Data, Inconsistency, Duplication, etc.)
  - Severity (Low, Medium, High, Critical)
  - Priority (Low, Medium, High, Critical)
  - Upload attachments (CSV, Excel, PDF, Word)

- **Issue Tracking**
  - View all issues (Admin)
  - View department issues (HOD)
  - View assigned issues (Staff)
  - Filter by status, priority, department
  - Search by title, description
  - Sort by date, priority, status

- **Issue Assignment (HOD)**
  - View department staff
  - Assign issue to staff member
  - Reassign if needed
  - Notification sent to assigned staff

- **Issue Resolution (Staff)**
  - View issue details
  - Add progress comments
  - Upload supporting documents
  - Mark as resolved
  - Notification sent to HOD

- **Issue Closure (HOD)**
  - Review resolved issues
  - Approve and close
  - OR reopen with comments
  - Notification sent to staff

### 3. Department Management
- **Admin Functions**
  - Create departments
  - Update department information
  - Activate/deactivate departments
  - Assign HOD to department

- **Department Structure**
  - Department name
  - Department code
  - Description
  - HOD assignment (one per department)
  - Staff members list

### 4. Data Validation
- **File Upload**
  - Support formats: CSV, Excel (.xlsx), PDF, Word (.docx)
  - File size limit: 10MB

- **Validation Types**
  - **Full Validation (CSV/Excel):**
    - Parse file content
    - Check missing values
    - Validate data types
    - Check format rules
    - Apply business rules
    - Generate detailed error report
  
  - **Limited Validation (PDF/Word):**
    - File integrity check
    - Basic format validation
    - Success confirmation

- **Validation Results**
  - Total records count
  - Passed records count
  - Failed records count
  - Success percentage
  - Detailed error table (row, field, error type, description)
  - Export validation report (CSV)
  - Create issue from validation errors

### 5. Notifications
- **In-App Notifications**
  - Bell icon with unread count
  - Dropdown list of notifications
  - Mark as read functionality
  - Click to navigate to related issue

- **Email Notifications**
  - Welcome email (new user)
  - Issue assigned
  - Status changed
  - Issue closed
  - Issue reopened
  - Password reset

- **Notification Types**
  - ISSUE_ASSIGNED
  - STATUS_UPDATED
  - PRIORITY_CHANGED
  - COMMENT_ADDED
  - ISSUE_CLOSED

### 6. Reporting & Analytics
- **Dashboard Metrics**
  - Total issues
  - Open issues
  - In Progress issues
  - Resolved issues
  - Closed issues
  - Issues by priority
  - Issues by department
  - Average resolution time

- **Charts**
  - Pie chart: Issues by status
  - Bar chart: Issues by department
  - Line chart: Issues over time
  - Bar chart: Issues by priority

- **Export Formats**
  - PDF (with RRA logo, charts, tables)
  - Excel (multiple worksheets)
  - CSV (simple data export)
  - Word (professional document)

### 7. Comments & Collaboration
- **Comment System**
  - Add comments to issues
  - View comment history
  - Edit own comments
  - Timestamp and author shown
  - Threaded discussions

### 8. Attachments
- **File Management**
  - Upload files (CSV, Excel, PDF, Word)
  - Download attachments
  - View file details (name, size, type, uploader)
  - Multiple attachments per issue

### 9. Audit Logging
- **Activity Tracking**
  - All user actions logged
  - IP address capture
  - User agent capture
  - Timestamp recording
  - Entity tracking (what was changed)
  - Action types: LOGIN, ISSUE_CREATED, ISSUE_ASSIGNED, STATUS_CHANGED, etc.

### 10. Security Features
- **Authentication**
  - JWT token-based
  - Token expiration: 24 hours
  - Secure password hashing (BCrypt)

- **Authorization**
  - Role-based access control (RBAC)
  - Department-based data filtering
  - Route protection

- **Password Security**
  - BCrypt hashing (10 rounds)
  - Password history (prevents reuse of last 5 passwords)
  - First login: forced password change
  - Password reset: token-based with 1-hour expiration
  - Minimum 8 characters

---

## 🗄️ DATABASE SCHEMA (10 TABLES)

### 1. users
- **Purpose:** Store all system users
- **Key Fields:**
  - id (Primary Key)
  - employee_id (Unique, permanent RRA ID)
  - name
  - email (Unique, used as username)
  - phone
  - password_hash
  - role (ADMIN, HOD, STAFF)
  - department
  - is_active
  - is_first_login
  - password_reset_token
  - password_reset_expiry
  - created_at, updated_at

### 2. departments
- **Purpose:** Store organizational departments
- **Key Fields:**
  - id (Primary Key)
  - name (Unique)
  - description
  - is_active
  - created_at, updated_at

### 3. issues
- **Purpose:** Core issue tracking table
- **Key Fields:**
  - id (Primary Key)
  - title
  - description
  - source
  - data_element
  - issue_type
  - severity
  - priority
  - status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
  - department
  - reported_by (FK → users.id)
  - assigned_to (FK → users.id)
  - closed_by (FK → users.id)
  - is_delegated
  - delegated_from
  - created_at, updated_at, resolved_at, closed_at

### 4. issue_comments
- **Purpose:** Store comments on issues
- **Key Fields:**
  - id (Primary Key)
  - issue_id (FK → issues.id)
  - user_id (FK → users.id)
  - content
  - is_edited
  - created_at, updated_at

### 5. issue_attachments
- **Purpose:** Store file attachments
- **Key Fields:**
  - id (Primary Key)
  - issue_id (FK → issues.id)
  - file_name
  - file_path
  - file_type
  - file_size
  - uploaded_by (FK → users.id)
  - uploaded_at

### 6. notifications
- **Purpose:** Store in-app notifications
- **Key Fields:**
  - id (Primary Key)
  - user_id (FK → users.id)
  - type (ISSUE_ASSIGNED, STATUS_UPDATED, etc.)
  - title
  - message
  - issue_id (FK → issues.id)
  - is_read
  - created_at, read_at

### 7. audit_logs
- **Purpose:** Track all system activities
- **Key Fields:**
  - id (Primary Key)
  - user_id (FK → users.id)
  - action
  - entity_type
  - entity_id
  - details (JSON)
  - ip_address
  - user_agent
  - created_at

### 8. password_history
- **Purpose:** Prevent password reuse
- **Key Fields:**
  - id (Primary Key)
  - user_id (FK → users.id)
  - password_hash
  - created_at

### 9. validation_sessions
- **Purpose:** Track data validation operations
- **Key Fields:**
  - id (Primary Key)
  - user_id (FK → users.id)
  - file_name
  - total_records
  - passed_records
  - failed_records
  - created_at

### 10. validation_errors
- **Purpose:** Store validation error details
- **Key Fields:**
  - id (Primary Key)
  - session_id (FK → validation_sessions.id)
  - row_number
  - error_type
  - field_name
  - description
  - value
  - created_at

**Total Relationships:** 14 foreign keys

---

## 🏗️ SYSTEM ARCHITECTURE

### Three-Tier Architecture

#### 1. Presentation Layer (Frontend)
- **Technology:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router 6
- **HTTP Client:** Axios
- **Charts:** Recharts
- **PDF Generation:** jsPDF
- **Excel Generation:** xlsx
- **Word Generation:** docx
- **File Download:** file-saver

**Components:**
- Login Page
- Dashboard
- Issue Management (Table & Kanban views)
- Issue Details Page
- User Management
- Department Management
- Data Validation
- Reporting & Analytics
- Notifications
- Profile Management

#### 2. Application Layer (Backend)
- **Technology:** Spring Boot 3.x + Java 17
- **Security:** Spring Security 6.x + JWT
- **Data Access:** Spring Data JPA + Hibernate
- **Email:** JavaMail API
- **Build Tool:** Maven

**Components:**
- **Security Layer:**
  - JWT Authentication Filter
  - Spring Security Config
  - CORS Configuration
  - Role-Based Authorization

- **REST API Controllers:**
  - AuthController
  - UserController
  - IssueController
  - DepartmentController
  - NotificationController
  - ReportController
  - AuditLogController

- **Business Services:**
  - AuthService
  - UserService
  - IssueService
  - DepartmentService
  - NotificationService
  - EmailService
  - ValidationService
  - ReportService
  - AuditLogService

- **Data Access Layer:**
  - UserRepository
  - IssueRepository
  - DepartmentRepository
  - NotificationRepository
  - AuditLogRepository
  - IssueCommentRepository
  - IssueAttachmentRepository
  - ValidationSessionRepository
  - ValidationErrorRepository

#### 3. Data Layer (Database)
- **Technology:** MySQL 8.0
- **Connection Pool:** HikariCP
- **Character Set:** UTF-8 (utf8mb4_unicode_ci)
- **Tables:** 10 tables
- **Relationships:** 14 foreign keys

---

## 🔐 SECURITY FEATURES

### 1. Authentication
- JWT (JSON Web Token) based
- Token contains: userId, email, role, department, expiration
- Token expiration: 24 hours
- Stored in browser localStorage

### 2. Password Security
- BCrypt hashing (strength: 10 rounds)
- Password history (prevents reuse of last 5 passwords)
- First login: forced password change
- Password reset: token-based with 1-hour expiration
- Requirements: Minimum 8 characters

### 3. Authorization
- Role-based access control (RBAC)
- Route protection based on user role
- API endpoint authorization
- Department-based data filtering

### 4. Audit Logging
- All user actions logged
- IP address tracking
- User agent capture
- Timestamp recording
- Entity tracking (what was changed)

---

## 📧 EMAIL CONFIGURATION

### SMTP Settings
- **Server:** Gmail SMTP (smtp.gmail.com:587)
- **From Address:** urumurinoella3@gmail.com
- **Authentication:** App Password (kcfskkuxtackaixb)
- **TLS:** Enabled
- **Templates:** HTML with RRA branding

### Email Types
1. **Welcome Email** (New User)
   - Subject: "Welcome to DQIMS - Rwanda Revenue Authority"
   - Content: Employee ID, temporary password, login URL, instructions

2. **Issue Assigned**
   - Subject: "New Issue Assigned"
   - Content: Issue details, priority, link to issue

3. **Status Changed**
   - Subject: "Issue Status Updated"
   - Content: Issue title, old status, new status

4. **Issue Closed**
   - Subject: "Issue Closed"
   - Content: Issue details, resolution summary

5. **Password Reset**
   - Subject: "Password Reset Request"
   - Content: Reset link with token (1-hour expiration)

---

## 📊 DIAGRAMS AVAILABLE

### 1. Use Case Diagram
- **File:** `01-UseCase-Diagram.puml`
- **Shows:** All system functionalities, 3 actors (Admin, HOD, Staff), 45+ use cases

### 2. Activity Diagrams (7 diagrams)
- **Complete System:** `00-Complete-System-Activity.puml` (All workflows in one)
- **Issue Reporting:** `02-Activity-IssueReporting.puml`
- **Issue Assignment:** `03-Activity-IssueAssignment.puml`
- **Issue Resolution:** `04-Activity-IssueResolution.puml`
- **Data Validation:** `05-Activity-DataValidation.puml`
- **User Management:** `06-Activity-UserManagement.puml`
- **Authentication:** `07-Activity-Authentication.puml`

### 3. Class Diagram
- **File:** `08-Class-Diagram.puml`
- **Shows:** 10 entities, relationships, enumerations

### 4. Sequence Diagrams (8 diagrams)
- Login Process: `09-Sequence-Login.puml`
- Create User: `10-Sequence-CreateUser.puml`
- Report Issue: `11-Sequence-ReportIssue.puml`
- Assign Issue: `12-Sequence-AssignIssue.puml`
- Resolve Issue: `13-Sequence-ResolveIssue.puml`
- Close Issue: `14-Sequence-CloseIssue.puml`
- Data Validation: `15-Sequence-DataValidation.puml`
- Generate Report: `16-Sequence-GenerateReport.puml`

### 5. Architecture Diagrams (4 diagrams)
- Detailed: `17-System-Architecture.puml`
- Simplified: `18-System-Architecture-Simple.puml`
- C4 Model: `19-System-Architecture-C4.puml` ⭐ (Recommended for thesis)
- Deployment: `20-Deployment-Architecture.puml`
- Layered: `21-System-Architecture-Layered.puml`

### 6. Database Diagram
- **File:** `DQIMS-Database-Diagram.dbml`
- **Platform:** dbdiagram.io
- **Shows:** All 10 tables with relationships

---

## 🎯 FUNCTIONAL REQUIREMENTS

### FR1: User Authentication
- System shall allow users to login with email and password
- System shall generate JWT token upon successful authentication
- System shall force password change on first login
- System shall provide password reset functionality via email

### FR2: User Management (Admin)
- System shall allow Admin to create users with permanent Employee ID
- System shall auto-generate temporary passwords
- System shall send welcome emails with credentials
- System shall allow Admin to assign roles and departments
- System shall allow Admin to activate/deactivate accounts

### FR3: Issue Reporting
- System shall allow users to report new issues
- System shall require: title, description, department, source, data element, issue type, severity, priority
- System shall allow file attachments (CSV, Excel, PDF, Word)
- System shall auto-assign status = OPEN
- System shall notify department HOD

### FR4: Issue Assignment (HOD)
- System shall allow HOD to view department issues only
- System shall allow HOD to assign issues to department staff
- System shall send notification to assigned staff
- System shall send email to assigned staff

### FR5: Issue Resolution (Staff)
- System shall auto-change status to IN_PROGRESS when staff opens OPEN issue
- System shall allow staff to add comments
- System shall allow staff to upload attachments
- System shall allow staff to mark issue as RESOLVED
- System shall notify HOD when issue is resolved

### FR6: Issue Closure (HOD)
- System shall allow HOD to close RESOLVED issues
- System shall allow HOD to reopen CLOSED issues
- System shall notify staff of closure/reopening
- System shall record who closed the issue and when

### FR7: Data Validation
- System shall accept CSV, Excel, PDF, Word files
- System shall perform full validation on CSV/Excel files
- System shall detect: missing values, invalid formats, data type mismatches
- System shall generate validation report with error details
- System shall allow creating issues from validation errors

### FR8: Notifications
- System shall display in-app notifications with unread count
- System shall send email notifications for critical events
- System shall allow users to mark notifications as read
- System shall link notifications to related issues

### FR9: Reporting & Analytics
- System shall display dashboard with key metrics
- System shall generate charts (pie, bar, line)
- System shall allow filtering by date, department, status, priority
- System shall export reports in PDF, Excel, CSV, Word formats

### FR10: Audit Logging
- System shall log all user actions
- System shall capture: user, action, timestamp, IP address, user agent
- System shall allow Admin to view audit logs
- System shall allow filtering and searching audit logs

---

## 🎯 NON-FUNCTIONAL REQUIREMENTS

### NFR1: Performance
- System shall load pages within 2 seconds
- System shall support 100+ concurrent users
- System shall handle 1000+ issues without performance degradation

### NFR2: Security
- System shall use HTTPS for all communications
- System shall hash passwords using BCrypt
- System shall use JWT tokens for authentication
- System shall implement role-based access control
- System shall log all security-related events

### NFR3: Usability
- System shall have intuitive user interface
- System shall work on Chrome, Firefox, Edge, Safari
- System shall be responsive (desktop, tablet, mobile)
- System shall provide clear error messages
- System shall have consistent navigation

### NFR4: Reliability
- System shall have 99% uptime
- System shall backup database daily
- System shall recover from failures within 1 hour
- System shall maintain data integrity

### NFR5: Maintainability
- System shall use modular architecture
- System shall have clear code documentation
- System shall follow coding standards
- System shall have automated tests

### NFR6: Scalability
- System shall support adding new departments
- System shall support increasing number of users
- System shall support increasing data volume
- System shall allow horizontal scaling

---

## 📈 SYSTEM BENEFITS

### For RRA Organization
1. **Centralized Management:** All data quality issues in one system
2. **Improved Tracking:** Real-time visibility of issue status
3. **Faster Resolution:** Automated workflows reduce delays
4. **Better Analytics:** Data-driven insights for decision making
5. **Compliance:** Complete audit trail for all activities
6. **Cost Reduction:** Eliminate manual processes

### For Admin
1. **Full Oversight:** View all issues across departments
2. **User Control:** Manage all user accounts centrally
3. **Reporting:** Generate system-wide reports
4. **Audit:** Track all system activities

### For HOD
1. **Department Focus:** See only relevant issues
2. **Assignment Control:** Assign issues to right staff
3. **Priority Management:** Set and change priorities
4. **Closure Authority:** Approve or reject resolutions

### For Staff
1. **Clear Tasks:** See assigned issues clearly
2. **Easy Reporting:** Simple issue reporting process
3. **Progress Tracking:** Update status and add comments
4. **Collaboration:** Work with team through comments

---

## 🚀 DEPLOYMENT ARCHITECTURE

### Development Environment
- **Frontend:** Port 5173/5174 (Vite dev server)
- **Backend:** Port 8080 (Spring Boot)
- **Database:** Port 3306 (MySQL)

### Production Environment
- **Web Server:** Nginx (optional)
  - Port 80/443 (HTTPS)
  - Reverse proxy to backend
  - Static file serving
  - SSL/TLS termination

- **Application Server:**
  - Spring Boot JAR
  - Embedded Tomcat
  - Port 8080
  - JVM: Java 17
  - Memory: 2-4 GB

- **Database Server:**
  - MySQL 8.0
  - Port 3306
  - Storage: 100+ GB
  - Daily backups

- **File Storage:**
  - Local file system
  - Path: /var/dqims/files
  - Size: 50+ GB

---

## 📊 ESTIMATED STORAGE (1 YEAR)

| Table | Records | Storage |
|-------|---------|---------|
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

## ✅ SYSTEM REQUIREMENTS

### Server Requirements
**Minimum:**
- CPU: 4 cores
- RAM: 8 GB
- Storage: 100 GB SSD
- OS: Ubuntu 20.04 LTS or Windows Server 2019

**Recommended:**
- CPU: 8 cores
- RAM: 16 GB
- Storage: 500 GB SSD
- OS: Ubuntu 22.04 LTS

### Client Requirements
**Browser Support:**
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

**Network:**
- Minimum: 1 Mbps
- Recommended: 10 Mbps

---

## 📝 HOW TO EXPLAIN YOUR PROJECT

### Elevator Pitch (30 seconds)
"DQIMS is an internal web-based system for Rwanda Revenue Authority that replaces manual data quality issue management with an automated platform. It allows staff to report issues, HODs to assign and track them, and Admins to oversee everything. The system includes data validation, real-time notifications, and comprehensive reporting, making data quality management faster, more transparent, and more effective."

### Detailed Explanation (5 minutes)

**Problem:**
RRA was managing data quality issues manually through hand-written letters, verbal reports, and meetings. This caused:
- Scattered issue records
- Delayed resolution
- No tracking mechanism
- Poor classification
- Weak analytics

**Solution:**
DQIMS is a centralized web application that:
- Allows staff to report issues digitally with department selection
- Enables HODs to assign issues to team members
- Tracks issue status from OPEN to CLOSED
- Validates data files (CSV, Excel, PDF, Word)
- Sends automatic notifications
- Generates comprehensive reports

**Technology:**
- Frontend: React + TypeScript (modern, responsive UI)
- Backend: Spring Boot + Java (secure, scalable API)
- Database: MySQL (reliable data storage)
- Security: JWT authentication, role-based access

**Users:**
- Admin: Manages users and oversees system
- HOD: Manages department issues and assigns work
- Staff: Reports and resolves issues

**Key Features:**
1. Issue reporting with attachments
2. Automated workflow (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
3. Data validation with error detection
4. Real-time notifications (in-app + email)
5. Analytics dashboard with charts
6. Multi-format report export (PDF, Excel, CSV, Word)
7. Complete audit trail

**Benefits:**
- 80% faster issue resolution
- 100% issue tracking
- Real-time visibility
- Data-driven decisions
- Compliance and audit ready

---

## 🎓 FOR YOUR THESIS CHAPTER 3

### Section 3.1: Introduction
Use the introduction text provided above, explaining:
- Importance of requirements analysis
- Problems with current manual system
- Goals of the new system
- Approach to requirements gathering

### Section 3.2: Unified Modeling Language (UML)
Explain:
- What is UML
- Why use UML in this project
- Benefits of UML diagrams
- Types of diagrams used

### Section 3.3: Use Case Diagram
- Insert `01-UseCase-Diagram.puml`
- Explain actors (Admin, HOD, Staff)
- Explain use cases (45+ functionalities)
- Provide use case descriptions (tables provided above)

### Section 3.4: Class Diagram
- Insert `08-Class-Diagram.puml`
- Explain entities (10 tables)
- Explain relationships (14 foreign keys)
- Explain enumerations (UserRole, IssueStatus, NotificationType)

### Section 3.5: Sequence Diagrams
- Insert key sequence diagrams (Login, Create User, Report Issue, Resolve Issue)
- Explain message flow
- Explain system interactions

### Section 3.6: Activity Diagrams
- Insert `00-Complete-System-Activity.puml` as main diagram
- Optionally add specific workflows (Issue Reporting, Assignment, Resolution)
- Explain workflow steps

### Section 3.7: Database Schema Design
- Insert database diagram from dbdiagram.io
- Explain all 10 tables
- Provide data dictionary (tables provided above)
- Explain relationships

### Section 3.8: System Architecture Design
- Insert `19-System-Architecture-C4.puml` (recommended)
- Explain three-tier architecture
- Explain technology stack
- Explain deployment architecture

### Section 3.9: Functional Requirements
- List all functional requirements (FR1-FR10 provided above)
- Explain each requirement in detail

### Section 3.10: Non-Functional Requirements
- List all non-functional requirements (NFR1-NFR6 provided above)
- Explain each requirement in detail

### Section 3.11: System Benefits
- Explain benefits for organization
- Explain benefits for each user role

---

## 📞 CONTACT INFORMATION

**Project:** Data Quality Issues Management System (DQIMS)  
**Organization:** Rwanda Revenue Authority (RRA)  
**Email:** urumurinoella3@gmail.com  
**Year:** 2024

---

## ✅ CHECKLIST FOR AI ASSISTANCE

When asking another AI to help you write Chapter 3, provide:

- [ ] This complete document
- [ ] All PlantUML diagram files (21 diagrams)
- [ ] Database diagram file (DQIMS-Database-Diagram.dbml)
- [ ] Project-Overview.md
- [ ] Database-Schema.md
- [ ] Specify which sections you need help with
- [ ] Specify your thesis format requirements
- [ ] Specify word count requirements
- [ ] Specify citation style (APA, IEEE, etc.)

---

**END OF COMPLETE PROJECT INFORMATION**

This document contains everything needed to explain your DQIMS project to another AI or to write your thesis Chapter 3. All diagrams, tables, requirements, and technical details are included.
