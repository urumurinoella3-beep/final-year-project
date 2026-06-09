# HOD Staff Management - User Guide

## 📖 Overview

As a Head of Department (HOD), you can now view all staff members in your department and assign issues to them directly. This guide shows you how to use these features.

---

## 🔐 Logging In

1. Open your browser and go to: **http://localhost:5173**
2. Enter your credentials:
   - **Email:** Your RRA email (e.g., `marie.uwase@rra.gov.rw`)
   - **Password:** Your password
3. Click **"Sign In"**

---

## 👥 Viewing Your Department Staff

### Step 1: Navigate to Departments Page

1. After logging in, look at the left sidebar menu
2. Click on **"Departments"** (building icon)

### Step 2: View Department Overview

At the top of the page, you'll see three cards:

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Your department     │  │ Staff in department │  │ Open cases (issues) │
│                     │  │                     │  │                     │
│       IT            │  │         3           │  │         3           │
│                     │  │                     │  │                     │
│ Issues and staff    │  │ Members you can     │  │ Use "View Issues"   │
│ below belong to     │  │ assign work to      │  │ or Issue Management │
│ this unit           │  │                     │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

### Step 3: View Staff Directory

Scroll down to see the **"Department staff directory"** section.

This table shows all staff members in your department:

```
┌──────────────────────────────────────────────────────────────────────┐
│  Department staff directory                                          │
│  Search by name, email, employee ID, or phone                        │
│                                                                      │
│  [🔍 Quick search...]                                                │
├──────────────────────────────────────────────────────────────────────┤
│ Name              │ Employee ID │ Email                  │ Phone     │
├───────────────────┼─────────────┼────────────────────────┼───────────┤
│ Kevin Mutabazi    │ EMP204      │ kevin.mutabazi@rra...  │ +250788.. │
│ Linda Uwimana     │ EMP205      │ linda.uwimana@rra...   │ +250788.. │
│ Frank Nshuti      │ EMP206      │ frank.nshuti@rra...    │ +250788.. │
└───────────────────┴─────────────┴────────────────────────┴───────────┘
```

### Step 4: Search for Staff

You can search for specific staff members:

1. Click in the **"Quick search..."** box
2. Type any of the following:
   - Staff name (e.g., "Kevin")
   - Employee ID (e.g., "EMP204")
   - Email (e.g., "kevin")
   - Phone number
3. The table will automatically filter to show matching results
4. Clear the search box to see all staff again

**Example Searches:**
- Type "Kevin" → Shows only Kevin Mutabazi
- Type "EMP205" → Shows only Linda Uwimana
- Type "@rra" → Shows all staff (all have @rra.gov.rw emails)

---

## 📋 Assigning Issues to Staff

There are two ways to assign issues to your staff:

### Method 1: From Issue Management Page

1. Click **"Issue Management"** in the sidebar
2. Find an issue in your department
3. Look at the **"Assigned To"** column
4. Click the dropdown (shows "Assign to...")
5. Select a staff member from the list
6. The issue is automatically assigned!

**Visual Example:**

```
┌────────────────────────────────────────────────────────────────┐
│  Issue Management                                              │
├────────────────────────────────────────────────────────────────┤
│ ID  │ Title                    │ Status │ Assigned To          │
├─────┼──────────────────────────┼────────┼──────────────────────┤
│ #5  │ Invalid Email Formats    │ OPEN   │ [Select Staff ▼]    │
└─────┴──────────────────────────┴────────┴──────────────────────┘
                                                    │
                                                    ▼ Click dropdown
                                           ┌────────────────────┐
                                           │ Kevin Mutabazi     │
                                           │ Linda Uwimana      │
                                           │ Frank Nshuti       │
                                           └────────────────────┘
                                                    │
                                                    ▼ Select Kevin
┌────────────────────────────────────────────────────────────────┐
│ ID  │ Title                    │ Status       │ Assigned To    │
├─────┼──────────────────────────┼──────────────┼────────────────┤
│ #5  │ Invalid Email Formats    │ IN_PROGRESS  │ Kevin Mutabazi │
└─────┴──────────────────────────┴──────────────┴────────────────┘
```

**What Happens:**
- ✅ Issue status changes to "IN_PROGRESS"
- ✅ Staff member receives a notification
- ✅ Issue appears in staff member's "My Issues" list
- ✅ You can track progress in Issue Management

### Method 2: From Department Issues Dialog

1. Go to **"Departments"** page
2. Scroll to your department card
3. Click **"View Issues"** button
4. A dialog opens showing all department issues
5. Use the **"Assigned To"** dropdown for each issue
6. Select a staff member
7. Close the dialog when done

**Visual Example:**

```
┌────────────────────────────────────────────────────────────────┐
│  IT Department Issues                                      [X] │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Total: 8 │  │ Open: 3  │  │ Staff: 3 │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                │
│  ID │ Title              │ Status │ Priority │ Assigned To    │
│  ───┼────────────────────┼────────┼──────────┼────────────────│
│  #5 │ Invalid Emails     │ OPEN   │ LOW      │ [Select ▼]    │
│  #7 │ System Performance │ PROG   │ HIGH     │ Kevin Mutabazi │
│  #10│ Data Export        │ RESOL  │ MEDIUM   │ Linda Uwimana  │
└────────────────────────────────────────────────────────────────┘
```

---

## 📊 Understanding Department Statistics

Your department card shows important metrics:

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 IT                                          [3 open]     │
│  3 staff members                                            │
│                                                             │
│  HODs:          1                                           │
│  Staffs:        3                                           │
│  ─────────────────                                          │
│  Total Issues:  8                                           │
│                                                             │
│  Staff (preview):                                           │
│  👤 Kevin Mutabazi                              [STAFF]     │
│  👤 Linda Uwimana                               [STAFF]     │
│  👤 Frank Nshuti                                [STAFF]     │
└─────────────────────────────────────────────────────────────┘
```

**What Each Number Means:**

- **3 open** - Issues currently open in your department
- **3 staff members** - Total staff you can assign work to
- **HODs: 1** - Number of HODs (you)
- **Staffs: 3** - Number of staff members
- **Total Issues: 8** - All issues (open, in progress, resolved, closed)

---

## ✅ Best Practices

### When Assigning Issues:

1. **Match Skills to Issues**
   - Assign technical issues to technical staff
   - Consider staff workload before assigning

2. **Check Staff Availability**
   - View staff's current assigned issues
   - Don't overload one person

3. **Set Clear Priorities**
   - Assign HIGH priority issues first
   - Communicate urgency to staff

4. **Monitor Progress**
   - Check Issue Management regularly
   - Follow up on IN_PROGRESS issues
   - Review resolved issues before closing

### Using the Search Feature:

1. **Quick Lookups**
   - Search by name for quick access
   - Use Employee ID for exact matches

2. **Verify Contact Info**
   - Check email before sending communications
   - Verify phone numbers are up to date

3. **Role Verification**
   - Confirm staff role before assignment
   - Ensure they have necessary permissions

---

## 🔔 Notifications

When you assign an issue to a staff member:

1. **Staff Receives Notification**
   - Bell icon shows new notification
   - Email notification sent (if enabled)

2. **Issue Status Updates**
   - Status changes to "IN_PROGRESS"
   - You receive updates when staff makes changes

3. **Completion Alerts**
   - Notified when staff marks issue as resolved
   - Can review and close the issue

---

## 🆘 Troubleshooting

### Problem: "No staff match your search"

**Solutions:**
1. Clear the search box
2. Refresh the page (F5)
3. Logout and login again
4. Contact IT support if problem persists

### Problem: Cannot see staff in dropdown

**Solutions:**
1. Verify you're logged in as HOD
2. Check that issue belongs to your department
3. Refresh the page
4. Clear browser cache

### Problem: Assignment doesn't save

**Solutions:**
1. Check your internet connection
2. Verify staff member is active
3. Try assigning again
4. Contact IT support if error persists

---

## 📞 Support

If you need help:

1. **IT Support:**
   - Email: it.support@rra.gov.rw
   - Phone: +250 788 XXX XXX

2. **System Administrator:**
   - Email: admin@rra.gov.rw

3. **User Manual:**
   - Available in the Help section
   - Press F1 for quick help

---

## 🎓 Training Resources

### Video Tutorials (Coming Soon)
- How to view department staff
- How to assign issues
- How to track issue progress

### Quick Reference Cards
- Available for download
- Print and keep at your desk

### Training Sessions
- Monthly HOD training
- Contact HR for schedule

---

## 📝 Frequently Asked Questions

**Q: Can I see staff from other departments?**  
A: No, you can only see staff in your own department for security reasons.

**Q: Can I assign issues to HODs?**  
A: No, you can only assign to STAFF members. HODs manage and oversee.

**Q: What happens if I assign an issue to the wrong person?**  
A: You can reassign it by selecting a different staff member from the dropdown.

**Q: Can staff see all department staff?**  
A: No, only HODs and Admins can view the staff directory.

**Q: How do I know if a staff member is overloaded?**  
A: Check the Issue Management page to see how many issues are assigned to each person.

**Q: Can I assign multiple issues at once?**  
A: Currently, you need to assign issues one at a time.

---

## ✨ Tips & Tricks

1. **Use Search Shortcuts**
   - Type first few letters of name
   - Use Employee ID for exact match

2. **Keyboard Navigation**
   - Tab to move between fields
   - Enter to select from dropdown

3. **Bulk Operations**
   - Filter issues by status first
   - Assign similar issues to same person

4. **Regular Reviews**
   - Check staff directory weekly
   - Update contact info as needed
   - Review issue assignments daily

---

**Last Updated:** May 6, 2026  
**Version:** 1.0  
**Project:** DQIMS  
**Organization:** Rwanda Revenue Authority

---

## 📋 Quick Reference Card

```
╔═══════════════════════════════════════════════════════════╗
║           HOD STAFF MANAGEMENT - QUICK GUIDE              ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  VIEW STAFF:                                              ║
║  1. Click "Departments" in sidebar                        ║
║  2. Scroll to "Department staff directory"                ║
║  3. Use search box to filter                              ║
║                                                           ║
║  ASSIGN ISSUE:                                            ║
║  1. Go to "Issue Management"                              ║
║  2. Find issue in your department                         ║
║  3. Click "Assigned To" dropdown                          ║
║  4. Select staff member                                   ║
║                                                           ║
║  SEARCH STAFF:                                            ║
║  - By name: "Kevin"                                       ║
║  - By ID: "EMP204"                                        ║
║  - By email: "kevin"                                      ║
║                                                           ║
║  SUPPORT:                                                 ║
║  📧 it.support@rra.gov.rw                                 ║
║  📞 +250 788 XXX XXX                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Print this card and keep it at your desk for quick reference!**
