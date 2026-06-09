# 🧪 DQIMS Notification System - Testing Guide

## 📋 Prerequisites

✅ Application is running on http://localhost:8080
✅ Database is connected and seeded with test data
✅ Gmail SMTP is configured with credentials:
   - Email: urumurinoella3@gmail.com
   - App Password: hqnujtolizsjlaiv

---

## 🔐 Test Authentication

### 1. Login as Admin
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@rra.gov.rw",
  "password": "Admin@123"
}
```

**Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": 1,
    "name": "System Administrator",
    "email": "admin@rra.gov.rw",
    "role": "ADMIN"
  }
}
```

**Copy the token** for use in subsequent requests as:
```
Authorization: Bearer {token}
```

---

## 📧 Test 1: User Account Creation (Welcome Email)

### Create a New User
```bash
POST http://localhost:8080/api/users
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "employeeId": "TEST001",
  "name": "Test User Notification",
  "email": "YOUR_TEST_EMAIL@gmail.com",
  "phone": "+250788999888",
  "role": "STAFF",
  "department": "Finance"
}
```

### ✅ Expected Results:
1. **API Response**: User created successfully
2. **In-System Notification**: 
   - Check GET `/api/notifications` with new user's token
   - Should see "Welcome to DQIMS!" notification
3. **Email Notification**: 
   - Check YOUR_TEST_EMAIL@gmail.com inbox
   - Subject: "Welcome to DQIMS - Your Account Has Been Created"
   - Contains: Name, Email, Temporary Password
   - Professional HTML format with RRA branding

---

## 🎫 Test 2: Issue Creation & Assignment

### Create an Issue and Assign It
```bash
POST http://localhost:8080/api/issues
Authorization: Bearer {staff-token}
Content-Type: application/json

{
  "title": "Test Notification - Data Quality Issue",
  "description": "Testing the notification system for issue creation and assignment",
  "source": "Tax System",
  "dataElement": "Customer Data",
  "issueType": "Missing Data",
  "severity": "HIGH",
  "priority": "HIGH",
  "department": "Finance",
  "assignedTo": 2
}
```

### ✅ Expected Results:
1. **Reporter (Issue Creator)**:
   - In-System: "Issue Created Successfully" notification
   
2. **Assigned User (ID: 2)**:
   - In-System: "New Issue Assigned" notification
   - Email: "New Issue Assigned: Test Notification - Data Quality Issue"
   - Contains: Issue details, priority badge, assigned by info

3. **Finance HOD**:
   - In-System: "New Issue Created in Your Department" notification
   - Email: Department issue notification

---

## 💬 Test 3: Comment Addition

### Add Comment to Issue
```bash
POST http://localhost:8080/api/issues/{issue-id}/comments
Authorization: Bearer {any-user-token}
Content-Type: application/json

{
  "content": "This is a test comment to verify notification system"
}
```

### ✅ Expected Results:
1. **Reporter** (if not the commenter):
   - In-System: "New Comment on Your Issue" notification
   - Email: Shows commenter name and comment content

2. **Assigned User** (if not the commenter):
   - In-System: "New Comment on Issue" notification
   - Email: Comment notification with commenter details

3. **Department HOD** (if not the commenter):
   - In-System: Department update notification
   - Email: Department issue comment notification

---

## 🔄 Test 4: Issue Status Change

### Update Issue Status
```bash
PUT http://localhost:8080/api/issues/{issue-id}
Authorization: Bearer {hod-or-admin-token}
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

### ✅ Expected Results:
1. **Reporter**:
   - In-System: "Issue Status Updated" notification
   - Email: Shows status change (OPEN → IN_PROGRESS)

2. **Assigned User**:
   - In-System: "Issue Status Updated" notification
   - Email: Status change notification

### Test Resolution
```bash
PUT http://localhost:8080/api/issues/{issue-id}
Authorization: Bearer {assigned-user-token}
Content-Type: application/json

{
  "status": "RESOLVED"
}
```

### ✅ Expected Results:
1. **Reporter**:
   - In-System: "Issue Resolved" notification
   - Email: "✅ Issue Resolved" with resolver name and timestamp

2. **Department HOD**:
   - In-System: Department update notification
   - Email: Issue resolved notification

---

## ⚠️ Test 5: Priority Change

### Change Issue Priority
```bash
PUT http://localhost:8080/api/issues/{issue-id}
Authorization: Bearer {hod-or-admin-token}
Content-Type: application/json

{
  "priority": "MEDIUM"
}
```

### ✅ Expected Results:
1. **Reporter & Assigned User**:
   - In-System: "Issue Priority Changed" notification
   - Email: Shows priority change (HIGH → MEDIUM) with color-coded badges

---

## 🔐 Test 6: Password Reset

### Request Password Reset
```bash
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
  "email": "staff1@rra.gov.rw"
}
```

### ✅ Expected Results:
1. **Email Notification**:
   - Subject: "Password Reset Request - DQIMS"
   - Contains: 6-character reset code (e.g., "AB12CD")
   - Warning: 15-minute expiration

### Reset Password with Token
```bash
POST http://localhost:8080/api/auth/reset-password
Content-Type: application/json

{
  "token": "AB12CD",
  "newPassword": "NewSecure@456"
}
```

### ✅ Expected Results:
1. **Email Notification**:
   - Subject: "Password Changed Successfully"
   - Contains: Confirmation and timestamp
   - Security warning

---

## 👤 Test 7: User Account Update

### Update User Profile
```bash
PUT http://localhost:8080/api/users/{user-id}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "Updated Test User",
  "phone": "+250788111222",
  "department": "IT"
}
```

### ✅ Expected Results:
1. **Updated User**:
   - In-System: "Account Updated" notification
   - Email: Lists changed fields (Name, Phone, Department)

---

## 🚫 Test 8: User Deactivation

### Deactivate User
```bash
DELETE http://localhost:8080/api/users/{user-id}
Authorization: Bearer {admin-token}
```

### ✅ Expected Results:
1. **Deactivated User**:
   - In-System: "Account Deactivated" notification
   - Email: Deactivation notice with admin contact info

---

## 📱 Test 9: Check In-System Notifications

### Get My Notifications
```bash
GET http://localhost:8080/api/notifications
Authorization: Bearer {any-user-token}
```

### ✅ Expected Response:
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "ISSUE_ASSIGNED",
      "title": "New Issue Assigned",
      "message": "You have been assigned to issue: Test Issue",
      "issueId": 15,
      "isRead": false,
      "createdAt": "2026-06-09T10:30:00"
    }
  ],
  "unreadCount": 5
}
```

### Mark Notification as Read
```bash
PUT http://localhost:8080/api/notifications/{notification-id}/read
Authorization: Bearer {user-token}
```

### Mark All as Read
```bash
PUT http://localhost:8080/api/notifications/read-all
Authorization: Bearer {user-token}
```

---

## 🔍 Troubleshooting

### Emails Not Arriving?

1. **Check Application Logs**:
   ```
   ✅ Email sent successfully to: user@example.com
   ❌ Failed to send email to: user@example.com | Error: ...
   ```

2. **Verify Gmail Settings**:
   - App password is correct: `hqnujtolizsjlaiv`
   - 2-Step Verification is enabled on urumurinoella3@gmail.com
   - "Less secure app access" is not required (using app password)

3. **Check Spam Folder**: Gmail might initially mark as spam

4. **Test SMTP Connection**:
   ```bash
   telnet smtp.gmail.com 587
   ```

5. **Check application.properties**:
   ```properties
   app.notification.email.enabled=true
   app.notification.email.async=true
   ```

### In-System Notifications Not Showing?

1. **Verify User Login**: Token is valid and not expired
2. **Check Database**: Query notifications table
   ```sql
   SELECT * FROM notifications WHERE user_id = {user-id} ORDER BY created_at DESC;
   ```
3. **Check Logs**: Look for notification creation errors

---

## 📊 Complete Test Checklist

- [ ] User Creation → Welcome Email
- [ ] Issue Creation → Reporter & Assignee Notifications
- [ ] Issue Assignment → Assignee Notification
- [ ] Issue Reassignment → Old & New Assignee Notifications
- [ ] Status Change → Reporter & Assignee Notifications
- [ ] Priority Change → Reporter & Assignee Notifications
- [ ] Comment Added → All Relevant Parties Notified
- [ ] Issue Resolved → Reporter & HOD Notified
- [ ] Issue Closed → Reporter & Assignee Notified
- [ ] Password Reset → Email with Token
- [ ] Password Changed → Confirmation Email
- [ ] Account Updated → Update Notification
- [ ] Account Deactivated → Deactivation Notice
- [ ] HOD Notifications → Department-wide Updates
- [ ] In-System Notifications → All Events Recorded
- [ ] Mark as Read → Notification Status Updated
- [ ] Unread Count → Accurate Count Display

---

## 🎯 Success Criteria

✅ **All notifications generate both**:
   - In-system notification (stored in database)
   - Email notification (sent to user's email)

✅ **Emails are**:
   - Professional HTML format
   - RRA branded with gradient header
   - Color-coded priority/status badges
   - Responsive design
   - Proper UTF-8 encoding

✅ **No application errors**:
   - Async processing works
   - No blocking on email send
   - Graceful error handling

✅ **Audit trail**:
   - All actions logged in audit_logs table
   - Email send status logged in application logs

---

## 📧 Email Preview URLs

To preview emails without sending:
1. Copy HTML from `EmailService.java` methods
2. Paste into online HTML email tester:
   - https://htmlemail.io/inline/
   - https://www.htmlemailcheck.com/check/

---

## 🔗 Useful Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password with token |
| `/api/auth/change-password` | PUT | Change current password |
| `/api/users` | POST | Create new user |
| `/api/users/{id}` | PUT | Update user |
| `/api/users/{id}` | DELETE | Deactivate user |
| `/api/issues` | POST | Create issue |
| `/api/issues/{id}` | PUT | Update issue |
| `/api/issues/{id}/comments` | POST | Add comment |
| `/api/notifications` | GET | Get my notifications |
| `/api/notifications/{id}/read` | PUT | Mark as read |
| `/api/notifications/read-all` | PUT | Mark all as read |

---

**Testing Date**: June 9, 2026
**Status**: Ready for Testing
**Coverage**: 100% of notification events
