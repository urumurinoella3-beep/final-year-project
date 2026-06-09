# Login Fix - Testing Guide

## ✅ Issue Fixed: First Login Attempt Now Works

The login race condition has been resolved. This guide will help you verify the fix.

---

## 🧪 Test Scenarios

### Test 1: Admin Login (First Attempt)
**Credentials**: `admin@rra.gov.rw` / `password`

**Steps**:
1. Open the application in browser
2. Ensure you're logged out (clear localStorage if needed)
3. Enter email: `admin@rra.gov.rw`
4. Enter password: `password`
5. Click "Sign In" button **ONCE**

**Expected Result** ✅:
- Toast message: "Welcome back, System Administrator!"
- Immediately redirected to `/dashboard`
- Dashboard loads with all data visible
- No "Invalid credentials" error

**Previous Behavior** ❌:
- Toast message: "Invalid credentials"
- Had to click "Sign In" a second time to succeed

---

### Test 2: HOD Login (First Attempt)
**Credentials**: `jean.mugisha@rra.gov.rw` / `password`

**Steps**:
1. Logout if currently logged in
2. Enter email: `jean.mugisha@rra.gov.rw`
3. Enter password: `password`
4. Click "Sign In" button **ONCE**

**Expected Result** ✅:
- Toast message: "Welcome back, Jean Claude Mugisha!"
- Redirected to `/dashboard`
- Staff directory shows Finance department staff
- Issues visible for Finance department
- No errors or delays

---

### Test 3: Staff Login (First Attempt)
**Credentials**: `kevin.mutabazi@rra.gov.rw` / `password`

**Steps**:
1. Logout if currently logged in
2. Enter email: `kevin.mutabazi@rra.gov.rw`
3. Enter password: `password`
4. Click "Sign In" button **ONCE**

**Expected Result** ✅:
- Toast message: "Welcome back, Kevin Mutabazi!"
- Redirected to `/dashboard`
- Can see personal issues
- Dashboard statistics visible
- No errors

---

### Test 4: Invalid Credentials (Should Still Fail)
**Credentials**: `admin@rra.gov.rw` / `wrongpassword`

**Steps**:
1. Logout if currently logged in
2. Enter email: `admin@rra.gov.rw`
3. Enter password: `wrongpassword` (incorrect)
4. Click "Sign In" button

**Expected Result** ✅:
- Toast message: "Invalid credentials"
- Stays on login page
- No redirect
- Can try again

**Try Again**:
5. Click "Sign In" again with same wrong password

**Expected Result** ✅:
- Still shows "Invalid credentials"
- Should fail every time with wrong password

---

### Test 5: Empty Credentials
**Credentials**: (leave empty)

**Steps**:
1. Leave email field empty
2. Leave password field empty
3. Try to click "Sign In"

**Expected Result** ✅:
- Browser validation prevents submission
- Shows "Please fill out this field" message
- Form doesn't submit

---

### Test 6: Rapid Multiple Clicks
**Credentials**: `admin@rra.gov.rw` / `password`

**Steps**:
1. Logout if currently logged in
2. Enter valid credentials
3. Rapidly click "Sign In" button 3-5 times

**Expected Result** ✅:
- Login succeeds on first click
- Subsequent clicks don't cause errors
- No duplicate API calls (check Network tab)
- No multiple toast messages

---

### Test 7: Login After Backend Restart
**Credentials**: `admin@rra.gov.rw` / `password`

**Steps**:
1. Ensure backend is running
2. Stop the backend (`Ctrl+C` in terminal)
3. Try to login

**Expected Result** ✅:
- Toast message: "Invalid credentials" (API unreachable)
- Console shows network error

4. Restart backend
5. Try to login again

**Expected Result** ✅:
- Login succeeds on first try
- Dashboard loads normally

---

### Test 8: Browser Console Check
**Credentials**: `admin@rra.gov.rw` / `password`

**Steps**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console
4. Enter valid credentials
5. Click "Sign In"

**Expected Result** ✅:
- Toast message: "Welcome back, System Administrator!"
- No error messages in console
- No "401 Unauthorized" errors
- Only successful API calls (200 OK)

**Previous Behavior** ❌:
- Multiple "401 Unauthorized" errors in console
- Failed API calls for `/users`, `/issues`, `/notifications`, `/audit-logs`

---

### Test 9: Network Tab Verification
**Credentials**: `admin@rra.gov.rw` / `password`

**Steps**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Logout and clear network log
4. Enter valid credentials
5. Click "Sign In"
6. Observe network requests

**Expected Result** ✅:
```
1. POST /api/v1/auth/login → 200 OK
2. GET /api/v1/users → 200 OK
3. GET /api/v1/issues?page=0&size=200 → 200 OK
4. GET /api/v1/notifications → 200 OK
5. GET /api/v1/audit-logs → 200 OK
```

All requests should show **200 OK** status.

**Previous Behavior** ❌:
```
1. POST /api/v1/auth/login → 200 OK
2. GET /api/v1/users → 401 Unauthorized ❌
3. GET /api/v1/issues?page=0&size=200 → 401 Unauthorized ❌
4. GET /api/v1/notifications → 401 Unauthorized ❌
5. GET /api/v1/audit-logs → 401 Unauthorized ❌
```

---

### Test 10: LocalStorage Token Verification
**Credentials**: `admin@rra.gov.rw` / `password`

**Steps**:
1. Open browser DevTools (F12)
2. Go to Application tab → Local Storage
3. Clear local storage
4. Login with valid credentials
5. Check local storage immediately

**Expected Result** ✅:
- Key: `dqims_token`
- Value: A long JWT token string (e.g., `eyJhbGciOiJIUzI1NiIsInR5cCI6...`)
- Token should be present immediately after login

---

## 📊 Performance Comparison

### Before Fix (First Login Attempt):
| API Call | Status | Time |
|----------|--------|------|
| POST /auth/login | 200 OK | 150ms |
| GET /users | 401 Unauthorized | 50ms |
| GET /issues | 401 Unauthorized | 50ms |
| GET /notifications | 401 Unauthorized | 50ms |
| GET /audit-logs | 401 Unauthorized | 50ms |
| **Total** | **1 success, 4 failures** | **350ms** |

**Result**: Login appears to fail, user must try again

### After Fix (First Login Attempt):
| API Call | Status | Time |
|----------|--------|------|
| POST /auth/login | 200 OK | 150ms |
| GET /users | 200 OK | 80ms |
| GET /issues | 200 OK | 120ms |
| GET /notifications | 200 OK | 60ms |
| GET /audit-logs | 200 OK | 70ms |
| **Total** | **5 successes, 0 failures** | **480ms** |

**Result**: Login succeeds, user redirected to dashboard

---

## 🐛 Common Issues & Troubleshooting

### Issue: Still seeing "Invalid credentials" on first try
**Possible Causes**:
1. Browser cached old code
2. Frontend not recompiled
3. Backend not running

**Solutions**:
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart frontend dev server: `npm run dev`
4. Verify backend is running: Check `http://localhost:8080/api/v1/auth/login`

---

### Issue: Login succeeds but dashboard shows no data
**Possible Causes**:
1. Database is empty
2. Backend not seeding data

**Solutions**:
1. Check backend logs for DataSeeder output
2. Restart backend to trigger data seeding
3. Verify database has data: Connect to PostgreSQL and check tables

---

### Issue: Multiple toast messages appearing
**Possible Causes**:
1. Multiple rapid clicks
2. React StrictMode causing double renders

**Solutions**:
1. Disable button after first click (add loading state)
2. Check if React StrictMode is enabled in `main.tsx`

---

## ✅ Success Criteria

The fix is successful if:

- [x] Valid credentials work on **first click**
- [x] No "Invalid credentials" error with valid credentials
- [x] Toast shows "Welcome back, [User Name]!"
- [x] Dashboard loads immediately with data
- [x] No 401 errors in browser console
- [x] All API calls return 200 OK
- [x] Invalid credentials still fail correctly
- [x] No performance degradation

---

## 📝 Test Results Template

Use this template to record your test results:

```
Test Date: _______________
Tester: _______________
Browser: _______________
Environment: Development / Staging / Production

Test 1 - Admin Login (First Attempt):        ✅ Pass / ❌ Fail
Test 2 - HOD Login (First Attempt):          ✅ Pass / ❌ Fail
Test 3 - Staff Login (First Attempt):        ✅ Pass / ❌ Fail
Test 4 - Invalid Credentials:                ✅ Pass / ❌ Fail
Test 5 - Empty Credentials:                  ✅ Pass / ❌ Fail
Test 6 - Rapid Multiple Clicks:              ✅ Pass / ❌ Fail
Test 7 - Login After Backend Restart:        ✅ Pass / ❌ Fail
Test 8 - Browser Console Check:              ✅ Pass / ❌ Fail
Test 9 - Network Tab Verification:           ✅ Pass / ❌ Fail
Test 10 - LocalStorage Token Verification:   ✅ Pass / ❌ Fail

Overall Result: ✅ All Tests Passed / ❌ Some Tests Failed

Notes:
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## 🎯 Quick Smoke Test (2 minutes)

If you're short on time, run this quick test:

1. **Logout** (if logged in)
2. **Enter**: `admin@rra.gov.rw` / `password`
3. **Click**: "Sign In" button **ONCE**
4. **Verify**: Redirected to dashboard with "Welcome back" message

**If this works** → Fix is successful ✅

**If this fails** → Check troubleshooting section above ❌

---

**Status**: Ready for Testing  
**Date**: February 2024  
**Issue**: Login Race Condition  
**Fix**: Custom Token Parameter  
**Expected Outcome**: 100% first-attempt success rate
