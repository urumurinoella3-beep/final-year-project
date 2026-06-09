# HOD Staff Visibility - Testing Guide

## ✅ What Was Fixed

HOD users can now see all staff members in their department and assign issues to them. Previously, the staff directory showed "No staff match your search" even though staff existed in the database.

## 🧪 Test Scenarios

### Test 1: Login as IT HOD and View Staff

**Credentials:**
- Email: `marie.uwase@rra.gov.rw`
- Password: `password`
- Role: HOD
- Department: IT

**Expected Staff to See (3 staff members):**
1. Kevin Mutabazi (EMP204) - kevin.mutabazi@rra.gov.rw
2. Linda Uwimana (EMP205) - linda.uwimana@rra.gov.rw
3. Frank Nshuti (EMP206) - frank.nshuti@rra.gov.rw

**Steps:**
1. Open browser: http://localhost:5173
2. Login with Marie Uwase credentials
3. Navigate to "Departments" page (sidebar menu)
4. Look at the top cards - should show:
   - Your department: **IT**
   - Staff in department: **3**
   - Open cases (issues): (varies)
5. Scroll down to "Department staff directory" table
6. **VERIFY:** Table shows all 3 IT staff members with:
   - Name
   - Employee ID
   - Email
   - Phone
   - Role badge
7. **Test Search:** Type "Kevin" in search box
   - Should filter to show only Kevin Mutabazi
8. **Test Search:** Type "EMP205" in search box
   - Should filter to show only Linda Uwimana
9. **Test Search:** Clear search
   - Should show all 3 staff again

---

### Test 2: Login as Finance HOD and View Staff

**Credentials:**
- Email: `jean.mugisha@rra.gov.rw`
- Password: `password`
- Role: HOD
- Department: Finance

**Expected Staff to See (3 staff members):**
1. John Kamanzi (EMP201) - john.kamanzi@rra.gov.rw
2. Sarah Ingabire (EMP202) - sarah.ingabire@rra.gov.rw
3. Eric Ndayisaba (EMP203) - eric.ndayisaba@rra.gov.rw

**Steps:**
1. Logout (if logged in)
2. Login with Jean Claude Mugisha credentials
3. Navigate to "Departments" page
4. **VERIFY:** Top card shows "Your department: **Finance**"
5. **VERIFY:** "Staff in department" shows **3**
6. **VERIFY:** Staff directory table shows all 3 Finance staff
7. **Test:** Search for "Sarah" - should show only Sarah Ingabire
8. **Test:** Search for "ingabire" (lowercase) - should still work

---

### Test 3: Assign Issue to Staff (HOD)

**Use IT HOD (Marie Uwase):**

**Steps:**
1. Login as Marie Uwase (IT HOD)
2. Navigate to "Issue Management" page
3. Find an IT department issue (e.g., "Invalid Email Formats in User Database")
4. In the "Assigned To" column, click the dropdown
5. **VERIFY:** Dropdown shows all 3 IT staff:
   - Kevin Mutabazi
   - Linda Uwimana
   - Frank Nshuti
6. Select "Kevin Mutabazi"
7. **VERIFY:** Success toast appears: "Issue updated successfully"
8. **VERIFY:** Issue now shows "Kevin Mutabazi" in Assigned To column
9. Refresh the page
10. **VERIFY:** Assignment persists (still shows Kevin Mutabazi)

---

### Test 4: Assign Issue from Department Dialog

**Use Finance HOD (Jean Claude Mugisha):**

**Steps:**
1. Login as Jean Claude Mugisha (Finance HOD)
2. Navigate to "Departments" page
3. Find the Finance department card
4. Click "View Issues" button
5. A dialog opens showing Finance department issues
6. Find an unassigned issue or one you want to reassign
7. Click the "Assigned To" dropdown
8. **VERIFY:** Dropdown shows all 3 Finance staff:
   - John Kamanzi
   - Sarah Ingabire
   - Eric Ndayisaba
9. Select a staff member
10. **VERIFY:** Assignment is saved
11. Close dialog and reopen
12. **VERIFY:** Assignment persists

---

### Test 5: Admin Can See All Staff

**Credentials:**
- Email: `admin@rra.gov.rw`
- Password: `password`
- Role: ADMIN

**Steps:**
1. Login as System Administrator
2. Navigate to "Departments" page
3. **VERIFY:** Top cards show:
   - Total Departments: **8**
   - Total Staff: **31** (1 admin + 8 HODs + 22 staff)
   - Active Issues: (varies)
4. Scroll down to department cards
5. **VERIFY:** All 8 departments are visible:
   - Finance, IT, HR, Operations, Customs, VAT, Compliance, Data Management
6. Each department card shows:
   - Total staff count
   - HODs count
   - Staff count
   - Staff preview (first 3 members)
7. Click "View Issues" on any department
8. **VERIFY:** Can assign issues to any staff in that department

---

### Test 6: Staff Cannot See Other Staff

**Credentials:**
- Email: `kevin.mutabazi@rra.gov.rw`
- Password: `password`
- Role: STAFF
- Department: IT

**Steps:**
1. Login as Kevin Mutabazi (IT Staff)
2. Navigate to sidebar menu
3. **VERIFY:** "Departments" menu item is NOT visible (or redirects to dashboard)
4. Navigate to "Issue Management"
5. **VERIFY:** Only sees issues assigned to him or reported by him
6. **VERIFY:** Cannot assign issues to other staff (no dropdown)

---

## 🔍 Backend API Testing

### Test API Endpoint Directly

**Test 1: Get IT Department Users (as HOD)**

```bash
# First, login to get token
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "marie.uwase@rra.gov.rw",
    "password": "password"
  }'

# Copy the token from response, then:
curl -X GET http://localhost:8080/api/v1/users/department/IT \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
[
  {
    "id": "...",
    "employeeId": "EMP204",
    "name": "Kevin Mutabazi",
    "email": "kevin.mutabazi@rra.gov.rw",
    "phone": "+250788000204",
    "role": "STAFF",
    "department": "IT",
    "isActive": true,
    "isFirstLogin": false
  },
  {
    "id": "...",
    "employeeId": "EMP205",
    "name": "Linda Uwimana",
    "email": "linda.uwimana@rra.gov.rw",
    "phone": "+250788000205",
    "role": "STAFF",
    "department": "IT",
    "isActive": true,
    "isFirstLogin": false
  },
  {
    "id": "...",
    "employeeId": "EMP206",
    "name": "Frank Nshuti",
    "email": "frank.nshuti@rra.gov.rw",
    "phone": "+250788000206",
    "role": "STAFF",
    "department": "IT",
    "isActive": true,
    "isFirstLogin": false
  }
]
```

**Test 2: Try to Access as STAFF (Should Fail)**

```bash
# Login as staff
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "kevin.mutabazi@rra.gov.rw",
    "password": "password"
  }'

# Try to get department users (should get 403 Forbidden)
curl -X GET http://localhost:8080/api/v1/users/department/IT \
  -H "Authorization: Bearer STAFF_TOKEN_HERE"
```

**Expected Response:** 403 Forbidden

---

## 🐛 Troubleshooting

### Issue: "No staff match your search" still appears

**Check:**
1. Backend is running: `http://localhost:8080/actuator/health`
2. Frontend is running: `http://localhost:5173`
3. Browser console for errors (F12 → Console tab)
4. Network tab shows successful API call to `/api/v1/users/department/IT`

**Solution:**
1. Clear browser cache and cookies
2. Logout and login again
3. Check backend logs for errors
4. Verify database has staff: 
   ```sql
   SELECT * FROM users WHERE department = 'IT' AND is_active = true;
   ```

### Issue: Dropdown shows no staff when assigning

**Check:**
1. You're logged in as HOD (not STAFF)
2. Issue belongs to your department
3. Staff exist in your department
4. Browser console for errors

**Solution:**
1. Refresh the page
2. Logout and login again
3. Check that `users` array in AuthContext is populated

### Issue: 403 Forbidden error

**Check:**
1. Token is valid (not expired)
2. User has correct role (HOD or ADMIN)
3. Backend SecurityConfig allows the endpoint

**Solution:**
1. Logout and login again to get fresh token
2. Check backend logs for security errors

---

## ✅ Success Criteria

All tests pass when:

- ✅ HOD can see all staff in their department
- ✅ Staff directory table shows correct data
- ✅ Search functionality works
- ✅ HOD can assign issues to staff
- ✅ Assignments persist after page refresh
- ✅ Admin can see all staff across all departments
- ✅ Staff cannot access department management
- ✅ API endpoint returns correct data
- ✅ Security restrictions work (403 for unauthorized access)

---

## 📊 Test Data Reference

### All HODs and Their Departments

| HOD Name | Email | Department | Staff Count |
|----------|-------|------------|-------------|
| Jean Claude Mugisha | jean.mugisha@rra.gov.rw | Finance | 3 |
| Marie Uwase | marie.uwase@rra.gov.rw | IT | 3 |
| Patrick Nkurunziza | patrick.nkurunziza@rra.gov.rw | HR | 2 |
| Grace Mukamana | grace.mukamana@rra.gov.rw | Operations | 3 |
| David Habimana | david.habimana@rra.gov.rw | Customs | 3 |
| Alice Uwera | alice.uwera@rra.gov.rw | VAT | 3 |
| Emmanuel Bizimana | emmanuel.bizimana@rra.gov.rw | Compliance | 2 |
| Diane Umutoni | diane.umutoni@rra.gov.rw | Data Management | 3 |

**Total Staff:** 22 across 8 departments

---

## 🎯 Next Steps After Testing

If all tests pass:
1. ✅ Mark this feature as complete
2. ✅ Document in user manual
3. ✅ Train HOD users on the feature
4. ✅ Monitor for any issues in production

If tests fail:
1. Check browser console for errors
2. Check backend logs
3. Verify database has correct data
4. Review the fix implementation
5. Contact development team

---

**Testing Date:** _____________  
**Tested By:** _____________  
**Status:** ⬜ Pass ⬜ Fail  
**Notes:** _____________________________________________

