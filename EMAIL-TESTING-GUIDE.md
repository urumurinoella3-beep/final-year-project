# 📧 Email Notification Testing Guide

## Quick Start Testing

### Prerequisites
✅ Backend running on localhost:8080  
✅ Frontend running on localhost:5173  
✅ Gmail SMTP configured with app password

---

## 🧪 Test Scenarios

### Test 1: Welcome Email (New User Creation)
**Time**: 2 minutes  
**Difficulty**: Easy

#### Steps:
1. Login as ADMIN (admin@rra.gov.rw / password)
2. Navigate to User Management
3. Click "Add User"
4. Fill in:
   - Employee ID: TEST001
   - Name: Test User
   - Email: **YOUR_EMAIL@gmail.com** (use your own email!)
   - Phone: +250788999999
   - Role: STAFF
   - Department: IT
5. Click "Create User"

#### Expected Result:
✉️ **Email received at YOUR_EMAIL@gmail.com** with:
- Subject: "Welcome to DQIMS - Your Account Has Been Created"
- Welcome message
- Account details
- Temporary password (12 characters)
- Instructions to login

#### Backend Log:
```
✅ Email sent successfully to: YOUR_EMAIL@gmail.com | Subject: Welcome to DQIMS
```

---

### Test 2: Issue Assigned Email
**Time**: 2 minutes  
**Difficulty**: Easy

#### Steps:
1. Login as ADMIN or HOD
2. Navigate to Issue Management
3. Click "Report Issue"
4. Fill in:
   - Title: "Test Issue for Email Notification"
   - Description: "Testing email system"
   - Department: Finance
   - Issue Type: Missing
   - Priority: High
5. **Important**: Select an Assign To user (e.g., John Kamanzi - john.kamanzi@rra.gov.rw)
6. Click "Create Issue"

#### Expected Result:
✉️ **Assigned user receives email** with:
- Subject: "Issue Assigned to You: Test Issue for Email Notification"
- Issue details (ID, Title, Description)
- Priority badge (RED for HIGH)
- Assigner name

#### Bonus:
✉️ **Department HOD also receives "Issue Created" email**

---

### Test 3: Comment Notification Email
**Time**: 2 minutes  
**Difficulty**: Easy

#### Steps:
1. Login as any user
2. Open an existing issue (from dashboard recent issues)
3. Scroll to Comments section
4. Add comment: "This is a test comment for email notification"
5. Click "Add Comment"

#### Expected Result:
✉️ **Issue reporter receives email** (if not the commenter):
- Subject: "New Comment on Issue: [Issue Title]"
- Commenter's name and avatar
- Full comment text
- Timestamp

✉️ **Assigned staff receives email** (if not the commenter)
✉️ **Department HOD receives email** (if not the commenter)

---

### Test 4: Issue Status Change Email
**Time**: 1 minute  
**Difficulty**: Easy

#### Steps:
1. Login as assigned STAFF or HOD
2. Navigate to Issue Management
3. Find an OPEN issue
4. Change status dropdown from "OPEN" to "IN_PROGRESS"
5. Status updates automatically

#### Expected Result:
✉️ **Reporter and assigned user receive email**:
- Subject: "Issue Status Updated: [Issue Title]"
- Visual status change: OPEN → IN_PROGRESS
- Color-coded status badges (Red → Yellow)
- Updater name

---

### Test 5: Issue Resolved Email
**Time**: 1 minute  
**Difficulty**: Easy

#### Steps:
1. Login as assigned STAFF
2. Navigate to Issue Management
3. Find an IN_PROGRESS issue
4. Change status to "RESOLVED"

#### Expected Result:
✉️ **Issue reporter receives email**:
- Subject: "Issue Resolved: [Issue Title]"
- ✅ Green success styling
- Resolver name
- Resolution timestamp

✉️ **Department HOD receives notification email**

---

### Test 6: Issue Closed Email (HOD Only)
**Time**: 1 minute  
**Difficulty**: Easy

#### Steps:
1. Login as HOD or ADMIN
2. Navigate to Issue Management
3. Find a RESOLVED issue
4. Change status to "CLOSED"

#### Expected Result:
✉️ **Reporter and assigned user receive email**:
- Subject: "Issue Closed: [Issue Title]"
- 🔒 Blue info styling
- Closer name
- Closure timestamp
- "No further action required" message

---

### Test 7: Priority Change Email
**Time**: 1 minute  
**Difficulty**: Easy

#### Steps:
1. Login as HOD
2. Navigate to Issue Management
3. Find any issue
4. Change priority from "MEDIUM" to "HIGH" (or vice versa)

#### Expected Result:
✉️ **Reporter and assigned user receive email**:
- Subject: "Issue Priority Changed: [Issue Title]"
- Visual priority change: MEDIUM → HIGH
- Color-coded badges (Yellow → Red)
- Updater name

---

## 📊 Test Results Checklist

### Issue Notifications
- [ ] Issue Created → HOD email ✉️
- [ ] Issue Assigned → Assigned user email ✉️
- [ ] Status Changed → Reporter + Assigned email ✉️
- [ ] Priority Changed → Reporter + Assigned email ✉️
- [ ] Comment Added → Reporter + Assigned + HOD email ✉️
- [ ] Issue Resolved → Reporter + HOD email ✉️
- [ ] Issue Closed → Reporter + Assigned email ✉️

### User Notifications
- [ ] User Created → Welcome email with temp password ✉️
- [ ] User Updated → Account updated email ✉️
- [ ] User Deactivated → Deactivation notice email ✉️

---

## 🔍 How to Check Emails

### Option 1: Check YOUR Email Inbox
If you used your personal email for testing:
1. Open Gmail/Outlook/etc.
2. Check Inbox (or Spam folder)
3. Look for emails from: **urumurinoella3@gmail.com**
4. Verify email content matches expected results

### Option 2: Check Backend Logs
```bash
# Windows Command Prompt
cd "C:\Users\Urumuri\Desktop\Final Year Project\Backend\DQIMS"
type logs\application.log | findstr "Email sent"

# Or check console output in IntelliJ/Eclipse
# Look for lines like:
# ✅ Email sent successfully to: john.kamanzi@rra.gov.rw
```

### Option 3: Check Database Notifications
Even if email fails, in-app notifications still work:
1. Click notification bell icon (top-right)
2. Verify notification appears
3. Email should have been sent alongside

---

## 🐛 Troubleshooting

### Problem: No emails received

#### Check 1: Backend Logs
Look for error messages:
```
❌ Failed to send email to: ...
```

#### Check 2: Email Address
Verify the user's email address is valid:
- User Management → View user details
- Must be real email address

#### Check 3: Spam Folder
Gmail might flag DQIMS emails as spam initially:
- Check Spam/Junk folder
- Mark as "Not Spam"
- Add urumurinoella3@gmail.com to contacts

#### Check 4: SMTP Configuration
Verify in application.properties:
```properties
spring.mail.password=mvwueadfghhubfmn  # No spaces!
app.notification.email.enabled=true
```

#### Check 5: Internet Connection
Backend needs internet to send emails:
- Test: `ping smtp.gmail.com`
- Check firewall allows port 587

---

### Problem: Emails delayed

**Cause**: Async email sending + network latency

**Normal Delay**: 5-30 seconds

**If longer**:
1. Check backend logs for errors
2. Check Gmail "Less secure apps" settings
3. Verify thread pool is not exhausted

---

### Problem: Duplicate emails

**Cause**: Multiple events triggered simultaneously

**Example**: Assigning AND changing status at same time

**Solution**: This is expected behavior - user gets notified of both events

---

## 📧 Email Preview

### What Emails Look Like

#### Header (All Emails)
```
┌────────────────────────────────┐
│  [Green-Blue Gradient Header]  │
│                                 │
│         DQIMS                   │
│  Data Quality Issues            │
│  Management System              │
│  Rwanda Revenue Authority       │
└────────────────────────────────┘
```

#### Content (Example: Issue Assigned)
```
Issue Assigned to You

Hello John Kamanzi,

A data quality issue has been assigned to you by Jean Claude Mugisha.

┌─────────────────────────────┐
│ Issue Details               │
│                             │
│ Issue ID: #42               │
│ Title: Missing TIN numbers  │
│ Description: ...            │
│ Priority: [HIGH]  (red)     │
│ Assigned By: Jean Claude    │
└─────────────────────────────┘

Please login to DQIMS to view full details
and take action on this issue.
```

#### Footer (All Emails)
```
┌────────────────────────────────┐
│ This is an automated email     │
│ from DQIMS. Please do not      │
│ reply to this email.           │
│                                │
│ © 2026 Rwanda Revenue Authority│
└────────────────────────────────┘
```

---

## 🎯 Quick Test (5 Minutes)

### Fastest Way to Test All Notifications

1. **Create Test User** (your email)
   → Check welcome email ✉️

2. **Create Issue + Assign to someone**
   → Check assignment email ✉️

3. **Add Comment to any issue**
   → Check comment email ✉️

4. **Change Issue Status**
   → Check status change email ✉️

5. **Mark Issue as Resolved**
   → Check resolution email ✉️

**Total**: 5 email types tested in 5 minutes!

---

## 📝 Test Log Template

Use this to track your testing:

```
Date: _______________
Tester: _______________

Test 1: Welcome Email
Status: [ ] Pass  [ ] Fail
Notes: _________________________________

Test 2: Issue Assigned
Status: [ ] Pass  [ ] Fail
Notes: _________________________________

Test 3: Comment Notification
Status: [ ] Pass  [ ] Fail
Notes: _________________________________

Test 4: Status Change
Status: [ ] Pass  [ ] Fail
Notes: _________________________________

Test 5: Issue Resolved
Status: [ ] Pass  [ ] Fail
Notes: _________________________________

Test 6: Issue Closed
Status: [ ] Pass  [ ] Fail
Notes: _________________________________

Test 7: Priority Change
Status: [ ] Pass  [ ] Fail
Notes: _________________________________

Overall Result: [ ] All Pass  [ ] Some Failed
```

---

## ✅ Success Criteria

### All Tests Pass When:
- ✅ All expected emails received
- ✅ Email content matches templates
- ✅ No errors in backend logs
- ✅ Proper HTML formatting
- ✅ Correct recipients
- ✅ No duplicate notifications
- ✅ Emails arrive within 30 seconds

---

**Ready to Test!** 🚀

Start with Test 1 (Welcome Email) - it's the easiest and confirms SMTP is working correctly.
