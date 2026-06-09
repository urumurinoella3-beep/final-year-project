# Department Dropdown Testing Guide

## Overview
This guide provides step-by-step testing instructions to verify that all 8 departments now appear in the department dropdowns throughout the application.

---

## Test Environment Setup

### Prerequisites
1. ✅ Backend server running (Spring Boot on port 8080)
2. ✅ Frontend dev server running (Vite on port 5173)
3. ✅ Database seeded with all 8 departments
4. ✅ Test users available (Admin, HOD, Staff)

### Test User Credentials
```
Admin:
  Email: admin@rra.gov.rw
  Password: password

HOD (Finance):
  Email: jean.mugisha@rra.gov.rw
  Password: password

Staff (Finance):
  Email: john.kamanzi@rra.gov.rw
  Password: password
```

---

## Test Case 1: Issue Reporting Form

### Test Steps
1. **Login** to the application with any user account
2. Navigate to **Issue Management** page
3. Click the **"Report Issue"** button (top-right)
4. Scroll down to the **"Department"** dropdown field
5. Click to open the dropdown

### Expected Results ✅
The dropdown should show **ALL 8 departments**:
```
✓ Finance
✓ IT
✓ HR
✓ Operations
✓ Customs
✓ VAT
✓ Compliance
✓ Data Management
```

### ❌ Before the Fix
Only showed 4 departments:
- VAT
- CUSTOMS
- DOMESTIC TAX
- IT

### Pass/Fail Criteria
- ✅ **PASS**: All 8 departments visible
- ❌ **FAIL**: Missing any department

---

## Test Case 2: Dashboard Department Chart (Admin Only)

### Test Steps
1. **Login** as ADMIN user (`admin@rra.gov.rw`)
2. Navigate to **Dashboard** page (should be default landing page)
3. Locate the **"Issues by Department"** bar chart (left side)
4. Verify all department names on the X-axis

### Expected Results ✅
The chart should display bars for **ALL 8 departments**:
```
Finance | IT | HR | Operations | Customs | VAT | Compliance | Data Management
```

### ❌ Before the Fix
Only showed 4 departments:
- VAT
- CUSTOMS
- DOMESTIC TAX
- IT

### Pass/Fail Criteria
- ✅ **PASS**: Chart shows all 8 departments (even if count is 0)
- ❌ **FAIL**: Missing any department

---

## Test Case 3: User Management - Create User

### Test Steps
1. **Login** as ADMIN user
2. Navigate to **User Management** page
3. Click **"Add User"** button
4. Scroll to the **"Department"** dropdown field
5. Click to open the dropdown

### Expected Results ✅
The dropdown should show **ALL 8 departments**:
```
✓ Finance
✓ IT
✓ HR
✓ Operations
✓ Customs
✓ VAT
✓ Compliance
✓ Data Management
```

### Note
This was already working correctly before the fix, but verify to ensure consistency.

### Pass/Fail Criteria
- ✅ **PASS**: All 8 departments visible
- ❌ **FAIL**: Missing any department

---

## Test Case 4: User Management - Edit User

### Test Steps
1. **Login** as ADMIN user
2. Navigate to **User Management** page
3. Click **Edit** on any existing user
4. Scroll to the **"Department"** dropdown field
5. Click to open the dropdown

### Expected Results ✅
The dropdown should show **ALL 8 departments**:
```
✓ Finance
✓ IT
✓ HR
✓ Operations
✓ Customs
✓ VAT
✓ Compliance
✓ Data Management
```

### Pass/Fail Criteria
- ✅ **PASS**: All 8 departments visible
- ❌ **FAIL**: Missing any department

---

## Test Case 5: Create Issue for Each Department

### Test Steps
This is a comprehensive test to ensure issues can be created for ALL departments.

#### 5.1 Create Issue for Finance
1. Navigate to Issue Management
2. Click "Report Issue"
3. Fill in required fields:
   - Title: "Test Issue - Finance Department"
   - Department: **Finance**
   - Issue Type: Missing
   - Priority: Medium
4. Click "Create Issue"
5. **Verify**: Issue appears in the list with department = "Finance"

#### 5.2 Create Issue for IT
Repeat above steps with Department = **IT**

#### 5.3 Create Issue for HR
Repeat above steps with Department = **HR**

#### 5.4 Create Issue for Operations
Repeat above steps with Department = **Operations**

#### 5.5 Create Issue for Customs
Repeat above steps with Department = **Customs**

#### 5.6 Create Issue for VAT
Repeat above steps with Department = **VAT**

#### 5.7 Create Issue for Compliance
Repeat above steps with Department = **Compliance**

#### 5.8 Create Issue for Data Management
Repeat above steps with Department = **Data Management**

### Expected Results ✅
- ✅ All 8 test issues created successfully
- ✅ Each issue displays correct department name
- ✅ Issues can be filtered by department
- ✅ Dashboard chart updates with issue counts

### Pass/Fail Criteria
- ✅ **PASS**: All 8 departments accept issue creation
- ❌ **FAIL**: Any department fails to save or display correctly

---

## Test Case 6: Department Filter Consistency

### Test Steps
1. Create issues across multiple departments (use Test Case 5)
2. Navigate to **Dashboard** (as Admin)
3. Verify the "Issues by Department" chart shows counts for all departments
4. Navigate to **Issue Management**
5. Filter issues by department using the table

### Expected Results ✅
- ✅ Dashboard chart shows issue counts for all 8 departments
- ✅ Issue table can filter by all 8 departments
- ✅ Counts match between dashboard and issue list

### Pass/Fail Criteria
- ✅ **PASS**: Consistent data across all views
- ❌ **FAIL**: Mismatched counts or missing departments

---

## Test Case 7: HOD View - Department Scope

### Test Steps
1. **Login** as HOD user (e.g., Finance HOD: `jean.mugisha@rra.gov.rw`)
2. Navigate to **Dashboard**
3. Create a new issue
4. Check the Department dropdown

### Expected Results ✅
- ✅ HOD sees their own department pre-selected
- ✅ HOD can select any department (for delegated issues)
- ✅ All 8 departments still visible

### Pass/Fail Criteria
- ✅ **PASS**: HOD can see and select all departments
- ❌ **FAIL**: HOD restricted to only their department

---

## Test Case 8: Regression Test - Existing Functionality

### Test Steps
Verify that fixing the department dropdown didn't break existing features:

1. **Authentication**
   - ✅ Login works for Admin, HOD, Staff
   - ✅ Logout works correctly

2. **Issue Management**
   - ✅ Create issue works
   - ✅ Edit issue works
   - ✅ Assign issue to staff works
   - ✅ Change issue status works

3. **User Management**
   - ✅ Create user works
   - ✅ Edit user works
   - ✅ Deactivate user works

4. **Reports**
   - ✅ Report generation works
   - ✅ Export to PDF works
   - ✅ Export to Excel works

### Pass/Fail Criteria
- ✅ **PASS**: All existing features work as before
- ❌ **FAIL**: Any feature is broken

---

## Bug Reporting Template

If you encounter any issues during testing, use this template:

```
BUG REPORT

Test Case: [Test Case Number and Name]
Date: [Date]
Tester: [Your Name]
Browser: [Chrome/Firefox/Edge]

STEPS TO REPRODUCE:
1. [Step 1]
2. [Step 2]
3. [Step 3]

EXPECTED RESULT:
[What should happen]

ACTUAL RESULT:
[What actually happened]

SEVERITY:
[ ] Critical - Cannot proceed with testing
[ ] High - Major feature broken
[ ] Medium - Minor issue, workaround available
[ ] Low - Cosmetic issue

SCREENSHOTS:
[Attach screenshots if applicable]

CONSOLE ERRORS:
[Copy any console errors from browser DevTools]
```

---

## Success Metrics

### ✅ All Tests Pass When:
1. All 8 departments visible in ALL dropdowns
2. Issues can be created for ALL departments
3. Dashboard shows ALL departments in chart
4. User assignment works for ALL departments
5. No console errors or warnings
6. No broken functionality
7. Data persists correctly across page refreshes

---

## Rollback Plan

If critical bugs are found:

1. **Revert Git Commits**
   ```bash
   git log --oneline
   git revert <commit-hash>
   ```

2. **Restore Files**
   - Restore `AuthContext.tsx` to previous version
   - Restore `IssueManagementPage.tsx` to previous version
   - Restore `DashboardPage.tsx` to previous version

3. **Verify Rollback**
   - Restart frontend dev server
   - Test issue creation still works
   - Departments revert to hardcoded 4

---

## Test Sign-Off

| Test Case | Status | Tester | Date | Notes |
|-----------|--------|--------|------|-------|
| TC1: Issue Reporting Form | ⏳ Pending | | | |
| TC2: Dashboard Chart | ⏳ Pending | | | |
| TC3: User Management - Create | ⏳ Pending | | | |
| TC4: User Management - Edit | ⏳ Pending | | | |
| TC5: Create Issue per Dept | ⏳ Pending | | | |
| TC6: Filter Consistency | ⏳ Pending | | | |
| TC7: HOD View | ⏳ Pending | | | |
| TC8: Regression Test | ⏳ Pending | | | |

### Status Legend
- ⏳ **Pending**: Not yet tested
- ✅ **Pass**: Test passed successfully
- ❌ **Fail**: Test failed, bug found
- 🔄 **Retest**: Fixed and needs retesting

---

## Approval Sign-Off

**Tested By**: ___________________________  
**Date**: ___________________________  
**Result**: ⏳ Pending / ✅ Approved / ❌ Rejected  

**Developer**: ___________________________  
**Date**: ___________________________  

**Product Owner**: ___________________________  
**Date**: ___________________________  

---

**Document Version**: 1.0  
**Last Updated**: June 9, 2026
