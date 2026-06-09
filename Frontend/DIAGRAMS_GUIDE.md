# DQIMS - Complete Diagrams Guide
## All Diagrams You Need for Your Defense Presentation

---

## 📋 **TABLE OF CONTENTS**

1. System Architecture Diagram
2. Use Case Diagram
3. Entity Relationship Diagram (ERD)
4. Sequence Diagrams (5 key workflows)
5. Activity Diagrams (3 key processes)
6. Class Diagram
7. Deployment Diagram
8. Data Flow Diagram
9. User Interface Flow Diagram
10. Security Architecture Diagram

---

## 1️⃣ **SYSTEM ARCHITECTURE DIAGRAM**

### **Purpose:** Show the 3-tier architecture (Frontend, Backend, Database)

### **What to Draw:**

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │        User's Web Browser (Chrome/Firefox)        │  │
│  └───────────────────────────────────────────────────┘  │
│                           ↕                              │
│                     HTTPS/REST API                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │           React Frontend Application              │  │
│  │  • 12 Modules (Dashboard, Issues, etc.)          │  │
│  │  • Tailwind CSS Styling                          │  │
│  │  • RRA Branding                                   │  │
│  │  • Role-Based UI                                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
                  HTTP REST API Calls
                  JSON Data + JWT Token
                            ↕
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION TIER                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Spring Boot Backend (Java)                │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │         Controllers Layer                    │ │  │
│  │  │  • AuthController                           │ │  │
│  │  │  • UserController                           │ │  │
│  │  │  • IssueController                          │ │  │
│  │  │  • ValidationController                     │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │         Services Layer                       │ │  │
│  │  │  • Business Logic                           │ │  │
│  │  │  • Email Notifications                      │ │  │
│  │  │  • JWT Token Generation                     │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │         Security Layer                       │ │  │
│  │  │  • JWT Authentication Filter                │ │  │
│  │  │  • Role-Based Access Control                │ │  │
│  │  │  • Password Encryption (BCrypt)             │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │         Repository Layer                     │ │  │
│  │  │  • JPA/Hibernate ORM                        │ │  │
│  │  │  • Data Access Objects                      │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
                      SQL Queries
                   JPA/Hibernate ORM
                            ↕
┌─────────────────────────────────────────────────────────┐
│                      DATA TIER                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database Server                │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │         20 Database Tables:                  │ │  │
│  │  │  • users, departments, issues               │ │  │
│  │  │  • data_validation_rules                    │ │  │
│  │  │  • audit_logs, notifications                │ │  │
│  │  │  • reports, metrics, etc.                   │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

External Systems:
┌──────────────┐
│ Email Server │ ← Send notifications
└──────────────┘
```

### **How to Draw:**
1. Draw 3 large boxes stacked vertically
2. Label them: Presentation Tier, Application Tier, Data Tier
3. Inside each, draw smaller boxes for components
4. Draw arrows between tiers showing data flow
5. Add labels on arrows (HTTPS, REST API, SQL)

---

## 2️⃣ **USE CASE DIAGRAM**

### **Purpose:** Show what each user role can do

### **Actors (Stick Figures):**
- ADMIN
- HOD (Head of Department)
- Secretary
- Member

### **Use Cases (Ovals) - What They Can Do:**

```
                    DQIMS System
     ┌────────────────────────────────────────┐
     │                                        │
ADMIN│  ○ Login                               │
  👤─┼→ ○ Manage Users                        │
     │  ○ View All Issues (All Departments)   │
     │  ○ Create/Edit/Delete Issues           │
     │  ○ Assign Issues                       │
     │  ○ Create Validation Rules             │
     │  ○ Run Data Validations                │
     │  ○ Generate Reports (All Departments)  │
     │  ○ View Audit Logs (All)               │
     │  ○ Configure System Settings           │
     │  ○ Manage Departments                  │
     │                                        │
 HOD │  ○ Login                               │
  👤─┼→ ○ View Department Issues              │
     │  ○ Create Issues                       │
     │  ○ Assign Issues to Team               │
     │  ○ Approve Resolutions                 │
     │  ○ Run Data Validations                │
     │  ○ Generate Department Reports         │
     │  ○ View Department Audit Logs          │
     │  ○ Perform Root Cause Analysis         │
     │                                        │
Secretary  ○ Login                            │
  👤─┼→ ○ View Department Issues              │
     │  ○ Create Issues                       │
     │  ○ Update Issue Status                 │
     │  ○ Add Comments                        │
     │  ○ Run Data Validations                │
     │  ○ View Department Reports             │
     │                                        │
Member│  ○ Login                               │
  👤─┼→ ○ View Assigned Issues                │
     │  ○ Create Issues                       │
     │  ○ Update Assigned Issue Status        │
     │  ○ Add Comments                        │
     │  ○ Resolve Issues                      │
     │  ○ Perform Root Cause Analysis         │
     │  ○ Run Data Validations                │
     │                                        │
     └────────────────────────────────────────┘

Relationships (Include/Extend):
○ "Assign Issues" <<includes>> "View Department Issues"
○ "Resolve Issues" <<includes>> "Add Comments"
○ "Generate Reports" <<includes>> "View Issues"
```

### **How to Draw:**
1. Draw large rectangle (system boundary)
2. Draw stick figures outside for each role
3. Draw ovals inside rectangle for each action
4. Draw lines from actors to their use cases
5. Add <<include>> and <<extend>> relationships with dotted arrows

---

## 3️⃣ **ENTITY RELATIONSHIP DIAGRAM (ERD)**

### **Purpose:** Show database tables and their relationships

### **Main Entities to Draw:**

```
┌──────────────┐
│ departments  │
├──────────────┤
│ PK id        │
│    dept_code │
│    dept_name │
└──────┬───────┘
       │
       │ 1:N (One department has many users)
       ↓
┌──────────────┐
│    users     │
├──────────────┤
│ PK id        │
│    employee_id
│    email     │
│    full_name │
│    role      │
│ FK department_id
│    password  │
└──────┬───────┘
       │
       │ 1:N (One user reports many issues)
       ↓
┌──────────────────┐
│     issues       │
├──────────────────┤
│ PK id            │
│    issue_number  │
│    title         │
│    description   │
│    severity      │
│    status        │
│ FK reported_by   │─→ users.id
│ FK assigned_to   │─→ users.id
│ FK department_id │─→ departments.id
│ FK category_id   │─→ issue_categories.id
│    sla_due_date  │
└──────┬───────────┘
       │
       │ 1:N (One issue has many comments)
       ↓
┌──────────────────┐
│ issue_comments   │
├──────────────────┤
│ PK id            │
│ FK issue_id      │
│ FK user_id       │
│    comment_text  │
│    created_at    │
└──────────────────┘

┌──────────────────────┐
│ issue_categories     │
├──────────────────────┤
│ PK id                │
│    category_code     │
│    category_name     │
│    severity_level    │
└──────────────────────┘

┌──────────────────────────┐
│ data_validation_rules    │
├──────────────────────────┤
│ PK id                    │
│    rule_code             │
│    rule_name             │
│    validation_type       │
│    rule_logic            │
└──────┬───────────────────┘
       │
       │ 1:N
       ↓
┌──────────────────────────────┐
│ data_validation_executions   │
├──────────────────────────────┤
│ PK id                        │
│    execution_number          │
│ FK rule_id                   │
│ FK executed_by               │
│    total_records_checked     │
│    records_passed            │
│    records_failed            │
│    pass_rate                 │
└──────┬───────────────────────┘
       │
       │ 1:N
       ↓
┌────────────────────────────────┐
│ data_validation_failures       │
├────────────────────────────────┤
│ PK id                          │
│ FK execution_id                │
│    record_identifier           │
│    failure_reason              │
│ FK issue_id (auto-created)     │
└────────────────────────────────┘

┌──────────────────────┐
│   audit_logs         │
├──────────────────────┤
│ PK id                │
│ FK user_id           │
│    action_type       │
│    module_name       │
│    created_at        │
│    ip_address        │
└──────────────────────┘

┌──────────────────────┐
│   notifications      │
├──────────────────────┤
│ PK id                │
│ FK user_id           │
│    title             │
│    message           │
│    is_read           │
│    created_at        │
└──────────────────────┘
```

### **Relationship Symbols:**
- **1:1** = One to One (straight line)
- **1:N** = One to Many (crow's foot ───<)
- **N:M** = Many to Many (crow's feet on both ends ───<>───)
- **PK** = Primary Key (key symbol 🔑)
- **FK** = Foreign Key (arrow →)

### **How to Draw:**
1. Draw rectangle for each table
2. List columns inside (PK and FK first)
3. Draw lines between related tables
4. Add cardinality symbols (1:N, etc.)
5. Label foreign key relationships

---

## 4️⃣ **SEQUENCE DIAGRAMS**

### **Purpose:** Show step-by-step interactions between components

### **Diagram 4.1: User Login Sequence**

```
User Browser    →    Frontend    →    Backend    →    Database
     │                  │               │               │
     │  Enter email     │               │               │
     │  & password      │               │               │
     │──────────────────→               │               │
     │                  │               │               │
     │                  │ POST /api/auth/login         │
     │                  │ {email, password}            │
     │                  │──────────────→               │
     │                  │               │               │
     │                  │               │ SELECT * FROM users
     │                  │               │ WHERE email = ?
     │                  │               │──────────────→
     │                  │               │               │
     │                  │               │ Return user record
     │                  │               │←──────────────│
     │                  │               │               │
     │                  │      Verify password (BCrypt)│
     │                  │      Generate JWT Token      │
     │                  │               │               │
     │                  │ Return {token, user}         │
     │                  │←──────────────│               │
     │                  │               │               │
     │  Store token     │               │               │
     │  Show Dashboard  │               │               │
     │←─────────────────│               │               │
     │                  │               │               │
```

### **Diagram 4.2: Create Issue Sequence**

```
User    →    Frontend    →    Backend    →    Database    →    Email
 │              │               │               │               │
 │ Fill form    │               │               │               │
 │──────────────→               │               │               │
 │              │               │               │               │
 │              │ POST /api/issues              │               │
 │              │ {title, severity, etc.}       │               │
 │              │──────────────→                │               │
 │              │               │               │               │
 │              │               │ Generate issue_number        │
 │              │               │ (ISS-2026-0001)              │
 │              │               │               │               │
 │              │               │ INSERT INTO issues           │
 │              │               │──────────────→               │
 │              │               │               │               │
 │              │               │ Return issue_id              │
 │              │               │←──────────────               │
 │              │               │               │               │
 │              │               │ INSERT INTO audit_logs       │
 │              │               │──────────────→               │
 │              │               │               │               │
 │              │               │ Send notification email      │
 │              │               │──────────────────────────────→
 │              │               │               │               │
 │              │ Return {issue}               │               │
 │              │←──────────────               │               │
 │              │               │               │               │
 │ Show success │               │               │               │
 │←─────────────               │               │               │
 │              │               │               │               │
```

### **Diagram 4.3: Assign Issue Sequence**

```
HOD    →    Frontend    →    Backend    →    Database    →    Notification
 │              │               │               │               │
 │ Select issue │               │               │               │
 │ Choose member│               │               │               │
 │──────────────→               │               │               │
 │              │               │               │               │
 │              │ PATCH /api/issues/{id}/assign │               │
 │              │ {assignedTo: user_id}        │               │
 │              │──────────────→               │               │
 │              │               │               │               │
 │              │               │ UPDATE issues SET            │
 │              │               │   assigned_to = ?,           │
 │              │               │   status = 'In Progress'     │
 │              │               │──────────────→               │
 │              │               │               │               │
 │              │               │ INSERT INTO notifications    │
 │              │               │ (user_id, message)           │
 │              │               │──────────────→               │
 │              │               │               │               │
 │              │               │ INSERT INTO audit_logs       │
 │              │               │──────────────→               │
 │              │               │               │               │
 │              │               │ Send notification            │
 │              │               │──────────────────────────────→
 │              │               │               │               │
 │              │ Return success              │               │
 │              │←──────────────               │               │
 │              │               │               │               │
 │ Show success │               │               │               │
 │←─────────────               │               │               │
 │              │               │               │               │
```

### **How to Draw Sequence Diagrams:**
1. Draw vertical lines for each component (actors/systems)
2. Draw horizontal arrows for messages between components
3. Number the steps (1, 2, 3...)
4. Add labels on arrows describing the action
5. Use solid arrows (→) for requests
6. Use dashed arrows (⤶) for responses

---

## 5️⃣ **ACTIVITY DIAGRAMS**

### **Purpose:** Show business process flow with decision points

### **Diagram 5.1: Issue Resolution Process**

```
                    START
                      │
                      ↓
            ┌─────────────────┐
            │ Issue Created   │
            └────────┬────────┘
                     │
                     ↓
            ┌─────────────────┐
            │ HOD Reviews      │
            └────────┬────────┘
                     │
                     ↓
            ◇ Is it valid? ◇
           /                 \
         NO                  YES
         │                    │
         ↓                    ↓
  ┌──────────────┐    ┌──────────────┐
  │ Reject Issue │    │ Assign to    │
  │ Close        │    │ Team Member  │
  └──────┬───────┘    └──────┬───────┘
         │                    │
         │                    ↓
         │            ┌──────────────┐
         │            │ Member       │
         │            │ Investigates │
         │            └──────┬───────┘
         │                    │
         │                    ↓
         │            ◇ Can resolve? ◇
         │           /                \
         │         NO                 YES
         │         │                   │
         │         ↓                   ↓
         │  ┌──────────────┐   ┌──────────────┐
         │  │ Escalate to  │   │ Implement    │
         │  │ HOD/ADMIN    │   │ Solution     │
         │  └──────┬───────┘   └──────┬───────┘
         │         │                   │
         │         └─────────┬─────────┘
         │                   │
         │                   ↓
         │           ┌──────────────┐
         │           │ Mark as      │
         │           │ Resolved     │
         │           └──────┬───────┘
         │                   │
         │                   ↓
         │           ┌──────────────┐
         │           │ HOD Reviews  │
         │           │ Resolution   │
         │           └──────┬───────┘
         │                   │
         │                   ↓
         │           ◇ Approved? ◇
         │          /              \
         │        NO               YES
         │        │                 │
         │        ↓                 ↓
         │  ┌──────────┐    ┌──────────┐
         │  │ Reopen   │    │ Close    │
         │  │ Issue    │    │ Issue    │
         │  └────┬─────┘    └────┬─────┘
         │       │               │
         └───────┴───────────────┘
                     │
                     ↓
                    END
```

### **Symbols:**
- **Oval** = Start/End
- **Rectangle** = Action/Process
- **Diamond ◇** = Decision Point
- **Arrow** = Flow Direction

### **Diagram 5.2: Data Validation Process**

```
                START
                  │
                  ↓
        ┌──────────────────┐
        │ Select Validation│
        │ Rule             │
        └─────────┬────────┘
                  │
                  ↓
        ┌──────────────────┐
        │ Click "Run       │
        │ Validation"      │
        └─────────┬────────┘
                  │
                  ↓
        ┌──────────────────┐
        │ System Creates   │
        │ Execution Record │
        └─────────┬────────┘
                  │
                  ↓
        ┌──────────────────┐
        │ Query Database   │
        │ with Rule Logic  │
        └─────────┬────────┘
                  │
                  ↓
        ┌──────────────────┐
        │ Check Each Record│
        └─────────┬────────┘
                  │
                  ↓
        ◇ Record Passes? ◇
       /                   \
     YES                   NO
      │                     │
      ↓                     ↓
┌──────────┐      ┌─────────────────┐
│ Count as │      │ Log Failure     │
│ Passed   │      │ Save to DB      │
└────┬─────┘      └────┬────────────┘
     │                  │
     └────────┬─────────┘
              │
              ↓
       ◇ More Records? ◇
       /               \
     YES               NO
      │                 │
      │                 ↓
      │        ┌─────────────────┐
      │        │ Calculate Pass  │
      │        │ Rate            │
      │        └────┬────────────┘
      │             │
      │             ↓
      │        ┌─────────────────┐
      │        │ Update Execution│
      │        │ Status: Complete│
      │        └────┬────────────┘
      │             │
      └─────────────┘
                    │
                    ↓
            ◇ Auto-create Issues? ◇
           /                        \
         NO                         YES
         │                           │
         │                           ↓
         │                  ┌─────────────────┐
         │                  │ Create Issue for│
         │                  │ Each Failure    │
         │                  └────┬────────────┘
         │                       │
         └───────────────────────┘
                    │
                    ↓
           ┌─────────────────┐
           │ Show Results to │
           │ User            │
           └────┬────────────┘
                │
                ↓
               END
```

### **How to Draw Activity Diagrams:**
1. Start with oval (START)
2. Draw rectangles for each action/step
3. Draw diamonds for decisions (yes/no paths)
4. Connect with arrows showing flow
5. End with oval (END)
6. Add swim lanes if showing different roles

---

## 6️⃣ **CLASS DIAGRAM**

### **Purpose:** Show object-oriented structure of backend

```
┌─────────────────────────────────┐
│         Department              │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - deptCode: String              │
│ - deptName: String              │
│ - description: String           │
│ - isActive: Boolean             │
├─────────────────────────────────┤
│ + getDeptCode(): String         │
│ + setDeptCode(code: String)     │
└────────────┬────────────────────┘
             │
             │ 1:N
             ↓
┌─────────────────────────────────┐
│            User                 │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - employeeId: String            │
│ - email: String                 │
│ - passwordHash: String          │
│ - fullName: String              │
│ - role: String                  │
│ - department: Department        │
│ - phone: String                 │
│ - isActive: Boolean             │
├─────────────────────────────────┤
│ + login(): boolean              │
│ + changePassword()              │
│ + hasRole(role: String): bool   │
└────────────┬────────────────────┘
             │
             │ 1:N
             ↓
┌─────────────────────────────────┐
│           Issue                 │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - issueNumber: String           │
│ - title: String                 │
│ - description: String           │
│ - severity: String              │
│ - priority: String              │
│ - status: String                │
│ - reportedBy: User              │
│ - assignedTo: User              │
│ - department: Department        │
│ - category: IssueCategory       │
│ - slaDueDate: DateTime          │
│ - slaStatus: String             │
├─────────────────────────────────┤
│ + assign(user: User)            │
│ + resolve(notes: String)        │
│ + addComment(text: String)      │
│ + calculateSLA()                │
└────────────┬────────────────────┘
             │
             │ 1:N
             ↓
┌─────────────────────────────────┐
│       IssueComment              │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - issue: Issue                  │
│ - user: User                    │
│ - commentText: String           │
│ - isInternal: Boolean           │
│ - createdAt: DateTime           │
├─────────────────────────────────┤
│ + edit(newText: String)         │
│ + delete()                      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│      IssueCategory              │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - categoryCode: String          │
│ - categoryName: String          │
│ - severityLevel: String         │
│ - colorCode: String             │
├─────────────────────────────────┤
│ + getName(): String             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   DataValidationRule            │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - ruleCode: String              │
│ - ruleName: String              │
│ - dataSource: String            │
│ - validationType: String        │
│ - ruleLogic: String             │
│ - severity: String              │
├─────────────────────────────────┤
│ + execute(): ValidationResult   │
│ + validate(record): boolean     │
└────────────┬────────────────────┘
             │
             │ 1:N
             ↓
┌─────────────────────────────────┐
│   DataValidationExecution       │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - executionNumber: String       │
│ - rule: DataValidationRule      │
│ - executedBy: User              │
│ - totalRecords: int             │
│ - recordsPassed: int            │
│ - recordsFailed: int            │
│ - passRate: double              │
│ - executionStatus: String       │
├─────────────────────────────────┤
│ + calculatePassRate(): double   │
│ + createIssuesFromFailures()    │
└─────────────────────────────────┘
```

### **How to Draw Class Diagram:**
1. Draw rectangle for each class (3 sections)
2. Top section: Class name
3. Middle section: Attributes (- for private, + for public)
4. Bottom section: Methods
5. Draw lines showing relationships with cardinality

---

## 7️⃣ **DEPLOYMENT DIAGRAM**

### **Purpose:** Show physical infrastructure and servers

```
┌─────────────────────────────────────────────────────────┐
│                    Client Network                        │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  PC/Laptop │  │  PC/Laptop │  │  PC/Laptop │        │
│  │  Browser   │  │  Browser   │  │  Browser   │        │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘        │
│         │                │                │              │
└─────────┼────────────────┼────────────────┼──────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                      HTTPS (Port 443)
                           │
          ┌────────────────┼────────────────┐
          │                │                │
┌─────────▼────────────────▼────────────────▼──────────┐
│              RRA Server Infrastructure                │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │         Web Server (Nginx)                      │ │
│  │  - Serves React Frontend (Static Files)        │ │
│  │  - HTTPS/SSL Certificate                       │ │
│  │  - Reverse Proxy to Backend                    │ │
│  │  - Port: 443 (HTTPS), 80 (HTTP redirect)       │ │
│  └────────────────────┬────────────────────────────┘ │
│                       │                               │
│                       │ Proxy Pass                    │
│                       ↓                               │
│  ┌─────────────────────────────────────────────────┐ │
│  │    Application Server (Tomcat/Jetty)           │ │
│  │  - Spring Boot Backend (JAR file)              │ │
│  │  - REST API Endpoints                          │ │
│  │  - JWT Authentication                          │ │
│  │  - Business Logic                              │ │
│  │  - Port: 8080                                  │ │
│  │  - JVM: Java 17                                │ │
│  └────────────────────┬────────────────────────────┘ │
│                       │                               │
│                       │ JDBC Connection               │
│                       ↓                               │
│  ┌─────────────────────────────────────────────────┐ │
│  │      Database Server (PostgreSQL 14)           │ │
│  │  - 20 Tables                                   │ │
│  │  - Indexes, Views, Functions                  │ │
│  │  - Port: 5432                                  │ │
│  │  - Data Storage: /var/lib/postgresql          │ │
│  │  - Backup: Daily automated backups            │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
└───────────────────────────────────────────────────────┘
          │
          │ SMTP (Port 587)
          ↓
┌─────────────────────┐
│   Email Server      │
│  - Send notifications
│  - Gmail/Outlook    │
└─────────────────────┘

Server Specifications:
┌────────────────────────┐
│ OS: Ubuntu 20.04 LTS  │
│ CPU: 4 Cores          │
│ RAM: 8 GB             │
│ Storage: 50 GB SSD    │
│ Network: 100 Mbps     │
└────────────────────────┘
```

### **How to Draw:**
1. Draw rectangles for servers/nodes
2. Show communication lines between them
3. Label protocols (HTTP, JDBC, SMTP)
4. Add port numbers
5. Include server specifications

---

## 8️⃣ **DATA FLOW DIAGRAM (DFD)**

### **Purpose:** Show how data moves through the system

### **Level 0 DFD (Context Diagram):**

```
              ┌──────────┐
              │  ADMIN   │
              └────┬─────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼────┐ ┌──▼────┐ ┌───▼────┐
   │   HOD   │ │Secy   │ │Member  │
   └────┬────┘ └───┬───┘ └───┬────┘
        │          │          │
        └──────────┼──────────┘
                   │
        User Login, Issue Data, Reports
                   │
                   ↓
        ┌──────────────────────┐
        │                      │
        │      DQIMS           │
        │      SYSTEM          │
        │                      │
        └──────────┬───────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ↓          ↓          ↓
   ┌────────┐ ┌────────┐ ┌────────┐
   │Database│ │ Email  │ │External│
   │        │ │ Server │ │Systems │
   └────────┘ └────────┘ └────────┘
```

### **Level 1 DFD (Main Processes):**

```
Users → [1. Authentication] → User Data → Database
         ↓ (JWT Token)
Users → [2. Issue Management] → Issue Data → Database
         ↓ (Notifications)
         → Email Server

Users → [3. Data Validation] → Validation Results → Database
         ↓ (Auto Issues)
         → [2. Issue Management]

Users → [4. Reporting] → Report Data ← Database
         ↓
         → Excel/PDF Files

[2. Issue Management] → Audit Logs → Database
[3. Data Validation] → Audit Logs → Database
[4. Reporting] → Audit Logs → Database

Database → Dashboard Metrics → Users
```

### **How to Draw DFD:**
1. Use circles/ovals for processes
2. Use rectangles for external entities (users, systems)
3. Use open rectangles for data stores (database)
4. Use arrows for data flow with labels
5. Number processes (1.0, 2.0, etc.)

---

## 9️⃣ **USER INTERFACE FLOW DIAGRAM**

### **Purpose:** Show navigation between screens

```
                    ┌───────────────┐
                    │ Login Screen  │
                    │ - Email       │
                    │ - Password    │
                    │ - Role Select │
                    └───────┬───────┘
                            │
                     Login Success
                            ↓
                    ┌───────────────┐
                    │  Dashboard    │
                    │ - Metrics     │
                    │ - Charts      │
                    │ - Quick Actions
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ↓                   ↓                   ↓
┌──────────────┐  ┌──────────────────┐  ┌────────────────┐
│Issue Reporting│  │ Issue Tracking   │  │User Management│
│- Create Issue│  │ - View Issues    │  │(ADMIN Only)   │
│- Fill Form   │  │ - Filter/Search  │  │- Create User  │
│- Submit      │  │ - Update Status  │  │- Edit User    │
└──────┬───────┘  └────────┬─────────┘  └───────┬────────┘
       │                   │                     │
       │                   ↓                     │
       │          ┌──────────────────┐           │
       │          │ Issue Details    │           │
       │          │ - View Full Info │           │
       │          │ - Add Comments   │           │
       │          │ - Assign         │           │
       │          │ - Change Status  │           │
       │          └────────┬─────────┘           │
       │                   │                     │
       │                   ↓                     │
       │          ┌──────────────────┐           │
       │          │Root Cause Analysis│          │
       │          │- 5 Whys          │           │
       │          │- Fishbone        │           │
       │          └──────────────────┘           │
       │                                         │
       ↓                                         ↓
┌──────────────────┐                   ┌────────────────┐
│Data Validation   │                   │  Reports       │
│- Select Rule     │                   │- Select Type   │
│- Run Validation  │                   │- Set Filters   │
│- View Results    │                   │- Generate      │
│- Create Issues   │                   │- Export        │
└──────────────────┘                   └────────────────┘

All screens have:
- Header with RRA logo
- Notification bell
- User profile menu
- Department filter (except ADMIN)
- Logout button
```

### **How to Draw:**
1. Draw rectangles for each screen
2. List main features in each screen
3. Draw arrows showing navigation
4. Label arrows with actions (click, submit, etc.)
5. Use colors to group related screens

---

## 🔟 **SECURITY ARCHITECTURE DIAGRAM**

### **Purpose:** Show security layers and protections

```
┌─────────────────────────────────────────────────────────┐
│                   Security Layers                        │
│                                                          │
│  Layer 1: Network Security                              │
│  ┌────────────────────────────────────────────────┐    │
│  │ - HTTPS/SSL Encryption                         │    │
│  │ - Firewall Rules (Allow only 443, 80, 8080)    │    │
│  │ - DDoS Protection                              │    │
│  └────────────────────────────────────────────────┘    │
│                          ↓                              │
│  Layer 2: Authentication                                │
│  ┌────────────────────────────────────────────────┐    │
│  │ - JWT Token (256-bit)                          │    │
│  │ - Token Expiry (24 hours)                      │    │
│  │ - Refresh Token Mechanism                      │    │
│  │ - Force Password Change (First Login)          │    │
│  └────────────────────────────────────────────────┘    │
│                          ↓                              │
│  Layer 3: Authorization (Role-Based)                    │
│  ┌────────────────────────────────────────────────┐    │
│  │ Request → Check JWT → Extract Role             │    │
│  │ ┌──────────────────────────────────────┐       │    │
│  │ │ If ADMIN → Full Access               │       │    │
│  │ │ If HOD → Department Access           │       │    │
│  │ │ If Secretary → Department Read/Write │       │    │
│  │ │ If Member → Assigned Issues Only     │       │    │
│  │ └──────────────────────────────────────┘       │    │
│  │ Reject if unauthorized                         │    │
│  └────────────────────────────────────────────────┘    │
│                          ↓                              │
│  Layer 4: Data Security                                 │
│  ┌────────────────────────────────────────────────┐    │
│  │ - Password Hashing (BCrypt, 10 rounds)         │    │
│  │ - SQL Injection Prevention (Parameterized)     │    │
│  │ - XSS Protection (Input Sanitization)          │    │
│  │ - CORS Policy (Allow only frontend domain)     │    │
│  └────────────────────────────────────────────────┘    │
│                          ↓                              │
│  Layer 5: Audit & Monitoring                            │
│  ┌────────────────────────────────────────────────┐    │
│  │ - All Actions Logged                           │    │
│  │ - Failed Login Attempts Tracked                │    │
│  │ - IP Address Recording                         │    │
│  │ - Suspicious Activity Alerts                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘

Authentication Flow:
┌──────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│Login │────→│ Verify  │────→│ Generate │────→│ Return   │
│Creds │     │Password │     │ JWT Token│     │ Token    │
└──────┘     └─────────┘     └──────────┘     └──────────┘

Every API Request:
┌──────────┐     ┌─────────┐     ┌──────────┐
│ Extract  │────→│ Validate│────→│ Allow or │
│ JWT Token│     │ Token   │     │ Reject   │
└──────────┘     └─────────┘     └──────────┘
```

---

## 📚 **HOW TO USE THESE DIAGRAMS**

### **For Your Defense Presentation:**

1. **System Architecture** - Start here to show overall system design
2. **Use Case Diagram** - Explain what each user role can do
3. **ERD** - Show database design (table relationships)
4. **Sequence Diagrams** - Demonstrate 2-3 key workflows in detail
5. **Activity Diagram** - Show business process (issue resolution)
6. **Deployment Diagram** - Explain how system will be deployed

### **Tools to Draw Diagrams:**

#### **Free Online Tools:**
- **draw.io** (diagrams.net) - Best for all diagram types
- **Lucidchart** - Professional diagrams (free tier available)
- **PlantUML** - Code-based diagrams (good for technical diagrams)
- **Creately** - Easy drag-and-drop

#### **Desktop Tools:**
- **Microsoft Visio** - Professional tool (paid)
- **StarUML** - UML diagrams (free version available)
- **ArgoUML** - Free UML tool

#### **Quick Method:**
- Use **PowerPoint** or **Google Slides**
- Draw shapes (rectangles, ovals, arrows)
- Group related items
- Add colors for clarity

### **Tips for Drawing:**

1. **Keep it simple** - Don't overcrowd diagrams
2. **Use colors** - Different colors for different components
3. **Label everything** - Every arrow, box, and line
4. **Be consistent** - Use same symbols throughout
5. **Add legends** - Explain symbols at bottom of diagram
6. **Number items** - For sequence and ordering
7. **Use standard symbols** - UML, ERD, DFD standards

---

## ✅ **CHECKLIST - Diagrams You Must Have**

For a complete defense presentation:

- [ ] System Architecture Diagram (3-tier)
- [ ] Use Case Diagram (4 roles, all actions)
- [ ] Entity Relationship Diagram (20 tables)
- [ ] At least 3 Sequence Diagrams (login, create issue, assign)
- [ ] At least 1 Activity Diagram (issue resolution)
- [ ] Class Diagram (main classes)
- [ ] Deployment Diagram (servers and infrastructure)
- [ ] Security Architecture Diagram

**Total: 8-10 diagrams minimum**

---

## 🎯 **PRIORITY ORDER**

If you have limited time, create in this order:

1. **System Architecture** (Most important - shows overall design)
2. **ERD** (Critical - shows database)
3. **Use Case Diagram** (Shows functionality)
4. **Login Sequence Diagram** (Shows authentication flow)
5. **Issue Creation Sequence** (Shows main feature)
6. **Deployment Diagram** (Shows how it will run)

---

**Document Version:** 1.0  
**Created:** March 6, 2026  
**Purpose:** Final Year Project Defense - AUCA  
**Project:** DQIMS - Rwanda Revenue Authority
