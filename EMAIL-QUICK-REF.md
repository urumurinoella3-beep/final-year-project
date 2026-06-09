# 📧 Email Notifications - Quick Reference Card

## 🔐 Credentials
```
Email: urumurinoella3@gmail.com
App Password: mvwu eadf ghhu bfmn
SMTP: smtp.gmail.com:587
```

---

## 📨 12 Email Types at a Glance

| # | Event | Recipients | Trigger |
|---|-------|-----------|---------|
| 1 | **Issue Created** | Assigned User, HOD | New issue reported |
| 2 | **Issue Assigned** | Assigned User | Issue assigned to staff |
| 3 | **Status Changed** | Reporter, Assigned | Status: OPEN→IN_PROGRESS→RESOLVED→CLOSED |
| 4 | **Priority Changed** | Reporter, Assigned | Priority: LOW↔MEDIUM↔HIGH |
| 5 | **Comment Added** | Reporter, Assigned, HOD | Someone comments |
| 6 | **Issue Resolved** | Reporter, HOD | Status = RESOLVED |
| 7 | **Issue Closed** | Reporter, Assigned | Status = CLOSED |
| 8 | **Welcome** | New User | Account created |
| 9 | **Account Updated** | Updated User | Profile modified |
| 10 | **Account Deactivated** | Deactivated User | Account disabled |
| 11 | **Password Reset** | Requesting User | Password reset requested |
| 12 | **Password Changed** | Affected User | Password updated |

---

## 🎨 Email Colors

### Status
- 🔴 **OPEN**: Red #dc3545
- 🟡 **IN_PROGRESS**: Yellow #ffc107
- 🟢 **RESOLVED**: Green #28a745
- ⚫ **CLOSED**: Gray #6c757d

### Priority
- 🔴 **HIGH**: Red #dc3545
- 🟡 **MEDIUM**: Yellow #ffc107
- 🟢 **LOW**: Green #28a745

### Brand
- 🟢 **RRA Green**: #20603D
- 🔵 **RRA Blue**: #00A1DE

---

## 🚀 Quick Test (30 seconds)

```bash
# 1. Start Backend
mvn spring-boot:run

# 2. Create User with YOUR email
Login → User Management → Add User

# 3. Check YOUR inbox
Look for: "Welcome to DQIMS"

# ✅ Email received = WORKING!
```

---

## 📊 Email Flow

```
USER ACTION
    ↓
SERVICE METHOD
(IssueService/UserService)
    ↓
EMAIL SERVICE
(emailService.notifyXXX)
    ↓
ASYNC SENDER
(@Async annotation)
    ↓
GMAIL SMTP
(smtp.gmail.com:587)
    ↓
RECIPIENT INBOX
```

---

## 🔧 Files Modified

```
✓ application.properties    (SMTP config)
✓ EmailService.java          (NEW - 12 email templates)
✓ AsyncConfig.java           (NEW - Async support)
✓ IssueService.java          (Email integration)
✓ UserService.java           (Email integration)
✓ UserRepository.java        (HOD finder method)
```

---

## 📝 Configuration Flags

```properties
# In application.properties

# Turn OFF emails
app.notification.email.enabled=false

# Turn ON emails (default)
app.notification.email.enabled=true

# Async sending (recommended)
app.notification.email.async=true
```

---

## 🐛 Troubleshooting 1-2-3

### 1️⃣ Check Logs
```bash
# Look for:
✅ Email sent successfully to: ...
# or
❌ Failed to send email to: ...
```

### 2️⃣ Check Spam
- Open email spam folder
- Mark DQIMS as "Not Spam"
- Add to contacts

### 3️⃣ Verify Config
```properties
# Must be:
spring.mail.password=mvwueadfghhubfmn  # No spaces!
app.notification.email.enabled=true
```

---

## 📈 Stats

| Metric | Value |
|--------|-------|
| Email Types | 12 |
| HTML Templates | 12 |
| Lines of Code | ~850 |
| Thread Pool Size | 2-5 |
| Queue Capacity | 100 emails |
| Daily Limit (Gmail) | 500 emails |
| Avg Send Time | 5-30 seconds |

---

## ✅ Success Indicators

### Backend Log
```
✅ Email sent successfully to: john.kamanzi@rra.gov.rw | Subject: Issue Assigned
```

### Email Inbox
- From: **urumurinoella3@gmail.com**
- Display Name: **DQIMS - RRA Data Quality System**
- HTML formatted with RRA branding
- Color-coded badges
- Professional layout

---

## 🎯 Smart Rules

### Who Gets Notified?

**Issue Events**:
- ✅ Affected users (reporter, assigned)
- ✅ Department HOD
- ❌ Action performer

**User Events**:
- ✅ Affected user only

**Comments**:
- ✅ Reporter, Assigned, HOD
- ❌ Commenter

---

## 📧 Email Template Structure

```
┌─────────────────────┐
│ GRADIENT HEADER     │ RRA Colors
│ DQIMS Logo          │
├─────────────────────┤
│ TITLE              │
│ GREETING           │
│ ┌───────────────┐  │
│ │ MAIN CONTENT  │  │ Tables, Badges
│ │ Issue Details │  │ Color-coded
│ └───────────────┘  │
├─────────────────────┤
│ FOOTER             │
│ © 2026 RRA         │
└─────────────────────┘
```

---

## 🔒 Security Checklist

- [x] App-specific password (not account password)
- [x] 2-Step Verification enabled
- [x] TLS encryption (STARTTLS)
- [x] HTML escaped (prevents XSS)
- [x] No sensitive data in subjects
- [x] Temp passwords expire on first login

---

## 📞 Quick Support

| Issue | Solution |
|-------|----------|
| No emails | Check spam, verify logs, confirm email address |
| Emails delayed | Normal (async), wait 30 sec |
| Wrong recipients | Check user roles/departments |
| SMTP error | Verify app password, check internet |
| Too many emails | Rate limiting working correctly |

---

## 📚 Full Documentation

1. **EMAIL-NOTIFICATION-SYSTEM.md** → Complete guide
2. **EMAIL-TESTING-GUIDE.md** → Testing steps
3. **EMAIL-SYSTEM-SUMMARY.md** → Summary
4. **EMAIL-QUICK-REF.md** → This card

---

## ⚡ One-Liner Test

```bash
# Start backend, create user with YOUR email, check inbox!
mvn spring-boot:run && echo "Create user with YOUR email → Check inbox!"
```

---

**Status**: ✅ READY  
**Version**: 1.0.0  
**Date**: June 9, 2026
