# DQIMS Use Case Diagram - Complete Guide

## 📋 Overview

This document explains the **Data Quality Issues Management System (DQIMS)** use case diagram, detailing all actors, use cases, and system interactions.

---

## 👥 System Actors

### 1. **Staff Member (User)** 🔵
**Role**: Front-line user who identifies and reports data quality issues

**Primary Responsibilities**:
- Report data quality issues discovered in daily work
- Upload data files for validation
- Track progress of reported issues
- View personal dashboard and statistics
- Receive notifications about issue updates

**Access Level**: Basic user with limited permissions to their own data and department

---

### 2. **HOD (Head of Department)** 🟢
**Role**: Department manager responsible for overseeing issue resolution

**Primary Responsibilities**:
- Review and prioritize department issues
- Assign issues to appropriate staff members
- Monitor department performance and statistics
- Generate reports for management review
- Close resolved issues after verification
- Manage department staff directory

**Access Level**: Department-level access with management capabilities

---

### 3. **System Administrator** 🟠
**Role**: Platform administrator with full system access

**Primary Responsibilities**:
- Manage all user accounts and permissions
- Create and configure departments
- Assign user roles (Staff, HOD, Admin)
- Monitor system-wide analytics and performance
- Access all audit logs and system activities
- Handle system configuration and maintenance

**Access Level**: Full system access across all departments and features

---

## 📦 System Packages (Feature Groups)

### **Package 1: Account Management** 🔐
*User authentication and profile management*

| Use Case | Description | Who Can Use |
|----------|-------------|-------------|
| **Register** | Create a new account in the system | Staff (new users) |
| **Login** | Authenticate and access the system | All users |
| **Update Profile** | Modify personal information | All users |
| **Change Password** | Update account password for security | All users |

**Flow**: Register → Login → Use System Features

---

### **Package 2: Issue Management** 📋
*Core functionality for tracking data quality issues*

| Use Case | Description | Who Can Use |
|----------|-------------|-------------|
| **Report Issue** | Create a new data quality issue with details | Staff |
| **View Issues** | Browse and search existing issues | All users |
| **Update Issue Status** | Change issue status (Open, In Progress, Resolved) | HOD |
| **Assign to Staff** | Assign issue to a staff member for resolution | HOD |
| **Add Comments** | Add notes and updates to an issue | Staff, HOD |
| **Close Issue** | Mark issue as closed after verification | HOD |

**Flow**: Report → Assign → Work On → Resolve → Close

**Dependencies**:
- Reporting an issue automatically triggers notifications
- Assigning an issue sends notification to assigned staff
- Closing an issue creates audit log entry

---

### **Package 3: Data Validation** ✅
*File upload and data quality checking*

| Use Case | Description | Who Can Use |
|----------|-------------|-------------|
| **Upload CSV/Excel File** | Upload data files for quality checking | Staff |
| **Validate Data Quality** | Automatically check data against rules | System (triggered) |
| **View Validation Results** | See errors, warnings, and issues found | Staff |
| **Export Error Report** | Download validation results as report | Staff |

**Flow**: Upload File → System Validates → View Results → Export (optional)

**Dependencies**:
- Upload **requires** validation to run
- Validation **produces** results automatically
- Results can be exported for documentation

---

### **Package 4: Reports & Analytics** 📊
*Dashboard, statistics, and report generation*

| Use Case | Description | Who Can Use |
|----------|-------------|-------------|
| **View Dashboard** | See overview statistics and charts | All users |
| **Generate PDF Report** | Create formatted PDF report | HOD, Admin |
| **Generate Excel Report** | Create detailed Excel workbook | HOD, Admin |
| **Filter by Date/Time** | Select custom date/time range for reports | HOD, Admin |
| **View Statistics** | See detailed breakdowns by status, priority, dept | HOD, Admin |
| **View Audit Logs** | Access system activity history | HOD, Admin |

**Flow**: Select Filters → Generate Report → Download

**Dependencies**:
- PDF and Excel reports **use** date/time filtering
- Reports include data from current filters
- Audit logs track all report generation

**Key Feature**: **Precise Date/Time Filtering** ⏰
- Select exact start date and time (down to the minute)
- Select exact end date and time
- Reports include only data within the specified range
- Timestamps are displayed in report metadata

---

### **Package 5: Department Management** 🏢
*Department organization and staff oversight*

| Use Case | Description | Who Can Use |
|----------|-------------|-------------|
| **Manage Departments** | Create, update, or remove departments | Admin |
| **View Staff Directory** | See all staff in a department | HOD |
| **View Department Issues** | See all issues for a specific department | HOD |

**Flow**: Create Department → Add Staff → Assign Issues → Monitor

**HOD Capability**: HODs can only view staff in their own department

---

### **Package 6: User Administration** 👤
*System user management and permissions*

| Use Case | Description | Who Can Use |
|----------|-------------|-------------|
| **Create User** | Add new user to the system | Admin |
| **Manage User Accounts** | Update or deactivate user accounts | Admin |
| **Assign Roles** | Set user role (Staff, HOD, Admin) | Admin |
| **View Analytics** | See platform-wide usage statistics | Admin |

**Flow**: Create User → Assign Role → Assign Department → User Can Login

**Security**: Only administrators can create users and assign roles

---

### **Package 7: Notifications** 🔔
*Real-time alerts and updates*

| Use Case | Description | Who Can Use |
|----------|-------------|-------------|
| **Receive Notifications** | Get alerts when actions affect the user | All users |
| **Mark as Read** | Acknowledge a notification | All users |
| **View All Notifications** | See notification history | All users |

**Triggers**: Notifications are automatically sent when:
- An issue is reported
- An issue is assigned to you
- An issue status changes
- Comments are added to your issues
- Deadlines are approaching

---

## 🔗 Use Case Relationships

### **<<requires>>** - Prerequisite Dependency
**Example**: Upload File **<<requires>>** Validate Data
- The validation use case cannot execute without first uploading a file
- The system enforces this sequence

### **<<triggers>>** - Automatic Initiation
**Example**: Report Issue **<<triggers>>** Receive Notification
- When an issue is reported, notifications are automatically sent
- No manual action needed to trigger notification

### **<<uses>>** - Utilizes Feature
**Example**: Generate PDF **<<uses>>** Filter by Date/Time
- PDF generation uses the date/time filtering feature
- Filtering enhances the report functionality

### **<<produces>>** - Creates Output
**Example**: Validate Data **<<produces>>** View Results
- Data validation automatically produces results
- Results become available for viewing

### **<<logs>>** - Records Activity
**Example**: Close Issue **<<logs>>** View Audit Logs
- Closing an issue creates an entry in audit logs
- Creates permanent record of the action

---

## 🔄 Complete System Flows

### **Flow 1: Issue Lifecycle** (Most Common)
```
1. Staff Member reports data quality issue
   ↓ (System creates issue record)
2. HOD receives notification
   ↓ (HOD reviews issue details)
3. HOD assigns issue to staff member
   ↓ (Staff receives notification)
4. Staff works on resolving the issue
   ↓ (Staff updates status and adds comments)
5. Staff marks issue as resolved
   ↓ (HOD receives notification)
6. HOD reviews and closes issue
   ↓ (System creates audit log)
7. Issue complete - tracked in history
```

### **Flow 2: Data Validation** (File Upload)
```
1. Staff uploads CSV or Excel file
   ↓ (System receives file)
2. System automatically validates data
   ↓ (Checks for errors, duplicates, missing data)
3. Validation results generated
   ↓ (Shows errors, warnings, success count)
4. Staff reviews validation results
   ↓ (Identifies issues to fix)
5. Staff exports error report (optional)
   ↓ (Downloads detailed report)
6. Staff fixes data and re-uploads if needed
```

### **Flow 3: Report Generation** (Management Review)
```
1. HOD selects report filters
   ↓ (Department, date range, status)
2. HOD sets custom date/time range
   ↓ (Start: Jan 15, 2024 9:30 AM)
   ↓ (End: Mar 20, 2024 5:45 PM)
3. HOD chooses report format (PDF or Excel)
   ↓ (System filters data by criteria)
4. System generates report
   ↓ (Includes summary, statistics, issue list, audit log)
5. Report downloads to HOD's computer
   ↓ (HOD reviews and shares with management)
6. Report used for decision-making
```

### **Flow 4: User Onboarding** (New Employee)
```
1. Admin creates new user account
   ↓ (Enters name, email, employee ID)
2. Admin assigns role and department
   ↓ (Role: Staff, Department: Finance)
3. System sends welcome email
   ↓ (Includes temporary password)
4. New user logs in for first time
   ↓ (System prompts password change)
5. User updates profile information
   ↓ (Phone number, preferences)
6. User can now use system features
```

---

## 📊 User Capability Matrix

| Feature | Staff | HOD | Admin |
|---------|:-----:|:---:|:-----:|
| Register & Login | ✅ | ✅ | ✅ |
| Report Issues | ✅ | ❌ | ❌ |
| View Own Issues | ✅ | ✅ | ✅ |
| View Department Issues | ❌ | ✅ | ✅ |
| View All Issues | ❌ | ❌ | ✅ |
| Assign Issues | ❌ | ✅ | ❌ |
| Close Issues | ❌ | ✅ | ❌ |
| Upload Data Files | ✅ | ✅ | ❌ |
| Generate Reports | ❌ | ✅ | ✅ |
| Custom Date/Time Filter | ❌ | ✅ | ✅ |
| View Audit Logs | ❌ | ✅ | ✅ |
| Manage Departments | ❌ | ❌ | ✅ |
| Create Users | ❌ | ❌ | ✅ |
| Assign Roles | ❌ | ❌ | ✅ |
| View Staff Directory | ❌ | ✅* | ✅ |
| System Analytics | ❌ | ❌ | ✅ |

*HOD can only view staff in their own department

---

## 🎯 Key System Features

### 1. **Role-Based Access Control (RBAC)**
- Users can only access features appropriate to their role
- HODs have department-level permissions
- Admins have system-wide access
- Enforced at both frontend and backend

### 2. **Real-Time Notifications**
- Instant alerts when actions affect you
- Notification bell icon shows unread count
- Mark individual or all notifications as read
- Helps users stay informed without constantly checking

### 3. **Comprehensive Audit Trail**
- Every action is logged with timestamp
- Shows who did what and when
- Cannot be modified or deleted
- Essential for compliance and accountability

### 4. **Precise Date/Time Filtering** ⭐ NEW
- Select exact start and end date/time for reports
- Minute-level precision (e.g., 9:30 AM)
- Inclusive boundaries (data at exact times included)
- Visual confirmation of active filters
- Displayed in report metadata

### 5. **Department Isolation**
- HODs only see their department data
- Staff only see their own issues
- Admins see everything
- Prevents data leakage between departments

### 6. **Data Validation Engine**
- Automatically checks uploaded files
- Identifies errors, duplicates, missing data
- Provides detailed error reports
- Helps maintain data quality standards

---

## 💡 Use Case Scenarios

### **Scenario 1: Urgent Tax Data Issue**
**Context**: Finance staff discovers incorrect tax calculations

1. **Sarah (Staff)** finds calculation errors in tax returns
2. Sarah reports issue: "Incorrect Tax Calculation for Import Duties"
3. System notifies **Jean (HOD of Finance)**
4. Jean reviews issue, assigns to **John (Staff)**
5. John receives notification, investigates the problem
6. John adds comment: "Root cause identified - wrong duty rate"
7. John updates status to "Resolved"
8. Jean receives notification, verifies fix
9. Jean closes issue, system logs all actions
10. Issue tracked in audit trail for compliance

**Outcome**: Issue resolved in 2 days, proper documentation maintained

---

### **Scenario 2: Monthly Report for Management**
**Context**: HOD needs to prepare monthly performance report

1. **David (HOD of Customs)** needs March 2024 report
2. David navigates to Reports & Analytics
3. David selects "Custom Date/Time" mode
4. Sets start: March 1, 2024, 12:00 AM
5. Sets end: March 31, 2024, 11:59 PM
6. Reviews statistics (50 issues, 45 resolved)
7. Clicks "Generate Excel Report"
8. Downloads report with detailed data
9. Report shows custom date range in metadata
10. David shares report with Director

**Outcome**: Professional report generated in minutes, not hours

---

### **Scenario 3: New Employee Onboarding**
**Context**: New staff member joins HR department

1. **Admin** receives request to add new employee
2. Admin creates account: "Betty Mukandori"
3. Admin assigns role: "Staff"
4. Admin assigns department: "HR"
5. System sends welcome email to Betty
6. **Betty** logs in with temporary password
7. System prompts Betty to change password
8. Betty updates her profile with phone number
9. Betty can now report issues and use system
10. HOD can assign issues to Betty

**Outcome**: New user productive on day one

---

## 📈 System Benefits

### **For Staff Members**:
- ✅ Easy issue reporting with clear forms
- ✅ Track issue progress in real-time
- ✅ Receive notifications about updates
- ✅ Upload files for instant validation
- ✅ View personal dashboard statistics

### **For HODs**:
- ✅ Complete visibility into department issues
- ✅ Assign work efficiently to team members
- ✅ Generate reports with custom date/time filters
- ✅ Monitor team performance and workload
- ✅ Access audit trail for accountability

### **For Administrators**:
- ✅ Centralized user management
- ✅ System-wide analytics and insights
- ✅ Complete audit trail access
- ✅ Easy role and permission management
- ✅ Department configuration and oversight

### **For RRA Organization**:
- ✅ Improved data quality across all departments
- ✅ Faster issue resolution times
- ✅ Better compliance and documentation
- ✅ Informed decision-making with reports
- ✅ Reduced manual tracking and paperwork

---

## 🔒 Security Considerations

1. **Authentication**: All users must log in with credentials
2. **Authorization**: Role-based access control enforced
3. **Audit Logging**: All actions tracked and timestamped
4. **Data Isolation**: Users only see permitted data
5. **Password Security**: Password change required at intervals
6. **Session Management**: Automatic logout after inactivity

---

## 📝 Summary

The DQIMS use case diagram shows:
- **3 Actor Types**: Staff, HOD, Admin
- **7 Feature Packages**: Account, Issues, Validation, Reports, Department, Users, Notifications
- **30+ Use Cases**: Covering all system functionality
- **Multiple Relationships**: Dependencies, triggers, and data flows
- **Clear Flows**: Issue lifecycle, validation, reporting, onboarding

This system provides a comprehensive solution for managing data quality issues at RRA, with role-appropriate features for each user type and strong audit capabilities.

---

**Document Version**: 1.0  
**Last Updated**: February 2024  
**System**: DQIMS (Data Quality Issues Management System)  
**Organization**: Rwanda Revenue Authority (RRA)
