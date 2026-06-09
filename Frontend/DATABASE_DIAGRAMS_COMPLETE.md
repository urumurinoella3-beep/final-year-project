# DQIMS - Complete Database Diagrams Guide
# For Defense Presentation & Project Documentation

---

## 📊 ENTITY RELATIONSHIP DIAGRAM (ERD)

### Main ERD Structure

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    users    │1      N │    issues    │N      1 │ departments │
│─────────────│◄────────│──────────────│────────►│─────────────│
│ PK id       │         │ PK id        │         │ PK id       │
│ UK employee_id        │ FK reported_by         │ UK name     │
│ UK email    │         │ FK assigned_to         └─────────────┘
│    name     │         │ FK closed_by │
│    phone    │         │    title     │
│ password_hash         │ description  │
│    role     │         │    source    │
│ department  │         │  issue_type  │
└─────────────┘         │  severity    │
       │1               │  priority    │
       │                │   status     │
       │                └──────────────┘
       │                       │1
       │                       │
       │                       │N
       │                ┌──────────────────┐
       │                │ issue_attachments│
       │                │──────────────────│
       │                │ PK id            │
       │                │ FK issue_id      │
       │                │ FK uploaded_by   │
       │                │   file_name      │
       │                │   file_path      │
       │                └──────────────────┘
       │                       │N
       │                ┌──────────────────┐
       │                │ issue_comments   │
       │                │──────────────────│
       │                │ PK id            │
       │                │ FK issue_id      │
       │                │ FK user_id       │
       │                │   content        │
       │                └──────────────────┘
       │
       │1              ┌──────────────────┐
       └──────────────►│  notifications   │
                N      │──────────────────│
                       │ PK id            │
                       │ FK user_id       │
                       │ FK issue_id      │
                       │    type          │
                       │    title         │
                       │   message        │
                       │   is_read        │
                       └──────────────────┘
```

### Full Table Relationships

1. **users** (Central table)
   - One user can report many issues
   - One user can be assigned to many issues
   - One user can close many issues
   - One user can have many notifications
   - One user can upload many attachments
   - One user can write many comments

2. **issues** (Core business table)
   - Many issues belong to one department
   - Many issues reported by one user
   - Many issues assigned to one user (optional)
   - Many issues closed by one user (optional)
   - One issue has many attachments
   - One issue has many comments
   - One issue triggers many notifications

3. **departments**
   - One department has many users
   - One department has many issues

---

## 🎨 PLANTUML CODE

### Complete ERD in PlantUML

```plantuml
@startuml DQIMS_ERD

!define primary_key(x) <b><color:#b8861b><&key></color> x</b>
!define foreign_key(x) <color:#aaaaaa><&key></color> x
!define column(x) <color:#efefef><&media-record></color> x
!define table(x) entity x << (T, white) >>

' Tables
table(users) {
  primary_key(id) BIGINT
  --
  column(employee_id) VARCHAR(50) UNIQUE
  column(name) VARCHAR(100)
  column(email) VARCHAR(100) UNIQUE
  column(phone) VARCHAR(20)
  column(password_hash) VARCHAR(255)
  column(role) VARCHAR(20)
  column(department) VARCHAR(50)
  column(is_active) BOOLEAN
  column(created_at) TIMESTAMP
}

table(departments) {
  primary_key(id) BIGINT
  --
  column(name) VARCHAR(100) UNIQUE
  column(description) TEXT
  column(is_active) BOOLEAN
}

table(issues) {
  primary_key(id) BIGINT
  --
  foreign_key(reported_by) BIGINT
  foreign_key(assigned_to) BIGINT
  foreign_key(closed_by) BIGINT
  column(title) VARCHAR(255)
  column(description) TEXT
  column(source) VARCHAR(50)
  column(issue_type) VARCHAR(50)
  column(severity) VARCHAR(20)
  column(priority) VARCHAR(20)
  column(status) VARCHAR(20)
  column(department) VARCHAR(50)
  column(created_at) TIMESTAMP
}

table(issue_attachments) {
  primary_key(id) BIGINT
  --
  foreign_key(issue_id) BIGINT
  foreign_key(uploaded_by) BIGINT
  column(file_name) VARCHAR(255)
  column(file_path) VARCHAR(500)
  column(file_size) BIGINT
}

table(issue_comments) {
  primary_key(id) BIGINT
  --
  foreign_key(issue_id) BIGINT
  foreign_key(user_id) BIGINT
  column(content) TEXT
  column(created_at) TIMESTAMP
}

table(notifications) {
  primary_key(id) BIGINT
  --
  foreign_key(user_id) BIGINT
  foreign_key(issue_id) BIGINT
  column(type) VARCHAR(50)
  column(title) VARCHAR(255)
  column(message) TEXT
  column(is_read) BOOLEAN
}

table(audit_logs) {
  primary_key(id) BIGINT
  --
  foreign_key(user_id) BIGINT
  column(action) VARCHAR(100)
  column(details) TEXT
  column(ip_address) VARCHAR(45)
}

table(validation_sessions) {
  primary_key(id) BIGINT
  --
  foreign_key(user_id) BIGINT
  column(file_name) VARCHAR(255)
  column(total_records) INT
  column(passed_records) INT
}

table(validation_errors) {
  primary_key(id) BIGINT
  --
  foreign_key(session_id) BIGINT
  column(row_number) INT
  column(error_type) VARCHAR(50)
  column(description) TEXT
}

' Relationships
users ||--o{ issues : "reports"
users ||--o{ issues : "assigned_to"
users ||--o{ issues : "closes"
departments ||--o{ issues : "contains"
issues ||--o{ issue_attachments : "has"
issues ||--o{ issue_comments : "has"
users ||--o{ notifications : "receives"
users ||--o{ audit_logs : "creates"
users ||--o{ validation_sessions : "performs"
validation_sessions ||--o{ validation_errors : "contains"

@enduml
```

---

## 📈 ACTIVITY DIAGRAMS

### 1. User Login Flow

```plantuml
@startuml User_Login

start
:User enters email and password;
:System validates credentials;

if (Credentials valid?) then (yes)
  if (First login?) then (yes)
    :Redirect to change password;
    :User changes password;
    :System saves new password;
  else (no)
    :Generate JWT token;
    :Return token + user info;
  endif
  :User redirected to dashboard;
else (no)
  :Show error message;
  :User retries login;
endif

stop

@enduml
```

### 2. Create Issue Flow

```plantuml
@startuml Create_Issue

start
:User clicks "Report Issue";
:User fills issue form;
:User uploads files (optional);
:User submits form;

:System validates input;

if (Validation passes?) then (yes)
  :System saves issue to database;
  :System saves file attachments;
  :System creates audit log;
  
  if (Issue assigned?) then (yes)
    :System creates notification;
    :System sends email to assigned user;
  endif
  
  :Show success message;
  :Redirect to issue list;
else (no)
  :Show validation errors;
  :User corrects errors;
endif

stop

@enduml
```

### 3. Issue Lifecycle

```plantuml
@startuml Issue_Lifecycle

[*] --> OPEN : Staff reports issue

OPEN --> IN_PROGRESS : Staff starts work
OPEN --> CLOSED : HOD closes (no action needed)

IN_PROGRESS --> RESOLVED : Staff marks complete
IN_PROGRESS --> OPEN : Staff reopens

RESOLVED --> CLOSED : HOD approves
RESOLVED --> IN_PROGRESS : HOD requests changes

CLOSED --> [*]

@enduml
```

### 4. Data Validation Flow

```plantuml
@startuml Data_Validation

start
:User uploads CSV/Excel file;
:System reads file;
:System validates each row;

partition "Validation Checks" {
  :Check completeness;
  :Check accuracy;
  :Check uniqueness;
  :Check format;
}

:System creates validation session;
:System saves errors to database;
:System generates report;
:Display results to user;

if (Errors found?) then (yes)
  :User can create issues from errors;
  :User can download error report;
else (no)
  :Show success message;
endif

stop

@enduml
```

### 5. HOD Assign Issue

```plantuml
@startuml HOD_Assign_Issue

start
:HOD views department issues;
:HOD selects an issue;
:HOD clicks "Assign";
:System shows department staff list;
:HOD selects staff member;
:System updates issue assignment;
:System creates notification for staff;
:System sends email to staff;
:System creates audit log;
:Show success message;
stop

@enduml
```

---

## 🏗️ SYSTEM ARCHITECTURE DIAGRAM

```plantuml
@startuml System_Architecture

!define RECTANGLE rectangle

package "Frontend Layer" {
  [React Application] as React
  [React Router] as Router
  [State Management\n(Context API)] as State
}

package "Backend Layer" {
  [Spring Boot API] as API
  [JWT Authentication] as JWT
  [Business Logic] as Logic
  [Email Service] as Email
  [File Storage] as Files
}

package "Data Layer" {
  database "PostgreSQL" as DB
  folder "File System" as FS
}

package "External Services" {
  [SMTP Server] as SMTP
}

React --> Router
React --> State
React --> API : REST API

API --> JWT : Authenticate
API --> Logic : Process
API --> Email : Send
API --> Files : Upload/Download

Logic --> DB : CRUD Operations
Files --> FS : Store Files
Email --> SMTP : Send Emails

@enduml
```

---

## 📊 CLASS DIAGRAM (Simplified)

```plantuml
@startuml Class_Diagram

class User {
  - id: Long
  - employeeId: String
  - name: String
  - email: String
  - phone: String
  - role: UserRole
  - department: String
  --
  + createIssue()
  + assignIssue()
  + closeIssue()
}

class Issue {
  - id: Long
  - title: String
  - description: String
  - status: IssueStatus
  - priority: Priority
  - department: String
  --
  + updateStatus()
  + addComment()
  + addAttachment()
}

class IssueAttachment {
  - id: Long
  - fileName: String
  - filePath: String
  - fileSize: Long
  --
  + download()
}

class IssueComment {
  - id: Long
  - content: String
  - createdAt: DateTime
  --
  + edit()
}

class Notification {
  - id: Long
  - type: String
  - message: String
  - isRead: Boolean
  --
  + markAsRead()
}

class Department {
  - id: Long
  - name: String
  - description: String
  --
  + getMembers()
  + getIssues()
}

User "1" --> "*" Issue : reports
User "1" --> "*" Issue : assigned to
User "1" --> "*" Notification : receives
Issue "1" --> "*" IssueAttachment : has
Issue "1" --> "*" IssueComment : has
Department "1" --> "*" User : contains
Department "1" --> "*" Issue : contains

@enduml
```

---

## 🔄 SEQUENCE DIAGRAMS

### Login Sequence

```plantuml
@startuml Login_Sequence

actor User
participant Frontend
participant "Auth Controller" as Auth
participant "User Service" as Service
database Database

User -> Frontend : Enter credentials
Frontend -> Auth : POST /api/v1/auth/login
Auth -> Service : validateUser()
Service -> Database : findByEmail()
Database --> Service : User entity
Service -> Service : verifyPassword()
Service -> Auth : User validated
Auth -> Auth : generateJWT()
Auth --> Frontend : JWT token + user info
Frontend --> User : Redirect to dashboard

@enduml
```

### Create Issue Sequence

```plantuml
@startuml Create_Issue_Sequence

actor Staff
participant Frontend
participant "Issue Controller" as Controller
participant "Issue Service" as Service
participant "File Service" as FileService
participant "Email Service" as Email
database Database

Staff -> Frontend : Fill issue form + upload files
Frontend -> Controller : POST /api/v1/issues
Controller -> Service : createIssue()
Service -> Database : Save issue
Service -> FileService : saveFiles()
FileService -> Database : Save attachment records

alt Issue is assigned
  Service -> Email : sendAssignmentEmail()
  Service -> Database : Create notification
end

Service --> Controller : IssueResponse
Controller --> Frontend : 201 Created
Frontend --> Staff : Show success message

@enduml
```

---

## 📐 USE CASE DIAGRAM

```plantuml
@startuml Use_Cases

left to right direction

actor Admin as admin
actor HOD as hod
actor Staff as staff

rectangle "DQIMS System" {
  usecase "Manage Users" as UC1
  usecase "Manage Departments" as UC2
  usecase "Report Issue" as UC3
  usecase "Assign Issue" as UC4
  usecase "Update Issue Status" as UC5
  usecase "Close Issue" as UC6
  usecase "Add Comment" as UC7
  usecase "Upload Files" as UC8
  usecase "View Dashboard" as UC9
  usecase "Validate Data" as UC10
  usecase "Generate Reports" as UC11
  usecase "View Notifications" as UC12
}

admin --> UC1
admin --> UC2
admin --> UC3
admin --> UC4
admin --> UC6
admin --> UC9
admin --> UC10
admin --> UC11

hod --> UC3
hod --> UC4
hod --> UC6
hod --> UC7
hod --> UC9
hod --> UC10
hod --> UC11

staff --> UC3
staff --> UC5
staff --> UC7
staff --> UC8
staff --> UC9
staff --> UC10
staff --> UC12

@enduml
```

---

## 🎯 HOW TO DRAW DIAGRAMS

### Option 1: PlantUML Online Editor
1. Go to http://www.plantuml.com/plantuml/uml/
2. Copy any diagram code above
3. Paste and view
4. Export as PNG/SVG

### Option 2: VS Code
1. Install PlantUML extension
2. Create `.puml` file
3. Paste diagram code
4. Press Alt+D to preview
5. Export as image

### Option 3: Draw.io
1. Go to https://app.diagrams.net/
2. Manually draw using shapes
3. Use template for ERD
4. Export as PNG/PDF

### Option 4: Lucidchart
1. Sign up at lucidchart.com
2. Use ERD template
3. Add all 10 tables
4. Connect relationships
5. Export

---

## 📋 TABLES SUMMARY FOR DIAGRAMS

| Table | Primary Key | Foreign Keys | Purpose |
|-------|------------|--------------|---------|
| users | id | - | User authentication & profiles |
| departments | id | - | Department management |
| issues | id | reported_by, assigned_to, closed_by | Issue tracking |
| issue_attachments | id | issue_id, uploaded_by | File storage |
| issue_comments | id | issue_id, user_id | Discussion threads |
| notifications | id | user_id, issue_id | Real-time alerts |
| audit_logs | id | user_id | Activity tracking |
| validation_sessions | id | user_id | Data validation history |
| validation_errors | id | session_id | Validation error details |
| password_history | id | user_id | Password security |

---

## 🎓 FOR YOUR DEFENSE PRESENTATION

### Recommended Diagrams to Show:

1. **ERD** - Shows complete database structure (MUST HAVE)
2. **System Architecture** - Shows frontend-backend-database (MUST HAVE)
3. **Issue Lifecycle** - Shows business process flow (HIGHLY RECOMMENDED)
4. **Login Sequence** - Shows authentication flow (RECOMMENDED)
5. **Use Case Diagram** - Shows system features by role (RECOMMENDED)

### Presentation Tips:

- **Start with ERD** - Explain all 10 tables
- **Show relationships** - One-to-many, many-to-one
- **Explain foreign keys** - How tables connect
- **Demo System Architecture** - Frontend → Backend → Database
- **Walk through flows** - Login, Create Issue, Assign Issue
- **Explain role-based access** - Who can do what

---

**All diagrams are ready for your defense and documentation! Good luck! 🎓📊**
