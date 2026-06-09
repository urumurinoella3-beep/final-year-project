# Data Quality Issues Management System (DQIMS)
## Complete Project Documentation

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Project Background](#project-background)
3. [System Overview](#system-overview)
4. [System Architecture](#system-architecture)
5. [User Roles and Permissions](#user-roles-and-permissions)
6. [Core Features](#core-features)
7. [Technology Stack](#technology-stack)
8. [Security Features](#security-features)
9. [Workflow Processes](#workflow-processes)
10. [System Requirements](#system-requirements)

---

## Executive Summary

The **Data Quality Issues Management System (DQIMS)** is a comprehensive web-based application developed for the **Rwanda Revenue Authority (RRA)** to streamline the identification, tracking, and resolution of data quality issues across the organization.

### Key Objectives
- **Centralize** data quality issue reporting and tracking
- **Automate** issue assignment and notification workflows
- **Improve** collaboration between departments
- **Provide** real-time visibility into data quality metrics
- **Enable** data validation and quality assurance
- **Generate** comprehensive reports for management

### Project Scope
- **Organization:** Rwanda Revenue Authority (RRA)
- **Target Users:** 100+ employees across multiple departments
- **Departments:** Finance, IT, HR, Operations, Compliance, and more
- **Issue Volume:** Estimated 500-1000 issues per month
- **Deployment:** Internal RRA network with web access

---

## Project Background

### Problem Statement
Rwanda Revenue Authority faced significant challenges in managing data quality issues:

1. **Fragmented Communication:** Issues reported via email, phone calls, and informal channels
2. **No Centralized Tracking:** Difficult to monitor issue status and resolution progress
3. **Accountability Gaps:** Unclear ownership and responsibility for issue resolution
4. **Delayed Resolutions:** Issues lost in communication, leading to prolonged resolution times
5. **Limited Visibility:** Management lacked real-time insights into data quality metrics
6. **Manual Processes:** Time-consuming manual tracking and reporting

### Solution
DQIMS provides a centralized, automated platform that:
- Captures all data quality issues in one system
- Automatically routes issues to appropriate departments
- Tracks issue lifecycle from reporting to closure
- Sends real-time notifications to stakeholders
- Generates comprehensive reports and analytics
- Validates data files before processing

---

## System Overview

### System Purpose
DQIMS is designed to manage the complete lifecycle of data quality issues within RRA, from initial reporting through resolution and closure.

### Key Capabilities

#### 1. Issue Management
- Report new data quality issues with detailed information
- Attach supporting documents (CSV, Excel, PDF, Word)
- Track issue status through defined workflow stages
- Assign issues to appropriate staff members
- Add comments and collaborate on resolutions
- Close and reopen issues based on review

#### 2. User Management
- Create and manage user accounts (Admin, HOD, Staff)
- Role-based access control
- Department-based organization
- Automated credential delivery via email
- Password management and security

#### 3. Data Validation
- Upload data files for validation
- Automated error detection for CSV and Excel files
- Detailed error reporting with row-level information
- Create issues directly from validation results
- Export validation reports

#### 4. Reporting & Analytics
- Real-time dashboard with key metrics
- Issue statistics by status, priority, department
- Performance tracking and trends
- Export reports in multiple formats (PDF, Excel, CSV, Word)
- Visual charts and graphs

#### 5. Notifications
- Real-time in-app notifications
- Email notifications for critical events
- Assignment notifications
- Status change alerts
- Comment notifications

#### 6. Audit & Compliance
- Complete audit trail of all system activities
- User action tracking
- IP address and timestamp logging
- Compliance reporting

---

## System Architecture

### Architecture Pattern
**Three-Tier Architecture:**

```
┌─────────────────────────────────────┐
│     Presentation Layer              │
│  (React + TypeScript Frontend)      │
│  - User Interface                   │
│  - Client-side validation           │
│  - State management                 │
└─────────────────────────────────────┘
              ↕ HTTP/REST
┌─────────────────────────────────────┐
│     Application Layer               │
│  (Spring Boot Backend)              │
│  - Business logic                   │
│  - Authentication & Authorization   │
│  - API endpoints                    │
│  - Email service                    │
└─────────────────────────────────────┘
              ↕ JDBC
┌─────────────────────────────────────┐
│     Data Layer                      │
│  (MySQL Database)                   │
│  - Data persistence                 │
│  - Relationships                    │
│  - Transactions                     │
└─────────────────────────────────────┘
```

### Component Architecture

#### Frontend Components
- **Pages:** Login, Dashboard, Issue Management, User Management, Data Validation, Reporting
- **Components:** Forms, Tables, Charts, Modals, Notifications
- **Services:** API client, Authentication, State management
- **Routing:** React Router for navigation

#### Backend Components
- **Controllers:** REST API endpoints
- **Services:** Business logic layer
- **Repositories:** Data access layer
- **Security:** JWT authentication, role-based authorization
- **Email:** SMTP integration for notifications

#### Database
- **10 Tables:** Users, Issues, Departments, Notifications, Audit Logs, etc.
- **Relationships:** Foreign keys, cascading deletes
- **Indexes:** Optimized for common queries

---

## User Roles and Permissions

### 1. System Administrator (ADMIN)

**Primary Responsibilities:**
- System oversight and monitoring
- User account management
- Department management
- System configuration
- Audit log review

**Permissions:**
| Feature | Create | Read | Update | Delete | Assign | Comment |
|---------|--------|------|--------|--------|--------|---------|
| Users | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Departments | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Issues | ❌ | ✅ (All) | ❌ | ❌ | ❌ | ✅ |
| Reports | ❌ | ✅ (All) | ❌ | ❌ | ❌ | ❌ |
| Audit Logs | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

**Key Characteristics:**
- No department affiliation (sees all departments)
- Cannot assign issues or change status
- Pure oversight and review role
- Can comment on any issue for guidance

---

### 2. Head of Department (HOD)

**Primary Responsibilities:**
- Manage department issues
- Assign issues to staff
- Review and approve resolutions
- Close or reopen issues
- Monitor department performance

**Permissions:**
| Feature | Create | Read | Update | Delete | Assign | Comment |
|---------|--------|------|--------|--------|--------|---------|
| Users | ❌ | ✅ (Dept) | ❌ | ❌ | ❌ | ❌ |
| Issues | ✅ | ✅ (Dept) | ✅ | ❌ | ✅ | ✅ |
| Priority | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Status | ❌ | ✅ | ✅ (All) | ❌ | ❌ | ❌ |
| Close/Reopen | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Reports | ✅ | ✅ (Dept) | ❌ | ❌ | ❌ | ❌ |

**Key Characteristics:**
- One HOD per department (mandatory)
- Sees only their department's issues
- Full control over issue lifecycle
- Can change status: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- Can reopen closed issues

---

### 3. Staff Member (STAFF)

**Primary Responsibilities:**
- Report new issues
- Work on assigned issues
- Update issue status
- Add comments and attachments
- Validate data files

**Permissions:**
| Feature | Create | Read | Update | Delete | Assign | Comment |
|---------|--------|------|--------|--------|--------|---------|
| Issues | ✅ | ✅ (Assigned) | ✅ (Status) | ❌ | ❌ | ✅ |
| Status | ❌ | ✅ | ✅ (Limited) | ❌ | ❌ | ❌ |
| Attachments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Data Validation | ✅ | ✅ (Own) | ❌ | ❌ | ❌ | ❌ |
| Reports | ❌ | ✅ (Limited) | ❌ | ❌ | ❌ | ❌ |

**Key Characteristics:**
- Belongs to one department
- Can change status: OPEN → IN_PROGRESS → RESOLVED
- Cannot close issues (HOD only)
- Auto-status change: Opening OPEN issue → IN_PROGRESS

---

## Core Features

### Feature 1: Issue Reporting

**Description:** Users can report data quality issues with comprehensive details.

**Fields:**
- **Title:** Brief summary of the issue
- **Description:** Detailed explanation
- **Source:** Data source (e.g., "Tax Returns", "Customs Data")
- **Data Element:** Specific field affected (e.g., "TIN", "Amount")
- **Issue Type:** Category (Missing Data, Inconsistency, Duplication, etc.)
- **Severity:** Impact level (Low, Medium, High, Critical)
- **Priority:** Urgency (Low, Medium, High, Critical)
- **Department:** Responsible department
- **Attachments:** Supporting files (CSV, Excel, PDF, Word)

**Workflow:**
1. User fills issue form
2. System validates input
3. Issue created with status = OPEN
4. Department HOD receives notification
5. Email sent to HOD with issue details

---

### Feature 2: Issue Assignment

**Description:** HODs assign issues to staff members in their department.

**Process:**
1. HOD views department issues
2. Selects issue to assign
3. Chooses staff member from dropdown
4. Confirms assignment
5. System updates issue record
6. Staff receives notification and email
7. Audit log created

**Notifications:**
- In-app notification badge
- Email with issue details and link
- Notification type: ISSUE_ASSIGNED

---

### Feature 3: Issue Resolution Workflow

**Status Flow:**
```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
  ↑                                 ↓
  └─────────── REOPEN ──────────────┘
```

**Status Transitions:**

| From Status | To Status | Who Can Change | Trigger |
|------------|-----------|----------------|---------|
| OPEN | IN_PROGRESS | Staff, HOD | Staff opens issue |
| IN_PROGRESS | RESOLVED | Staff, HOD | Staff marks resolved |
| RESOLVED | CLOSED | HOD only | HOD approves |
| CLOSED | IN_PROGRESS | HOD only | HOD reopens |
| Any | Any | HOD | Manual override |

**Auto-Status Change:**
- When Staff clicks on OPEN issue → Auto-changes to IN_PROGRESS
- Notification sent to HOD about status change

---

### Feature 4: Data Validation

**Supported File Types:**
- CSV (.csv)
- Excel (.xlsx)
- PDF (.pdf)
- Word (.docx)

**Validation Types:**

#### Full Validation (CSV/Excel):
- Parse file content
- Check for missing values
- Validate data types
- Check format rules
- Apply business rules
- Generate detailed error report

**Error Detection:**
- Row-level error identification
- Field-specific error messages
- Error type classification
- Invalid value capture

**Validation Results:**
- Total records count
- Passed records count
- Failed records count
- Success percentage
- Detailed error table

**Actions:**
- Export validation report (CSV)
- Create issue from validation errors
- Download error details

#### Limited Validation (PDF/Word):
- File integrity check
- Basic format validation
- No content parsing
- Success confirmation only

---

### Feature 5: Reporting & Analytics

**Dashboard Metrics:**
- Total issues
- Open issues
- In Progress issues
- Resolved issues
- Closed issues
- Issues by priority
- Issues by department
- Average resolution time

**Charts:**
- Pie chart: Issues by status
- Bar chart: Issues by department
- Line chart: Issues over time
- Bar chart: Issues by priority

**Export Formats:**

#### 1. PDF Export
- RRA logo header
- Executive summary
- Statistics tables
- Issue details table
- Charts as images
- Professional formatting

#### 2. Excel Export
- Multiple worksheets:
  - Summary sheet with statistics
  - Issues sheet with all details
- Formatted tables
- Auto-filter enabled
- Column sizing

#### 3. CSV Export
- Simple comma-separated format
- Header row
- All issue data
- Easy import to other systems

#### 4. Word Export
- RRA logo
- Title page
- Executive summary
- Statistics section
- Issue details table
- Professional document formatting
- Page numbers in footer

---

### Feature 6: Notification System

**Notification Types:**

| Type | Trigger | Recipients | Channels |
|------|---------|-----------|----------|
| ISSUE_ASSIGNED | Issue assigned to staff | Assigned staff | In-app + Email |
| STATUS_UPDATED | Status changed | HOD, Reporter | In-app + Email |
| PRIORITY_CHANGED | Priority modified | Assigned staff, HOD | In-app |
| COMMENT_ADDED | New comment added | Issue participants | In-app |
| ISSUE_CLOSED | Issue closed by HOD | Assigned staff, Reporter | In-app + Email |

**Email Configuration:**
- **SMTP Server:** Gmail (smtp.gmail.com:587)
- **From Address:** urumurinoella3@gmail.com
- **Authentication:** App Password
- **TLS:** Enabled
- **HTML Templates:** Professional RRA-branded emails

**In-App Notifications:**
- Bell icon with unread count
- Dropdown list of recent notifications
- Mark as read functionality
- Click to navigate to related issue

---

### Feature 7: User Management

**Admin Capabilities:**

#### Create User:
1. Fill user form (Employee ID, Name, Email, Phone, Role, Department)
2. System generates random 8-character password
3. Password hashed with BCrypt
4. User record created (isActive=true, isFirstLogin=true)
5. Welcome email sent with credentials
6. Audit log created

**Welcome Email Contents:**
- Subject: "Welcome to DQIMS - Rwanda Revenue Authority"
- Employee ID
- Temporary password
- Login URL
- Instructions for first login
- RRA branding

#### Update User:
- Modify user details
- Change role or department
- Notification sent if role/department changed

#### Deactivate User:
- Set isActive = false
- Revoke active sessions
- User cannot login
- Audit log created

---

### Feature 8: Security Features

#### Authentication:
- **JWT (JSON Web Token)** based authentication
- Token contains: userId, email, role, department, expiration
- Token expiration: 24 hours
- Stored in browser localStorage

#### Password Security:
- **BCrypt hashing** (strength: 10 rounds)
- **Password history:** Prevents reuse of last 5 passwords
- **First login:** Forced password change
- **Password reset:** Token-based with 1-hour expiration
- **Requirements:** Minimum 8 characters

#### Authorization:
- **Role-based access control (RBAC)**
- Route protection based on user role
- API endpoint authorization
- Department-based data filtering

#### Audit Logging:
- All user actions logged
- IP address tracking
- User agent capture
- Timestamp recording
- Entity tracking (what was changed)

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Vite | 5.x | Build tool |
| React Router | 6.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Tailwind CSS | 3.x | Styling framework |
| Recharts | 2.x | Data visualization |
| jsPDF | 2.x | PDF generation |
| xlsx | 0.18.x | Excel generation |
| docx | 8.x | Word generation |
| file-saver | 2.x | File download |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17 | Programming language |
| Spring Boot | 3.x | Application framework |
| Spring Security | 6.x | Security framework |
| Spring Data JPA | 3.x | Data access |
| Hibernate | 6.x | ORM |
| JWT | 0.11.x | Token authentication |
| Lombok | 1.18.x | Boilerplate reduction |
| Maven | 3.x | Build tool |
| JavaMail | 1.6.x | Email sending |

### Database
| Technology | Version | Purpose |
|-----------|---------|---------|
| MySQL | 8.x | Relational database |
| HikariCP | 5.x | Connection pooling |

### Development Tools
- **IDE:** IntelliJ IDEA, VS Code
- **Version Control:** Git
- **API Testing:** Postman
- **Database Tool:** MySQL Workbench

---

## Workflow Processes

### Process 1: Issue Lifecycle

```
1. REPORTING
   ├─ Staff/HOD reports issue
   ├─ Fills detailed form
   ├─ Uploads attachments
   └─ Submits

2. NOTIFICATION
   ├─ HOD receives notification
   ├─ Email sent to HOD
   └─ Issue appears in HOD dashboard

3. ASSIGNMENT
   ├─ HOD reviews issue
   ├─ Selects staff member
   ├─ Assigns issue
   └─ Staff receives notification

4. WORK IN PROGRESS
   ├─ Staff opens issue (auto → IN_PROGRESS)
   ├─ Staff investigates
   ├─ Staff adds comments
   └─ Staff works on resolution

5. RESOLUTION
   ├─ Staff marks as RESOLVED
   ├─ HOD receives notification
   └─ HOD reviews resolution

6. CLOSURE
   ├─ HOD approves → CLOSED
   │  └─ Staff receives confirmation
   └─ OR HOD rejects → REOPEN
      └─ Back to IN_PROGRESS
```

### Process 2: User Onboarding

```
1. ACCOUNT CREATION (Admin)
   ├─ Admin creates user account
   ├─ System generates password
   ├─ Email sent with credentials
   └─ User receives welcome email

2. FIRST LOGIN
   ├─ User enters email & temp password
   ├─ System detects isFirstLogin=true
   └─ Redirects to Change Password

3. PASSWORD CHANGE
   ├─ User enters current password
   ├─ User enters new password
   ├─ System validates requirements
   ├─ Password saved to history
   └─ isFirstLogin set to false

4. DASHBOARD ACCESS
   ├─ User redirected to dashboard
   └─ Full system access granted
```

### Process 3: Data Validation

```
1. FILE UPLOAD
   ├─ User selects file
   ├─ System validates file type
   └─ File uploaded to server

2. VALIDATION (CSV/Excel)
   ├─ Parse file content
   ├─ Extract data rows
   ├─ For each row:
   │  ├─ Validate fields
   │  ├─ Check rules
   │  └─ Record errors
   └─ Calculate statistics

3. RESULTS DISPLAY
   ├─ Show summary metrics
   ├─ Display error table
   └─ Provide export option

4. ISSUE CREATION (Optional)
   ├─ User clicks "Create Issue"
   ├─ Form pre-filled with errors
   ├─ Validation report attached
   └─ Issue submitted
```

---

## System Requirements

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

### Software Dependencies

**Backend:**
- Java JDK 17+
- MySQL 8.0+
- Maven 3.8+

**Frontend:**
- Node.js 18+
- npm 9+

---

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Load Balancer               │
│         (Optional)                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Web Server (Nginx)             │
│      - Serves React frontend        │
│      - Reverse proxy to backend     │
│      Port: 80/443                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Application Server                │
│   - Spring Boot application         │
│   - Port: 8080                      │
│   - JWT authentication              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Database Server                   │
│   - MySQL 8.0                       │
│   - Port: 3306                      │
│   - Backup: Daily                   │
└─────────────────────────────────────┘
```

---

## Future Enhancements

1. **Mobile Application:** Native iOS and Android apps
2. **Advanced Analytics:** Machine learning for issue prediction
3. **Integration:** Connect with RRA's existing systems
4. **Workflow Automation:** Auto-assignment based on rules
5. **SLA Management:** Track and enforce resolution SLAs
6. **Multi-language Support:** Kinyarwanda, French, English
7. **API Gateway:** Public API for third-party integrations
8. **Real-time Collaboration:** WebSocket-based live updates

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Author:** DQIMS Development Team  
**Organization:** Rwanda Revenue Authority (RRA)  
**Contact:** urumurinoella3@gmail.com
