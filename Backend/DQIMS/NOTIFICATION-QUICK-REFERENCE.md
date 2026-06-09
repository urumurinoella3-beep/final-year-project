# 📧 DQIMS Notification System - Quick Reference Card

## 🔐 Email Configuration

```
SMTP Host: smtp.gmail.com
Port: 587
Email: urumurinoella3@gmail.com
App Password: hqnujtolizsjlaiv
```

---

## 📬 Notification Coverage Matrix

| Event | In-System | Email | Recipients |
|-------|-----------|-------|------------|
| **Issue Created** | ✅ | ✅ | Reporter, Assignee, HOD |
| **Issue Assigned** | ✅ | ✅ | Assignee |
| **Issue Reassigned** | ✅ | ✅ | Old Assignee, New Assignee |
| **Status Changed** | ✅ | ✅ | Reporter, Assignee |
| **Priority Changed** | ✅ | ✅ | Reporter, Assignee |
| **Comment Added** | ✅ | ✅ | Reporter, Assignee, HOD |
| **Issue Resolved** | ✅ | ✅ | Reporter, HOD |
| **Issue Closed** | ✅ | ✅ | Reporter, Assignee |
| **User Created** | ✅ | ✅ | New User (with password) |
| **User Updated** | ✅ | ✅ | Updated User |
| **User Deactivated** | ✅ | ✅ | Deactivated User |
| **Password Reset** | ❌ | ✅ | Requesting User (with token) |
| **Password Changed** | ❌ | ✅ | User (confirmation) |
| **HOD Department Updates** | ✅ | ✅ | Department HOD |

---

## 🎯 API Endpoints

### Notifications
```bash
GET    /api/notifications              # Get my notifications
PUT    /api/notifications/{id}/read    # Mark as read
PUT    /api/notifications/read-all     # Mark all as read
```

### Test Scenarios
```bash
POST   /api/users                      # Create user → Welcome email
POST   /api/issues                     # Create issue → Assignee email
POST   /api/issues/{id}/comments       # Add comment → Notify all
PUT    /api/issues/{id}                # Update issue → Status/priority email
POST   /api/auth/forgot-password       # Reset → Token email
```

---

## 🔍 Quick Debugging

### Check Logs
```
✅ Email sent successfully to: user@example.com
❌ Failed to send email to: user@example.com
```

### Check Database
```sql
SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC;
SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = false;
```

### Test SMTP
```bash
telnet smtp.gmail.com 587
```

---

## 🎨 Email Features

- ✅ Professional HTML templates
- ✅ RRA branded header (Green → Blue gradient)
- ✅ Color-coded badges (Priority/Status)
- ✅ Responsive mobile design
- ✅ Async processing (non-blocking)

---

## 🚀 Quick Test

```bash
# 1. Login
POST /api/auth/login
{"email": "admin@rra.gov.rw", "password": "Admin@123"}

# 2. Create test user (check email!)
POST /api/users
Authorization: Bearer {token}
{
  "employeeId": "TEST001",
  "name": "Test User",
  "email": "your-email@gmail.com",
  "phone": "+250788123456",
  "role": "STAFF",
  "department": "Finance"
}

# 3. Check notifications
GET /api/notifications
Authorization: Bearer {new-user-token}
```

---

## 📊 Notification Types

```java
ISSUE_CREATED
ISSUE_ASSIGNED
ISSUE_REASSIGNED
STATUS_UPDATED
PRIORITY_CHANGED
COMMENT_ADDED
ISSUE_RESOLVED
ISSUE_CLOSED
ISSUE_STATUS_CHANGED
ISSUE_PRIORITY_CHANGED
ISSUE_DEPARTMENT_UPDATE
ACCOUNT_CREATED
ACCOUNT_UPDATED
ACCOUNT_DEACTIVATED
```

---

## 🔧 Configuration Properties

```properties
app.notification.email.enabled=true
app.notification.email.async=true
app.mail.from=urumurinoella3@gmail.com
app.mail.from-name=DQIMS - RRA Data Quality System
```

---

## 📁 Key Files

```
application.properties          # Email config
EmailService.java              # 15+ email templates
IssueService.java             # Issue notifications
UserService.java              # User notifications
AuthService.java              # Auth notifications
NotificationType.java         # Enum with 14 types
```

---

## ✅ Status: OPERATIONAL

- [x] Gmail SMTP configured
- [x] All services integrated
- [x] 14 notification types
- [x] Dual-channel (in-app + email)
- [x] Async processing
- [x] Error handling
- [x] Audit logging

---

**Version**: 1.0.0
**Date**: June 9, 2026
**Coverage**: 100%
