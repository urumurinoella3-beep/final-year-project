# DQIMS Documentation Package

## Data Quality Issues Management System (DQIMS)
### Rwanda Revenue Authority (RRA)

---

## 📚 Documentation Overview

This documentation package contains comprehensive materials for the Data Quality Issues Management System, including PlantUML diagrams, database schema, and complete project documentation suitable for academic and technical purposes.

---

## 📁 Package Contents

### 1. **Project Overview** (`Project-Overview.md`)
Complete project documentation including:
- Executive summary
- System architecture
- User roles and permissions
- Core features detailed explanation
- Technology stack
- Security features
- Workflow processes
- System requirements

### 2. **Database Schema** (`Database-Schema.md`)
Comprehensive database documentation:
- All 10 database tables with field descriptions
- Entity relationships and foreign keys
- Indexes and constraints
- Sample data
- Performance optimization
- Backup and maintenance procedures

### 3. **PlantUML Diagrams** (`PlantUML/` folder)

#### Use Case Diagram
- **File:** `01-UseCase-Diagram.puml`
- **Description:** Complete system use cases showing all actors (Admin, HOD, Staff) and their interactions with the system
- **Actors:** Primary (Admin, HOD, Staff) and Secondary (Email System, Database, File System)

#### Activity Diagrams
- **File:** `00-Complete-System-Activity.puml` - **COMPLETE SYSTEM FLOW** (All workflows in one diagram)
- **File:** `02-Activity-IssueReporting.puml` - Issue reporting workflow
- **File:** `03-Activity-IssueAssignment.puml` - HOD assigns issues to staff
- **File:** `04-Activity-IssueResolution.puml` - Staff resolves issues
- **File:** `05-Activity-DataValidation.puml` - Data file validation process
- **File:** `06-Activity-UserManagement.puml` - Admin creates and manages users
- **File:** `07-Activity-Authentication.puml` - Login and password management

#### Class Diagram
- **File:** `08-Class-Diagram.puml`
- **Description:** Complete entity model showing:
  - **Primary Classes:** User, Issue, Department, Notification, AuditLog
  - **Secondary Classes:** IssueComment, IssueAttachment, PasswordHistory, ValidationSession, ValidationError
  - **Enumerations:** UserRole, IssueStatus, NotificationType
  - All relationships and cardinalities

#### Sequence Diagrams
- **File:** `09-Sequence-Login.puml` - User authentication process
- **File:** `10-Sequence-CreateUser.puml` - Admin creates new user with email
- **File:** `11-Sequence-ReportIssue.puml` - Staff/HOD reports new issue
- **File:** `12-Sequence-AssignIssue.puml` - HOD assigns issue to staff
- **File:** `13-Sequence-ResolveIssue.puml` - Staff marks issue as resolved
- **File:** `14-Sequence-CloseIssue.puml` - HOD closes or reopens issue
- **File:** `15-Sequence-DataValidation.puml` - Data file validation workflow
- **File:** `16-Sequence-GenerateReport.puml` - Generate and export reports

#### System Architecture Diagrams
- **File:** `17-System-Architecture.puml` - **DETAILED ARCHITECTURE** (Complete three-tier architecture with all components)
- **File:** `18-System-Architecture-Simple.puml` - **SIMPLIFIED ARCHITECTURE** (Easy-to-understand overview)
- **File:** `19-System-Architecture-C4.puml` - **C4 MODEL** (Industry-standard C4 architecture diagram)
- **File:** `20-Deployment-Architecture.puml` - **DEPLOYMENT DIAGRAM** (Server infrastructure and deployment setup)

---

## 🎯 How to Use This Documentation

### For Academic Writing (Thesis/Dissertation)

#### Chapter 1: Introduction
- Use **Project Overview** sections: Executive Summary, Problem Statement, Solution

#### Chapter 2: Literature Review
- Reference similar systems and technologies from **Technology Stack**

#### Chapter 3: System Analysis & Design
- **Use Case Diagram:** Show all system functionalities
- **Activity Diagrams:** Explain each business process
- **User Roles section:** Define actors and permissions

#### Chapter 4: System Design
- **Class Diagram:** Show entity model and relationships
- **Sequence Diagrams:** Explain system interactions
- **Database Schema:** Show data structure
- **System Architecture:** Explain three-tier architecture

#### Chapter 5: Implementation
- **Technology Stack:** List all technologies used
- **Security Features:** Explain authentication and authorization
- **Core Features:** Detail each feature implementation

#### Chapter 6: Testing & Results
- Use workflow processes to create test cases
- Reference system requirements for testing environment

---

### For Technical Documentation

#### System Documentation
1. **Architecture Document:** Use System Architecture section
2. **API Documentation:** Reference sequence diagrams for endpoints
3. **Database Documentation:** Use Database Schema document
4. **User Manual:** Use Core Features and Workflow Processes

#### Developer Onboarding
1. **Technology Stack:** Setup development environment
2. **Class Diagram:** Understand entity model
3. **Sequence Diagrams:** Understand system flows
4. **Database Schema:** Understand data structure

---

## 🖼️ Viewing PlantUML Diagrams

### Option 1: Online Viewer
1. Go to [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
2. Copy the content of any `.puml` file
3. Paste into the editor
4. View the rendered diagram

### Option 2: VS Code Extension
1. Install "PlantUML" extension in VS Code
2. Open any `.puml` file
3. Press `Alt+D` to preview
4. Export as PNG/SVG

### Option 3: IntelliJ IDEA Plugin
1. Install "PlantUML integration" plugin
2. Open any `.puml` file
3. View diagram in side panel
4. Export as image

### Option 4: Command Line
```bash
# Install PlantUML
sudo apt-get install plantuml

# Generate PNG from PUML file
plantuml diagram.puml

# Generate SVG
plantuml -tsvg diagram.puml
```

---

## 📊 Diagram Summary

### Total Diagrams: 21

| Diagram Type | Count | Purpose |
|-------------|-------|---------|
| Use Case | 1 | Show all system functionalities |
| Activity | 7 | Show business process workflows (including complete system flow) |
| Class | 1 | Show entity model and relationships |
| Sequence | 8 | Show system interactions and message flow |
| Architecture | 4 | Show system architecture and deployment |

### Diagram Coverage

✅ **Authentication & User Management**
- Login process
- Password reset
- User creation
- First login flow

✅ **Issue Management**
- Issue reporting
- Issue assignment
- Issue resolution
- Issue closure/reopening

✅ **Data Validation**
- File upload
- Validation process
- Error reporting

✅ **Reporting**
- Report generation
- Multiple export formats

---

## 🎓 Academic Use Guidelines

### For Thesis/Dissertation

**Recommended Structure:**

```
Chapter 3: System Analysis & Design
├── 3.1 System Overview
│   └── Use Case Diagram (01-UseCase-Diagram.puml)
├── 3.2 User Roles & Permissions
│   └── Table from Project-Overview.md
├── 3.3 Business Process Modeling
│   ├── 3.3.1 Issue Reporting (02-Activity-IssueReporting.puml)
│   ├── 3.3.2 Issue Assignment (03-Activity-IssueAssignment.puml)
│   ├── 3.3.3 Issue Resolution (04-Activity-IssueResolution.puml)
│   ├── 3.3.4 Data Validation (05-Activity-DataValidation.puml)
│   ├── 3.3.5 User Management (06-Activity-UserManagement.puml)
│   └── 3.3.6 Authentication (07-Activity-Authentication.puml)

Chapter 4: System Design
├── 4.1 System Architecture
│   └── Three-tier architecture diagram from Project-Overview.md
├── 4.2 Data Model
│   ├── Class Diagram (08-Class-Diagram.puml)
│   └── Database Schema (Database-Schema.md)
├── 4.3 System Interactions
│   ├── 4.3.1 Login Process (09-Sequence-Login.puml)
│   ├── 4.3.2 User Creation (10-Sequence-CreateUser.puml)
│   ├── 4.3.3 Report Issue (11-Sequence-ReportIssue.puml)
│   ├── 4.3.4 Assign Issue (12-Sequence-AssignIssue.puml)
│   ├── 4.3.5 Resolve Issue (13-Sequence-ResolveIssue.puml)
│   ├── 4.3.6 Close Issue (14-Sequence-CloseIssue.puml)
│   ├── 4.3.7 Data Validation (15-Sequence-DataValidation.puml)
│   └── 4.3.8 Generate Report (16-Sequence-GenerateReport.puml)
└── 4.4 Security Design
    └── Security Features from Project-Overview.md
```

### Citation Format

**For Diagrams:**
```
Figure X.X: [Diagram Title]
Source: DQIMS System Design Documentation, 2024
```

**For Tables:**
```
Table X.X: [Table Title]
Source: DQIMS Database Schema Documentation, 2024
```

---

## 🔧 Technical Specifications

### System Components

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- jsPDF, xlsx, docx for exports

**Backend:**
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- JavaMail for email

**Database:**
- MySQL 8.0
- 10 tables
- 14 relationships
- Optimized indexes

**Security:**
- JWT authentication
- BCrypt password hashing
- Role-based access control
- Audit logging

---

## 📈 System Metrics

**Database Statistics:**
- **Tables:** 10
- **Relationships:** 14
- **Estimated Annual Storage:** ~50 GB (including files)

**Expected Usage:**
- **Users:** 100+
- **Issues per Month:** 500-1000
- **Departments:** 5-10
- **Concurrent Users:** 50+

---

## 🎨 Diagram Color Coding

### Activity Diagrams
- **Issue Reporting:** Green (#E8F5E9)
- **Issue Assignment:** Orange (#FFF3E0)
- **Issue Resolution:** Blue (#E3F2FD)
- **Data Validation:** Purple (#F3E5F5)
- **User Management:** Red (#FFEBEE)
- **Authentication:** Light Blue (#E1F5FE)

### Class Diagram
- **Primary Classes:** Light Yellow (#FFFEF7)
- **Enumerations:** Light Green (#E8F5E9)

---

## 📞 Contact Information

**Project:** Data Quality Issues Management System (DQIMS)  
**Organization:** Rwanda Revenue Authority (RRA)  
**Email:** urumurinoella3@gmail.com  
**Year:** 2024

---

## 📝 Document Versions

| Document | Version | Last Updated |
|----------|---------|--------------|
| README.md | 1.0 | 2024 |
| Project-Overview.md | 1.0 | 2024 |
| Database-Schema.md | 1.0 | 2024 |
| All PlantUML Diagrams | 1.0 | 2024 |

---

## ✅ Checklist for Book Writing

### Chapter 1: Introduction
- [ ] Copy Executive Summary
- [ ] Copy Problem Statement
- [ ] Copy Solution Overview
- [ ] Copy Project Scope

### Chapter 2: Literature Review
- [ ] Reference Technology Stack
- [ ] Compare with similar systems
- [ ] Cite relevant research

### Chapter 3: System Analysis
- [ ] Insert Use Case Diagram
- [ ] Explain each use case
- [ ] Insert Activity Diagrams
- [ ] Explain each workflow
- [ ] Copy User Roles table

### Chapter 4: System Design
- [ ] Insert System Architecture diagram
- [ ] Insert Class Diagram
- [ ] Explain entity relationships
- [ ] Insert all Sequence Diagrams
- [ ] Explain each interaction
- [ ] Copy Database Schema tables
- [ ] Explain security design

### Chapter 5: Implementation
- [ ] Copy Technology Stack
- [ ] Explain each technology choice
- [ ] Show code snippets (from actual project)
- [ ] Explain key features

### Chapter 6: Testing
- [ ] Create test cases from workflows
- [ ] Show test results
- [ ] Include screenshots

### Chapter 7: Conclusion
- [ ] Summarize achievements
- [ ] Copy Future Enhancements
- [ ] Lessons learned

---

## 🎯 Quick Start Guide

### For Students Writing Thesis:
1. Read `Project-Overview.md` completely
2. View all PlantUML diagrams in order (01-16)
3. Study `Database-Schema.md`
4. Create your chapter outline
5. Insert diagrams and tables as needed
6. Add explanations in your own words

### For Developers:
1. Review `Project-Overview.md` - System Architecture
2. Study `08-Class-Diagram.puml` - Entity model
3. Review all Sequence Diagrams - API flows
4. Study `Database-Schema.md` - Data structure
5. Set up development environment using Technology Stack

### For Project Managers:
1. Read Executive Summary in `Project-Overview.md`
2. Review Use Case Diagram - System capabilities
3. Review Activity Diagrams - Business processes
4. Check System Requirements
5. Review Future Enhancements

---

## 📚 Additional Resources

### PlantUML Resources
- [PlantUML Official Documentation](https://plantuml.com/)
- [PlantUML Cheat Sheet](https://plantuml.com/guide)
- [Real World PlantUML](https://real-world-plantuml.com/)

### UML Resources
- [UML Diagrams Guide](https://www.uml-diagrams.org/)
- [UML Best Practices](https://www.visual-paradigm.com/guide/uml-unified-modeling-language/)

### Academic Writing
- [How to Write Technical Documentation](https://www.writethedocs.org/guide/)
- [Thesis Writing Guide](https://www.scribbr.com/category/dissertation/)

---

**End of Documentation Package**

For questions or clarifications, please contact: urumurinoella3@gmail.com

---

© 2024 Rwanda Revenue Authority (RRA) - Data Quality Issues Management System
