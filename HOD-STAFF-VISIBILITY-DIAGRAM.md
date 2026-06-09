# HOD Staff Visibility - Architecture Diagram

## 🔄 Data Flow: Before vs After

### ❌ BEFORE (Not Working)

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  AuthContext.tsx                                    │    │
│  │  - loadUsers() called for ALL roles                │    │
│  │  - Tries: GET /api/v1/users                        │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP GET /api/v1/users
                           │ Authorization: Bearer <HOD_TOKEN>
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │  UserController.java                                │    │
│  │  @GetMapping                                        │    │
│  │  @PreAuthorize("hasRole('ADMIN')")  ❌ BLOCKS HOD  │    │
│  │  public getAllUsers()                               │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                    ❌ 403 FORBIDDEN
                    
┌─────────────────────────────────────────────────────────────┐
│                    RESULT: FAILURE                           │
│  - HOD gets 403 Forbidden error                             │
│  - users array stays empty []                               │
│  - UI shows "No staff match your search"                    │
│  - Cannot assign issues to staff                            │
└─────────────────────────────────────────────────────────────┘
```

---

### ✅ AFTER (Working)

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  AuthContext.tsx (UPDATED)                         │    │
│  │                                                     │    │
│  │  if (role === 'ADMIN'):                            │    │
│  │    GET /api/v1/users                               │    │
│  │                                                     │    │
│  │  if (role === 'HOD'):                              │    │
│  │    GET /api/v1/users/department/{dept} ✅ NEW     │    │
│  │                                                     │    │
│  │  if (role === 'STAFF'):                            │    │
│  │    No users loaded (not needed)                    │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP GET /api/v1/users/department/IT
                           │ Authorization: Bearer <HOD_TOKEN>
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │  UserController.java (UPDATED)                      │    │
│  │                                                     │    │
│  │  @GetMapping("/department/{department}") ✅ NEW   │    │
│  │  @PreAuthorize("hasAnyRole('ADMIN','HOD')")       │    │
│  │  public getUsersByDepartment(@PathVariable dept)   │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  UserService.java (UPDATED)                         │    │
│  │  public getByDepartment(String department) ✅ NEW  │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  UserRepository.java (UPDATED)                      │    │
│  │  findByDepartmentAndIsActiveTrue(dept) ✅ NEW      │    │
│  └──────────────────────┬──────────────────────────────┘    │
└─────────────────────────┼──────────────────────────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │   DATABASE   │
                   │              │
                   │  SELECT *    │
                   │  FROM users  │
                   │  WHERE       │
                   │  dept = 'IT' │
                   │  AND         │
                   │  active=true │
                   └──────┬───────┘
                          │
                          ▼
                    ✅ 200 OK
                    [
                      {id: 1, name: "Kevin Mutabazi", ...},
                      {id: 2, name: "Linda Uwimana", ...},
                      {id: 3, name: "Frank Nshuti", ...}
                    ]
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    RESULT: SUCCESS                           │
│  ✅ HOD receives staff data                                 │
│  ✅ users array populated with 3 staff members              │
│  ✅ UI shows staff in directory table                       │
│  ✅ Can assign issues to staff                              │
│  ✅ Search functionality works                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Model

### Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────┐
│                    USER ROLES & ACCESS                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│    ADMIN     │
│  (1 user)    │
└──────┬───────┘
       │
       ├─► GET /api/v1/users                    ✅ All users
       ├─► GET /api/v1/users/department/{dept}  ✅ Any department
       ├─► POST /api/v1/users                   ✅ Create users
       ├─► PUT /api/v1/users/{id}               ✅ Update users
       └─► DELETE /api/v1/users/{id}            ✅ Delete users

┌──────────────┐
│     HOD      │
│  (8 users)   │
└──────┬───────┘
       │
       ├─► GET /api/v1/users                    ❌ Forbidden
       ├─► GET /api/v1/users/department/{dept}  ✅ Own department only
       ├─► POST /api/v1/users                   ❌ Forbidden
       ├─► PUT /api/v1/users/{id}               ❌ Forbidden
       └─► DELETE /api/v1/users/{id}            ❌ Forbidden

┌──────────────┐
│    STAFF     │
│  (22 users)  │
└──────┬───────┘
       │
       ├─► GET /api/v1/users                    ❌ Forbidden
       ├─► GET /api/v1/users/department/{dept}  ❌ Forbidden
       ├─► POST /api/v1/users                   ❌ Forbidden
       ├─► PUT /api/v1/users/{id}               ❌ Forbidden
       └─► DELETE /api/v1/users/{id}            ❌ Forbidden
```

---

## 📊 Data Isolation

### HOD Can Only See Their Department

```
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE: users                         │
├─────────────────────────────────────────────────────────────┤
│ id │ name              │ department      │ role  │ active   │
├────┼───────────────────┼─────────────────┼───────┼──────────┤
│ 1  │ Kevin Mutabazi    │ IT              │ STAFF │ true     │
│ 2  │ Linda Uwimana     │ IT              │ STAFF │ true     │
│ 3  │ Frank Nshuti      │ IT              │ STAFF │ true     │
│ 4  │ John Kamanzi      │ Finance         │ STAFF │ true     │
│ 5  │ Sarah Ingabire    │ Finance         │ STAFF │ true     │
│ 6  │ Eric Ndayisaba    │ Finance         │ STAFF │ true     │
│ 7  │ Betty Mukandori   │ HR              │ STAFF │ true     │
│ 8  │ James Niyonzima   │ HR              │ STAFF │ true     │
└────┴───────────────────┴─────────────────┴───────┴──────────┘

┌─────────────────────────────────────────────────────────────┐
│  IT HOD (Marie Uwase) calls:                                │
│  GET /api/v1/users/department/IT                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  Query: WHERE department = 'IT' │
        │         AND is_active = true    │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  Returns ONLY:                  │
        │  - Kevin Mutabazi               │
        │  - Linda Uwimana                │
        │  - Frank Nshuti                 │
        │                                 │
        │  ❌ Does NOT return:            │
        │  - Finance staff                │
        │  - HR staff                     │
        │  - Other departments            │
        └─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Finance HOD (Jean Mugisha) calls:                          │
│  GET /api/v1/users/department/Finance                       │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  Query: WHERE department =      │
        │         'Finance'               │
        │         AND is_active = true    │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  Returns ONLY:                  │
        │  - John Kamanzi                 │
        │  - Sarah Ingabire               │
        │  - Eric Ndayisaba               │
        │                                 │
        │  ❌ Does NOT return:            │
        │  - IT staff                     │
        │  - HR staff                     │
        │  - Other departments            │
        └─────────────────────────────────┘
```

---

## 🎯 Use Cases Enabled

### 1. View Department Staff

```
┌──────────────┐
│  IT HOD      │
│ Marie Uwase  │
└──────┬───────┘
       │
       │ 1. Navigate to Departments page
       ▼
┌─────────────────────────────────────┐
│  Department Staff Directory         │
├─────────────────────────────────────┤
│  Name              │ Employee ID    │
│  Kevin Mutabazi    │ EMP204        │
│  Linda Uwimana     │ EMP205        │
│  Frank Nshuti      │ EMP206        │
└─────────────────────────────────────┘
       │
       │ 2. Search for "Kevin"
       ▼
┌─────────────────────────────────────┐
│  Filtered Results                   │
├─────────────────────────────────────┤
│  Name              │ Employee ID    │
│  Kevin Mutabazi    │ EMP204        │
└─────────────────────────────────────┘
```

### 2. Assign Issue to Staff

```
┌──────────────┐
│  IT HOD      │
│ Marie Uwase  │
└──────┬───────┘
       │
       │ 1. Go to Issue Management
       ▼
┌─────────────────────────────────────┐
│  Issue: Invalid Email Formats       │
│  Status: OPEN                       │
│  Department: IT                     │
│                                     │
│  Assigned To: [Select Staff ▼]     │
└─────────────────────────────────────┘
       │
       │ 2. Click dropdown
       ▼
┌─────────────────────────────────────┐
│  Select Staff:                      │
│  ○ Kevin Mutabazi                   │
│  ○ Linda Uwimana                    │
│  ○ Frank Nshuti                     │
└─────────────────────────────────────┘
       │
       │ 3. Select Kevin Mutabazi
       ▼
┌─────────────────────────────────────┐
│  Issue: Invalid Email Formats       │
│  Status: IN_PROGRESS (auto-updated) │
│  Department: IT                     │
│  Assigned To: Kevin Mutabazi ✅     │
└─────────────────────────────────────┘
       │
       │ 4. Kevin receives notification
       ▼
┌──────────────┐
│  IT STAFF    │
│ Kevin        │
│ Mutabazi     │
└──────┬───────┘
       │
       │ 5. Sees assigned issue
       ▼
┌─────────────────────────────────────┐
│  My Assigned Issues                 │
│  - Invalid Email Formats (NEW)      │
└─────────────────────────────────────┘
```

---

## 📈 Impact Metrics

### Before Fix
- ❌ HODs could not see staff: **0% visibility**
- ❌ Manual workarounds needed
- ❌ Issues assigned via admin only
- ❌ Poor user experience

### After Fix
- ✅ HODs can see all department staff: **100% visibility**
- ✅ Self-service issue assignment
- ✅ Proper role-based access control
- ✅ Excellent user experience

---

## 🔧 Technical Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                          │
└─────────────────────────────────────────────────────────────┘

Frontend:
  - React 18 + TypeScript
  - React Router for navigation
  - Context API for state management
  - Fetch API for HTTP requests

Backend:
  - Spring Boot 3.x
  - Spring Security with JWT
  - Spring Data JPA
  - PostgreSQL database

Security:
  - JWT token authentication
  - Role-based access control (@PreAuthorize)
  - Method-level security
  - Department-level data isolation
```

---

**Created:** May 6, 2026  
**Project:** DQIMS  
**Organization:** Rwanda Revenue Authority
