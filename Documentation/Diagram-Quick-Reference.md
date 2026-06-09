# DQIMS Diagrams Quick Reference Guide

## 📊 All Diagrams at a Glance

### Total: 21 PlantUML Diagrams

---

## 🎯 Use Case Diagram (1)

| # | File | Purpose | Use in Thesis |
|---|------|---------|---------------|
| 01 | `01-UseCase-Diagram.puml` | Shows all system functionalities, actors, and use cases | Chapter 3: System Analysis |

**Shows:** Admin, HOD, Staff roles and all 45+ use cases organized by feature packages

---

## 🔄 Activity Diagrams (7)

| # | File | Purpose | Use in Thesis |
|---|------|---------|---------------|
| 00 | `00-Complete-System-Activity.puml` | **COMPLETE SYSTEM FLOW** - All workflows in one diagram | Chapter 3 or 4: Main activity diagram |
| 02 | `02-Activity-IssueReporting.puml` | Issue reporting workflow | Chapter 3: Business Process - Issue Reporting |
| 03 | `03-Activity-IssueAssignment.puml` | HOD assigns issues to staff | Chapter 3: Business Process - Assignment |
| 04 | `04-Activity-IssueResolution.puml` | Staff resolves issues | Chapter 3: Business Process - Resolution |
| 05 | `05-Activity-DataValidation.puml` | Data file validation process | Chapter 3: Business Process - Validation |
| 06 | `06-Activity-UserManagement.puml` | Admin creates and manages users | Chapter 3: Business Process - User Mgmt |
| 07 | `07-Activity-Authentication.puml` | Login and password management | Chapter 3: Business Process - Authentication |

**Recommendation:** Use diagram 00 as the main activity diagram, others as detailed workflows

---

## 📦 Class Diagram (1)

| # | File | Purpose | Use in Thesis |
|---|------|---------|---------------|
| 08 | `08-Class-Diagram.puml` | Complete entity model with relationships | Chapter 4: System Design - Data Model |

**Shows:** 
- Primary Classes: User, Issue, Department, Notification, AuditLog
- Secondary Classes: IssueComment, IssueAttachment, PasswordHistory, ValidationSession, ValidationError
- Enumerations: UserRole, IssueStatus, NotificationType
- All relationships and cardinalities

---

## 🔀 Sequence Diagrams (8)

| # | File | Purpose | Use in Thesis |
|---|------|---------|---------------|
| 09 | `09-Sequence-Login.puml` | User authentication process | Chapter 4: System Interactions - Authentication |
| 10 | `10-Sequence-CreateUser.puml` | Admin creates new user with email | Chapter 4: System Interactions - User Creation |
| 11 | `11-Sequence-ReportIssue.puml` | Staff/HOD reports new issue | Chapter 4: System Interactions - Issue Reporting |
| 12 | `12-Sequence-AssignIssue.puml` | HOD assigns issue to staff | Chapter 4: System Interactions - Assignment |
| 13 | `13-Sequence-ResolveIssue.puml` | Staff marks issue as resolved | Chapter 4: System Interactions - Resolution |
| 14 | `14-Sequence-CloseIssue.puml` | HOD closes or reopens issue | Chapter 4: System Interactions - Closure |
| 15 | `15-Sequence-DataValidation.puml` | Data file validation workflow | Chapter 4: System Interactions - Validation |
| 16 | `16-Sequence-GenerateReport.puml` | Generate and export reports | Chapter 4: System Interactions - Reporting |

**Shows:** Complete message flow between frontend, backend, database, and external services

---

## 🏗️ Architecture Diagrams (4)

| # | File | Purpose | Use in Thesis |
|---|------|---------|---------------|
| 17 | `17-System-Architecture.puml` | **DETAILED** - Complete three-tier architecture | Chapter 4: System Architecture (Main) |
| 18 | `18-System-Architecture-Simple.puml` | **SIMPLIFIED** - Easy overview | Chapter 1 or 3: Architecture Overview |
| 19 | `19-System-Architecture-C4.puml` | **C4 MODEL** - Industry standard | Chapter 4: System Architecture (Alternative) |
| 20 | `20-Deployment-Architecture.puml` | **DEPLOYMENT** - Infrastructure setup | Chapter 4 or 5: Deployment Architecture |

**Recommendation:** 
- Use diagram 18 for introduction/overview
- Use diagram 19 (C4) for main architecture (academic credibility)
- Use diagram 17 for detailed technical documentation
- Use diagram 20 for deployment chapter

---

## 📚 Recommended Thesis Structure

### Chapter 1: Introduction
- **Diagram 18** - Simplified architecture overview

### Chapter 3: System Analysis & Design
- **Diagram 01** - Use Case Diagram (all functionalities)
- **Diagram 00** - Complete System Activity (main workflow)
- **Diagrams 02-07** - Detailed activity diagrams (optional, if space allows)

### Chapter 4: System Design

**Section 4.1: System Architecture**
- **Diagram 19** - C4 Model Architecture (recommended for academic credibility)
- OR **Diagram 17** - Detailed Architecture (if you want more technical detail)

**Section 4.2: Data Model**
- **Diagram 08** - Class Diagram
- **Database-Schema.md** - Database tables documentation

**Section 4.3: System Interactions**
- **Diagrams 09-16** - All sequence diagrams (choose 3-5 most important)
- Recommended: 09 (Login), 11 (Report Issue), 13 (Resolve Issue), 16 (Generate Report)

**Section 4.4: Deployment Architecture**
- **Diagram 20** - Deployment Architecture

### Chapter 5: Implementation
- Reference **Diagram 17** for technology stack
- Reference **Diagram 20** for deployment setup

---

## 🎨 Diagram Color Coding

### Activity Diagrams
- **Complete System:** Gray with role-based colors
- **Issue Reporting:** Green (#E8F5E9)
- **Issue Assignment:** Orange (#FFF3E0)
- **Issue Resolution:** Blue (#E3F2FD)
- **Data Validation:** Purple (#F3E5F5)
- **User Management:** Red (#FFEBEE)
- **Authentication:** Light Blue (#E1F5FE)

### Architecture Diagrams
- **Frontend Layer:** Blue (#E3F2FD)
- **Backend Layer:** Green (#E8F5E9)
- **Database Layer:** Orange (#FFF3E0)
- **External Systems:** Purple (#F3E5F5)

---

## 🔍 Quick Selection Guide

### "I need a diagram for..."

**...showing what the system does**
→ Use Diagram 01 (Use Case)

**...showing how the system works (workflow)**
→ Use Diagram 00 (Complete Activity) for overview
→ Use Diagrams 02-07 for specific workflows

**...showing the data structure**
→ Use Diagram 08 (Class Diagram)
→ Use Database-Schema.md for tables

**...showing system interactions**
→ Use Diagrams 09-16 (Sequence Diagrams)

**...showing system architecture**
→ Use Diagram 19 (C4 Model) for academic work
→ Use Diagram 18 (Simple) for presentations
→ Use Diagram 17 (Detailed) for technical docs

**...showing deployment setup**
→ Use Diagram 20 (Deployment)

---

## 📏 Diagram Complexity Levels

### Simple (Good for presentations)
- Diagram 18 - Simplified Architecture
- Diagram 01 - Use Case (with legend)

### Medium (Good for overview)
- Diagram 00 - Complete Activity
- Diagram 19 - C4 Architecture
- Diagram 08 - Class Diagram

### Detailed (Good for technical documentation)
- Diagram 17 - Detailed Architecture
- Diagrams 02-07 - Individual Activity Diagrams
- Diagrams 09-16 - Sequence Diagrams
- Diagram 20 - Deployment Architecture

---

## 🎯 Priority Diagrams for Thesis

### Must Have (Top 5)
1. **Diagram 01** - Use Case (shows all features)
2. **Diagram 19** - C4 Architecture (industry standard)
3. **Diagram 08** - Class Diagram (data model)
4. **Diagram 00** - Complete Activity (main workflow)
5. **Diagram 09** - Login Sequence (authentication)

### Should Have (Next 5)
6. **Diagram 11** - Report Issue Sequence
7. **Diagram 13** - Resolve Issue Sequence
8. **Diagram 20** - Deployment Architecture
9. **Diagram 02** - Issue Reporting Activity
10. **Diagram 04** - Issue Resolution Activity

### Nice to Have (Optional)
- Remaining activity diagrams (03, 05, 06, 07)
- Remaining sequence diagrams (10, 12, 14, 15, 16)
- Diagram 17 - Detailed Architecture (if space allows)
- Diagram 18 - Simple Architecture (for introduction)

---

## 📊 Diagram Statistics

| Category | Count | Total Lines of Code |
|----------|-------|---------------------|
| Use Case | 1 | ~200 lines |
| Activity | 7 | ~1,500 lines |
| Class | 1 | ~300 lines |
| Sequence | 8 | ~2,000 lines |
| Architecture | 4 | ~800 lines |
| **TOTAL** | **21** | **~4,800 lines** |

---

## 🖼️ How to Export for Thesis

### Method 1: Online (Quick)
```
1. Go to http://www.plantuml.com/plantuml/uml/
2. Copy .puml file content
3. Paste and view
4. Right-click → Save image as PNG
```

### Method 2: VS Code (Best Quality)
```
1. Install "PlantUML" extension
2. Open .puml file
3. Press Alt+D to preview
4. Click export icon
5. Choose PNG or SVG
6. SVG recommended for thesis (scalable)
```

### Method 3: Command Line (Batch Export)
```bash
# Export all diagrams as PNG
plantuml Documentation/PlantUML/*.puml

# Export as SVG (better quality)
plantuml -tsvg Documentation/PlantUML/*.puml

# Export specific diagram
plantuml Documentation/PlantUML/01-UseCase-Diagram.puml
```

---

## 📝 Citation Format

### For Figures in Thesis
```
Figure 4.1: DQIMS System Architecture (C4 Model)
Source: Author's Design, 2024
```

### For Multiple Diagrams
```
Figure 4.2: DQIMS Use Case Diagram
Figure 4.3: DQIMS Complete System Activity Diagram
Figure 4.4: DQIMS Class Diagram
Figure 4.5: DQIMS Login Sequence Diagram
Source: Author's Design, 2024
```

---

## ✅ Quality Checklist

Before using diagrams in thesis:

- [ ] All diagrams render correctly
- [ ] Text is readable (not too small)
- [ ] Colors are distinguishable (if printing in black & white)
- [ ] Legends are included where needed
- [ ] Diagram titles are clear
- [ ] All actors/components are labeled
- [ ] Relationships are clearly shown
- [ ] Notes provide additional context
- [ ] Diagrams are exported in high quality (SVG or high-res PNG)
- [ ] Figure numbers and captions are added

---

## 🔗 Related Documentation

- **README.md** - Master documentation guide
- **Project-Overview.md** - Complete project documentation
- **Database-Schema.md** - Database tables documentation
- **Architecture-Guide.md** - Detailed architecture explanation

---

## 💡 Tips for Thesis Writing

1. **Don't include all diagrams** - Choose the most relevant ones
2. **Explain each diagram** - Don't just insert images
3. **Reference diagrams in text** - "As shown in Figure 4.1..."
4. **Use consistent numbering** - Figure 4.1, 4.2, 4.3, etc.
5. **Add captions** - Brief description under each diagram
6. **Use high quality exports** - SVG preferred, or high-res PNG
7. **Consider page layout** - Some diagrams may need landscape orientation
8. **Group related diagrams** - All sequence diagrams in one section
9. **Provide context** - Explain why each diagram is important
10. **Keep it readable** - If diagram is too complex, simplify or split it

---

## 📞 Support

For questions about diagrams:
- Check **Architecture-Guide.md** for detailed explanations
- Check **README.md** for general guidance
- Review PlantUML documentation: https://plantuml.com/

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Total Diagrams:** 21  
**Total Documentation Pages:** 100+
