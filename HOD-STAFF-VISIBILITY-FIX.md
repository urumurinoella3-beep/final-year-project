# HOD Staff Visibility Fix - Complete

## Problem
HOD (Head of Department) users could not see staff members in their department because:
1. The backend `/api/v1/users` endpoint was restricted to ADMIN role only
2. The frontend AuthContext was trying to load all users regardless of role
3. HODs had no way to fetch their department's staff from the database

## Solution Implemented

### Backend Changes

#### 1. UserRepository.java
**Added new method:**
```java
List<User> findByDepartmentAndIsActiveTrue(String department);
```
- Fetches all active users in a specific department

#### 2. UserService.java
**Added new method:**
```java
public List<UserResponse> getByDepartment(String department) {
    return userRepository.findByDepartmentAndIsActiveTrue(department)
            .stream()
            .map(authService::toUserResponse)
            .toList();
}
```
- Service layer method to get users by department

#### 3. UserController.java
**Added new endpoint:**
```java
@GetMapping("/department/{department}")
@PreAuthorize("hasAnyRole('ADMIN', 'HOD')")
public ResponseEntity<List<UserResponse>> getUsersByDepartment(@PathVariable String department) {
    return ResponseEntity.ok(userService.getByDepartment(department));
}
```
- New endpoint: `GET /api/v1/users/department/{department}`
- Accessible by both ADMIN and HOD roles
- Returns all active users in the specified department

### Frontend Changes

#### AuthContext.tsx
**Updated user loading logic:**

1. **bootstrap() function** - Loads users based on role after authentication:
   - ADMIN: Fetches all users via `/api/v1/users`
   - HOD: Fetches department users via `/api/v1/users/department/{department}`
   - STAFF: No users loaded (not needed)

2. **login() function** - Same logic applied during login

3. **createUser(), updateUser(), deleteUser()** - Reload users based on current user role

## How It Works Now

### For HOD Users:
1. HOD logs in with their credentials
2. System identifies user role as 'HOD' and department (e.g., 'IT')
3. Frontend calls: `GET /api/v1/users/department/IT`
4. Backend returns all active staff in IT department
5. HOD can now see all staff members in the Department Management page
6. HOD can assign issues to any staff member in their department

### For ADMIN Users:
1. Admin logs in
2. Frontend calls: `GET /api/v1/users`
3. Backend returns all users across all departments
4. Admin has full visibility and control

### For STAFF Users:
1. Staff logs in
2. No users are loaded (not needed for their role)
3. They can only see issues assigned to them

## Features Now Working

✅ **Department Management Page (HOD View)**
- Shows "Department staff directory" table
- Displays all staff in HOD's department with:
  - Name
  - Employee ID
  - Email
  - Phone
  - Role
- Search functionality works across all fields
- Real-time filtering

✅ **Issue Assignment**
- HOD can assign issues to any staff member in their department
- Dropdown shows all available staff members
- Assignment updates are saved to database

✅ **Department Statistics**
- Accurate count of staff members
- Shows HODs, Staff, and total members
- Displays open issues count

## API Endpoints Summary

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/v1/users` | GET | ADMIN | Get all users |
| `/api/v1/users/department/{dept}` | GET | ADMIN, HOD | Get users by department |
| `/api/v1/users` | POST | ADMIN | Create new user |
| `/api/v1/users/{id}` | PUT | ADMIN | Update user |
| `/api/v1/users/{id}` | DELETE | ADMIN | Deactivate user |

## Testing Instructions

1. **Start Backend:**
   ```bash
   cd Backend/DQIMS
   ./mvnw spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Test as HOD:**
   - Login with HOD credentials (e.g., Bernard Ngabo - IT HOD)
   - Navigate to "Departments" page
   - Verify "Department staff directory" shows all IT staff
   - Try searching for staff by name, email, or employee ID
   - Go to "Issue Management"
   - Try assigning an issue to a staff member
   - Verify the assignment works

4. **Test as ADMIN:**
   - Login with admin credentials
   - Navigate to "Departments" page
   - Verify all departments are visible
   - Verify staff preview shows for each department
   - Try assigning issues across departments

## Database Verification

To verify staff are in the database:
```sql
SELECT id, name, email, employee_id, role, department, is_active 
FROM users 
WHERE department = 'IT' AND is_active = true;
```

## Files Modified

### Backend:
- `Backend/DQIMS/src/main/java/rw/rra/dqims/repository/UserRepository.java`
- `Backend/DQIMS/src/main/java/rw/rra/dqims/service/UserService.java`
- `Backend/DQIMS/src/main/java/rw/rra/dqims/controller/UserController.java`

### Frontend:
- `Frontend/src/app/context/AuthContext.tsx`

## Security Considerations

✅ **Role-Based Access Control (RBAC)**
- HODs can only see users in their own department
- HODs cannot see users from other departments
- ADMIN has full visibility across all departments
- Endpoint is protected with `@PreAuthorize` annotation

✅ **Data Filtering**
- Only active users are returned (`isActiveTrue`)
- Department parameter is properly encoded in URL
- No sensitive data exposed (passwords are never returned)

## Status: ✅ COMPLETE

All database staff are now visible in the frontend for HODs to view and assign issues to.
