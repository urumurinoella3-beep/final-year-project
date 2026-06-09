# DQIMS Activity Diagrams - Complete Guide
## All Major Workflows for Rwanda Revenue Authority

**Version:** 1.0  
**Date:** March 6, 2026  
**Created For:** DQIMS Final Year Project Defense - AUCA

---

## 📋 **TABLE OF CONTENTS**

1. [What are Activity Diagrams?](#what-are-activity-diagrams)
2. [All 6 Activity Diagrams Created](#all-diagrams)
3. [How to Generate Diagrams](#how-to-generate)
4. [Which Diagram to Use When](#which-diagram-to-use)
5. [How to Present in Defense](#defense-presentation)
6. [Printing Guide](#printing-guide)

---

## 1. WHAT ARE ACTIVITY DIAGRAMS?

### **Definition**

Activity diagrams are UML diagrams that show the **flow of activities** in a system. They're like detailed flowcharts showing:
- What happens step by step
- Who does what (actors/swimlanes)
- Decision points (if/else)
- Parallel activities (fork/join)
- Start and end points

### **Why Use Activity Diagrams?**

✅ **Show workflows** - How processes flow from start to finish  
✅ **Show actors** - Who is involved at each step  
✅ **Show decisions** - What happens in different scenarios  
✅ **Show parallel actions** - What happens simultaneously  
✅ **Easy to understand** - Visual representation of complex logic  

### **For Your Defense**

Activity diagrams help you:
- Explain how the system works
- Show user interactions
- Demonstrate business logic
- Prove you understand the workflows
- Answer "How does X work?" questions

---

## 2. ALL 6 ACTIVITY DIAGRAMS CREATED

### **Diagram 1: User Login & Authentication** 🔐

**File:** `ACTIVITY_DIAGRAM_LOGIN.puml`

**What it shows:**
- Complete login flow
- Role selection (ADMIN/HOD/SECRETARY/MEMBER)
- Email and password validation
- Account status checks (active/inactive)
- Failed login handling (max 3 attempts)
- Account lockout (after 3 failures)
- First-time password change requirement
- JWT token generation
- Redirect to dashboard

**Key Features:**
- ✅ Role-based authentication
- ✅ Password complexity validation
- ✅ BCrypt password hashing
- ✅ JWT token structure
- ✅ Audit logging
- ✅ Security best practices

**Actors:**
- User (login)
- System (validation, token generation)

**Use in defense when explaining:**
- "How do users login?"
- "How is security implemented?"
- "What happens on first login?"

---

### **Diagram 2: Issue Creation & Assignment** 📝

**File:** `ACTIVITY_DIAGRAM_ISSUE_CREATION.puml`

**What it shows:**
- Issue creation form
- Form validation
- Auto-generation of issue number (ISS-2026-NNNN)
- SLA calculation based on severity
- File attachment handling
- Notification to HOD
- HOD assignment to team member
- Email notification to assigned member
- Complete audit trail

**Key Features:**
- ✅ Auto issue numbering
- ✅ SLA auto-calculation
- ✅ File attachments
- ✅ Role-based assignment (only HOD can assign)
- ✅ Email notifications
- ✅ Audit logging

**Actors:**
- Reporter (HOD/Secretary) - creates issue
- System - validates and processes
- Notification Service - sends alerts
- Assigned Member - receives and works on issue

**Use in defense when explaining:**
- "How are issues created?"
- "How is SLA calculated?"
- "How are issues assigned?"
- "What notifications are sent?"

---

### **Diagram 3: Data Validation Execution** ✅

**File:** `ACTIVITY_DIAGRAM_DATA_VALIDATION.puml`

**What it shows:**
- Validation rule selection
- Execution configuration (auto-create issues: yes/no)
- 7 validation types (FORMAT, RANGE, UNIQUENESS, etc.)
- Record-by-record validation
- Failure recording
- Pass rate calculation
- Auto-issue creation logic (individual vs summary)
- Results notification
- Export to Excel/CSV

**Key Features:**
- ✅ 7 validation types supported
- ✅ Smart issue creation (< 100 = individual, >= 100 = summary)
- ✅ Real-time progress tracking
- ✅ Detailed failure records
- ✅ Email notification on completion
- ✅ Export capabilities

**Actors:**
- User (HOD/Secretary) - runs validation
- Validation Engine - executes logic
- Issue Creation Service - creates issues from failures
- Notification Service - sends results

**Use in defense when explaining:**
- "How does data validation work?"
- "What types of validation are supported?"
- "How are issues created from validations?"
- "How do you prevent too many issues?"

---

### **Diagram 4: User Creation & First Login** 👥

**File:** `ACTIVITY_DIAGRAM_USER_CREATION.puml`

**What it shows:**
- Admin creates user with Employee ID and email
- System validates uniqueness
- Temporary password generation (12 chars, complex)
- BCrypt password hashing
- Email sent with credentials
- User first login attempt
- Forced password change
- Password policy enforcement
- Successful login after password change

**Key Features:**
- ✅ Permanent Employee ID (never changes)
- ✅ Auto-generated temp password
- ✅ Email notification with credentials
- ✅ Forced password change on first login
- ✅ Strong password policy
- ✅ BCrypt hashing (strength 12)
- ✅ Complete audit trail

**Actors:**
- ADMIN - creates user
- System - validates and generates credentials
- Email Service - sends welcome email
- New User - receives email and logs in

**Use in defense when explaining:**
- "How are users created?"
- "How do users receive credentials?"
- "What is the first login flow?"
- "How is password security enforced?"

---

### **Diagram 5: Root Cause Analysis** 🔬

**File:** `ACTIVITY_DIAGRAM_RCA.puml`

**What it shows:**
- Member investigates issue
- Creates RCA (5 Whys or Fishbone method)
- Fills analysis form
- Identifies root cause
- Documents corrective actions (fix now)
- Documents preventive actions (prevent future)
- Saves as DRAFT
- Submits for HOD review
- HOD approves or rejects with feedback
- If rejected, member revises and resubmits
- If approved, preventive actions implemented

**Key Features:**
- ✅ Two analysis methods (5 Whys, Fishbone)
- ✅ Draft → Pending Review → Approved/Rejected workflow
- ✅ HOD approval required
- ✅ Feedback loop (reject with comments)
- ✅ Corrective vs Preventive actions
- ✅ Audit trail

**Actors:**
- Assigned Member - performs analysis
- System - saves and validates
- HOD - reviews and approves/rejects
- Notification Service - sends alerts

**Use in defense when explaining:**
- "How is root cause analysis done?"
- "What is the 5 Whys method?"
- "How is RCA approved?"
- "What are corrective vs preventive actions?"

---

### **Diagram 6: SLA Monitoring & Alerts** 📡

**File:** `ACTIVITY_DIAGRAM_SLA_MONITORING.puml`

**What it shows:**
- Scheduled job runs every 5 minutes
- Queries all open/in-progress issues
- Calculates time remaining for each
- Updates SLA status:
  - **ON_TRACK** (green) - plenty of time
  - **AT_RISK** (yellow) - approaching deadline
  - **BREACHED** (red) - past deadline
- Sends notifications based on status change
- User receives alerts
- User takes action
- Issue resolved stops SLA monitoring

**Key Features:**
- ✅ Automated monitoring (every 5 minutes, 24/7)
- ✅ Three SLA statuses with color coding
- ✅ Escalating notifications (user → HOD → ADMIN)
- ✅ Real-time dashboard updates
- ✅ Resolution time tracking
- ✅ SLA compliance metrics

**Actors:**
- System Scheduler - triggers job
- SLA Update Service - calculates and updates
- Notification Service - sends alerts
- Assigned User - receives and acts
- Dashboard Service - updates metrics

**Use in defense when explaining:**
- "How is SLA monitored?"
- "What happens when SLA is at risk?"
- "How are users notified?"
- "What is the automated process?"

---

## 3. HOW TO GENERATE DIAGRAMS

### **Method 1: Online (Easiest - 2 minutes)**

**Step 1:** Go to PlantUML Online
```
http://www.plantuml.com/plantuml/uml/
```

**Step 2:** Choose a diagram file
- ACTIVITY_DIAGRAM_LOGIN.puml
- ACTIVITY_DIAGRAM_ISSUE_CREATION.puml
- ACTIVITY_DIAGRAM_DATA_VALIDATION.puml
- ACTIVITY_DIAGRAM_USER_CREATION.puml
- ACTIVITY_DIAGRAM_RCA.puml
- ACTIVITY_DIAGRAM_SLA_MONITORING.puml

**Step 3:** Copy ALL code from the file

**Step 4:** Paste into PlantUML website

**Step 5:** Click "Submit"

**Step 6:** Download as PNG or SVG

**Done!** ✅

---

### **Method 2: VS Code (Best for Editing)**

**Step 1:** Install VS Code

**Step 2:** Install PlantUML extension

**Step 3:** Install Graphviz

**Step 4:** Open .puml file in VS Code

**Step 5:** Press `Alt+D` to preview

**Step 6:** Right-click → Export → PNG/SVG

---

## 4. WHICH DIAGRAM TO USE WHEN

### **For Defense Presentation**

| Question/Topic | Use This Diagram |
|----------------|------------------|
| "How do users login?" | ACTIVITY_DIAGRAM_LOGIN.puml |
| "Explain authentication flow" | ACTIVITY_DIAGRAM_LOGIN.puml |
| "How are issues created?" | ACTIVITY_DIAGRAM_ISSUE_CREATION.puml |
| "How is SLA calculated?" | ACTIVITY_DIAGRAM_ISSUE_CREATION.puml |
| "Explain data validation" | ACTIVITY_DIAGRAM_DATA_VALIDATION.puml |
| "How are users onboarded?" | ACTIVITY_DIAGRAM_USER_CREATION.puml |
| "What is root cause analysis?" | ACTIVITY_DIAGRAM_RCA.puml |
| "How does SLA monitoring work?" | ACTIVITY_DIAGRAM_SLA_MONITORING.puml |
| "Show complete workflow" | Any/All diagrams |

### **For PowerPoint Presentation**

**Recommended: Use 2-3 diagrams max**

**Option 1: Focus on Core Workflows**
- Slide 8: Issue Creation & Assignment (most important)
- Slide 9: Data Validation Execution
- Slide 10: SLA Monitoring (automated)

**Option 2: Focus on User Flows**
- Slide 8: User Login & Authentication
- Slide 9: User Creation & First Login
- Slide 10: Issue Creation & Assignment

**Option 3: Show All (Appendix)**
- Keep in backup slides
- Show if committee asks specific questions

### **For Project Report**

**Chapter 4: System Design**
- Include all 6 diagrams
- One per subsection
- Explain each workflow in text

**Appendix:**
- Include PlantUML source code
- Shows technical documentation skills

---

## 5. HOW TO PRESENT IN DEFENSE

### **Scenario 1: Committee Asks "How does login work?"**

**What to say:**
> "I'll show you the login activity diagram."

**Show:** ACTIVITY_DIAGRAM_LOGIN.puml

**Explain (2 minutes):**
> "The user starts by opening the application and selecting their role - ADMIN, HOD, Secretary, or Member. Then they enter their email and password.
>
> The system validates the credentials. If the user exists and the password is correct, it checks if this is their first login.
>
> If it's their first login with a temporary password, the system forces them to change it. The new password must meet our security policy - at least 8 characters with uppercase, lowercase, numbers, and special characters.
>
> After successful authentication, the system generates a JWT token valid for 1 hour and a refresh token valid for 7 days. It also creates an audit log entry and updates the last login timestamp.
>
> The user is then redirected to their role-specific dashboard."

**Point to diagram parts:**
- Decision diamonds (if/else logic)
- Swimlanes (User vs System)
- Security checks (BCrypt, JWT)

---

### **Scenario 2: Committee Asks "How is data quality validated?"**

**What to say:**
> "I'll demonstrate using the data validation activity diagram."

**Show:** ACTIVITY_DIAGRAM_DATA_VALIDATION.puml

**Explain (3 minutes):**
> "The user selects a validation rule from the system - for example, 'TIN Uniqueness Check'. They configure whether to auto-create issues from failures, then click Execute.
>
> The system supports 7 validation types: FORMAT, RANGE, CONSISTENCY, COMPLETENESS, UNIQUENESS, REFERENTIAL_INTEGRITY, and BUSINESS_RULE.
>
> The validation engine processes each record. For the TIN uniqueness check, it runs a SQL query to find duplicate TIN numbers. If a record fails validation, it's saved to the failures table with the actual value, expected value, and failure reason.
>
> After processing all records, the system calculates the pass rate. If auto-create issues is enabled and there are failures, the system creates issues automatically. If there are fewer than 100 failures, it creates individual issues. If more than 100, it creates one summary issue to avoid overwhelming the system.
>
> Finally, the user receives an email notification with the results and can view detailed failures or export to Excel."

**Point to diagram parts:**
- Validation types (if/else branches)
- Smart issue creation logic
- Notification flow

---

### **Scenario 3: Committee Asks "What is your RCA process?"**

**What to say:**
> "Let me show you the root cause analysis workflow."

**Show:** ACTIVITY_DIAGRAM_RCA.puml

**Explain (2-3 minutes):**
> "When a team member is assigned an issue, they investigate and perform root cause analysis using either the 5 Whys method or Fishbone diagram.
>
> The 5 Whys method asks 'why' five times to dig deeper. For example: Why did duplicates occur? No validation. Why no validation? Assumed data was clean. Why assumed? No quality checks defined. And so on until we find the real root cause.
>
> The analyst documents corrective actions - what to do NOW to fix this specific issue - and preventive actions - what to do to PREVENT this from happening again in the future.
>
> The analysis is saved as DRAFT first. When ready, it's submitted for HOD review. The HOD can either approve it or reject with feedback. If rejected, the analyst revises and resubmits. Once approved, the preventive actions are implemented across the department.
>
> This ensures we don't just fix symptoms, but address the root cause and prevent recurrence."

**Point to diagram parts:**
- Analysis methods (5 Whys vs Fishbone)
- Approval workflow (states)
- Feedback loop

---

## 6. PRINTING GUIDE

### **For A4 Paper**

**Recommended Settings:**
```
Paper Size: A4 Portrait
Orientation: Portrait (vertical)
Scale: Fit to Page
Quality: High (300 DPI)
Color: Yes (if possible)
Margins: 0.5 inch
```

### **Which Diagrams to Print**

**Option 1: Print Top 3** (Recommended)
1. ACTIVITY_DIAGRAM_ISSUE_CREATION.puml ⭐ (most important)
2. ACTIVITY_DIAGRAM_DATA_VALIDATION.puml
3. ACTIVITY_DIAGRAM_SLA_MONITORING.puml

**Option 2: Print All 6**
- All diagrams on separate pages
- Good for comprehensive documentation
- Costs more (~$6 for 6 color pages)

### **For Committee Handouts**

**Don't print activity diagrams for handouts**
- They're too detailed for quick reference
- Use class diagram instead (CLASS_DIAGRAM_A4_COMPACT.puml)
- Keep activity diagrams in your presentation slides or report

### **For Your Personal Use**

**Print all 6 diagrams:**
- Study them before defense
- Know each workflow by heart
- Practice explaining without looking
- Mark key points with highlighter

---

## 7. QUICK REFERENCE TABLE

| Diagram | Complexity | Presentation Time | Best For |
|---------|------------|-------------------|----------|
| Login | ⭐⭐ Medium | 2 min | Security explanation |
| Issue Creation | ⭐⭐⭐ Complex | 3 min | Main workflow |
| Data Validation | ⭐⭐⭐ Complex | 3 min | Technical depth |
| User Creation | ⭐⭐ Medium | 2 min | User management |
| RCA | ⭐⭐ Medium | 2-3 min | Problem solving |
| SLA Monitoring | ⭐⭐⭐ Complex | 3 min | Automation |

---

## 8. DEFENSE TIPS

### **Do's ✅**

✅ **Know your workflows** - Study diagrams beforehand  
✅ **Point while explaining** - Use laser pointer or finger  
✅ **Follow the flow** - Start to end, top to bottom  
✅ **Explain decisions** - Why this path vs that path  
✅ **Mention actors** - Who does what  
✅ **Keep it simple** - Don't overwhelm with details  
✅ **Time yourself** - 2-3 minutes per diagram max  

### **Don'ts ❌**

❌ **Don't read the diagram** - Explain in your own words  
❌ **Don't skip steps** - Cover the complete flow  
❌ **Don't rush** - Take your time  
❌ **Don't memorize** - Understand the logic  
❌ **Don't show all 6** - Pick 2-3 most relevant  
❌ **Don't ignore questions** - If committee asks, show diagram  

---

## 9. SUMMARY

### **What You Have**

✅ **6 comprehensive activity diagrams** covering all major workflows  
✅ **Complete PlantUML source code** ready to generate  
✅ **Detailed explanations** for each diagram  
✅ **Defense presentation scripts** ready to use  
✅ **Printing guidance** for A4 paper  

### **What To Do Next**

**Today:**
1. ✅ Generate all 6 diagrams as PNG (20 minutes)
2. ✅ Study each workflow (30 minutes)
3. ✅ Pick top 3 for presentation (5 minutes)

**This Week:**
1. ✅ Insert diagrams into PowerPoint
2. ✅ Practice explaining each (3 times each)
3. ✅ Time yourself (should be 2-3 min each)
4. ✅ Print for personal reference

**Defense Day:**
1. ✅ Have all diagrams in PowerPoint
2. ✅ Know which to show for which question
3. ✅ Confident explanations
4. ✅ Ace your defense!

---

## 10. GENERATE ALL DIAGRAMS NOW

**Quick Start (30 minutes for all 6):**

1. Go to: http://www.plantuml.com/plantuml/uml/

2. For each diagram:
   - Copy code from .puml file
   - Paste into website
   - Click Submit
   - Download PNG
   - Save as: `DQIMS_Activity_[Name].png`

3. Insert into PowerPoint:
   - Slide 8: Issue Creation
   - Slide 9: Data Validation
   - Slide 10: SLA Monitoring

4. Practice explanation

5. Done! ✅

---

**You now have everything needed for activity diagrams! 🎉**

**Good luck with your defense! 🚀**

---

**Document Version:** 1.0  
**Created:** March 6, 2026  
**For:** DQIMS Final Year Project Defense - AUCA  
**Total Diagrams:** 6  
**Total Workflows Covered:** 6 major processes  
**Ready For:** Defense Presentation ✅
