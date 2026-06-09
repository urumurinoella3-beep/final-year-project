# 📋 Audit & History Module - Complete Guide

## 🎯 1. SIMPLE FUNCTIONAL EXPLANATION

**The Audit & History module records all important actions performed in the system, such as issue creation, status updates, assignments, and user activities. It helps track who did what and when, ensuring accountability and transparency.**

### Key Benefits:
- ✅ **Accountability** - Know who performed each action
- ✅ **Transparency** - Complete activity history
- ✅ **Security** - Track suspicious activities
- ✅ **Compliance** - Meet audit requirements
- ✅ **Debugging** - Trace issues back to their source

---

## 🧠 2. WHAT INFORMATION IS STORED (VERY IMPORTANT)

### 👉 Every action creates a log record

### 📋 AUDIT LOG FIELDS

This is what fills your `audit_logs` table:

| Field | Description | Example |
|-------|-------------|---------|
| **id** | Unique log ID | 1, 2, 3... |
| **user_id** | Who did the action | 5 (John's ID) |
| **user_name** | User's full name | John Kamanzi |
| **user_role** | User's role | STAFF, HOD, ADMIN |
| **action** | What happened | STATUS_CHANGED, ISSUE_CREATED |
| **entity_type** | What was affected | Issue, User, Department |
| **entity_id** | ID of affected item | 12 (Issue #12) |
| **details** | Additional info (JSON) | `{"oldStatus": "OPEN", "newStatus": "IN_PROGRESS"}` |
| **ip_address** | User's IP | 192.168.1.102 |
| **user_agent** | Browser info | Mozilla/5.0... |
| **created_at** | Date and time | 2024-04-28 10:30:00 |

### 📌 Example Records:

| User | Role | Action | Description | Issue | Time |
|------|------|--------|-------------|-------|------|
| Sarah Ingabire | STAFF | STATUS_CHANGED | Changed to Resolved | #12 | 10:30 |
| Jean Mugisha | HOD | ISSUE_ASSIGNED | Assigned to Sarah | #12 | 09:00 |
| System Admin | ADMIN | USER_CREATED | Created John Kamanzi | - | 08:00 |

---

## ⚙️ 3. HOW IT WORKS (IMPLEMENTATION LOGIC)

### 🔄 Flow:

```
1. User performs action (e.g., "Resolve Issue")
   ↓
2. System captures action details
   ↓
3. System saves log to database
   ↓
4. Audit page displays logs
```

### 🧩 Example Scenario:

**👉 Member clicks "Resolve Issue #12"**

System automatically saves:
```json
{
  "user_id": 5,
  "user_name": "Sarah Ingabire",
  "user_role": "STAFF",
  "action": "STATUS_CHANGED",
  "entity_type": "Issue",
  "entity_id": 12,
  "details": "{\"oldStatus\": \"IN_PROGRESS\", \"newStatus\": \"RESOLVED\"}",
  "ip_address": "192.168.1.102",
  "created_at": "2024-04-28 10:30:00"
}
```

---

## 🔧 4. BACKEND IMPLEMENTATION

### API Endpoints

#### 1. Get All Audit Logs (with filters)
```http
GET /api/v1/audit-logs
GET /api/v1/audit-logs?userId=5
GET /api/v1/audit-logs?action=STATUS_CHANGED
GET /api/v1/audit-logs?entityType=Issue
GET /api/v1/audit-logs?startDate=2024-04-01T00:00:00
GET /api/v1/audit-logs?endDate=2024-04-30T23:59:59
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 5,
    "userName": "Sarah Ingabire",
    "userRole": "STAFF",
    "action": "STATUS_CHANGED",
    "entityType": "Issue",
    "entityId": 12,
    "details": "{\"oldStatus\": \"IN_PROGRESS\", \"newStatus\": \"RESOLVED\"}",
    "ipAddress": "192.168.1.102",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2024-04-28 10:30:00"
  }
]
```

#### 2. Get Audit Logs for Specific Issue
```http
GET /api/v1/audit-logs/issue/12
```

#### 3. Get Audit Logs for Specific User
```http
GET /api/v1/audit-logs/user/5
```

#### 4. Get Available Action Types
```http
GET /api/v1/audit-logs/actions
```

**Response:**
```json
[
  "COMMENT_ADDED",
  "DEPARTMENT_CREATED",
  "ISSUE_ASSIGNED",
  "ISSUE_CLOSED",
  "ISSUE_CREATED",
  "LOGIN",
  "PRIORITY_CHANGED",
  "STATUS_CHANGED",
  "USER_CREATED"
]
```

#### 5. Get Available Entity Types
```http
GET /api/v1/audit-logs/entity-types
```

**Response:**
```json
[
  "Department",
  "Issue",
  "User"
]
```

---

## 📝 5. ACTION TYPES

### Complete List of Actions Logged:

| Action | When It Happens | Example |
|--------|----------------|---------|
| **LOGIN** | User logs in | User successfully authenticated |
| **LOGOUT** | User logs out | User session ended |
| **USER_CREATED** | Admin creates user | New staff member added |
| **USER_UPDATED** | Admin updates user | Role changed from STAFF to HOD |
| **USER_DEACTIVATED** | Admin deactivates user | Account disabled |
| **DEPARTMENT_CREATED** | Admin creates department | New department added |
| **DEPARTMENT_UPDATED** | Admin updates department | Department description changed |
| **ISSUE_CREATED** | User reports issue | New data quality issue reported |
| **ISSUE_ASSIGNED** | HOD assigns issue | Issue assigned to staff member |
| **ISSUE_UPDATED** | User updates issue | Issue details modified |
| **STATUS_CHANGED** | Status changes | OPEN → IN_PROGRESS |
| **PRIORITY_CHANGED** | Priority changes | Medium → High |
| **COMMENT_ADDED** | User adds comment | Progress update added |
| **ISSUE_RESOLVED** | Staff resolves issue | Issue marked as resolved |
| **ISSUE_CLOSED** | HOD closes issue | Issue approved and closed |
| **ISSUE_REOPENED** | HOD reopens issue | Issue needs more work |
| **REPORT_GENERATED** | User generates report | PDF report created |
| **DATA_VALIDATION** | User validates data | CSV file validated |

---

## 🎨 6. FRONTEND IMPLEMENTATION

### Audit Log Page Components

#### 1. **Filters Section**
```typescript
// Filter options
- User dropdown (Admin only)
- Action type dropdown
- Entity type dropdown
- Date range picker (start date, end date)
- Search button
- Clear filters button
```

#### 2. **Audit Log Table**
```typescript
// Table columns
| User | Role | Action | Description | Entity | Time |
|------|------|--------|-------------|--------|------|
```

#### 3. **Details Modal**
```typescript
// When clicking on a log entry
- Full details in JSON format
- IP address
- User agent
- Complete timestamp
```

### Sample React Component Structure:

```typescript
// AuditLogPage.tsx
const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    userId: null,
    action: '',
    entityType: '',
    startDate: null,
    endDate: null
  });

  const fetchLogs = async () => {
    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.action) params.append('action', filters.action);
    if (filters.entityType) params.append('entityType', filters.entityType);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await fetch(`/api/v1/audit-logs?${params}`);
    const data = await response.json();
    setLogs(data);
  };

  return (
    <div>
      {/* Filters */}
      <FilterSection filters={filters} setFilters={setFilters} onSearch={fetchLogs} />
      
      {/* Table */}
      <AuditLogTable logs={logs} />
    </div>
  );
};
```

---

## 🔒 7. SECURITY & PERMISSIONS

### Access Control:

| Role | Can View | Can Filter |
|------|----------|------------|
| **ADMIN** | All logs | All filters |
| **HOD** | Own logs only | Limited filters |
| **STAFF** | Own logs only | Limited filters |

### Rules:
- ✅ Admin can see ALL audit logs
- ✅ Admin can filter by any user
- ✅ HOD/Staff can only see their own logs
- ✅ HOD/Staff cannot filter by other users
- ✅ All users can filter by action, entity type, and date

---

## 📊 8. SAMPLE DATA (Already Seeded)

Your database already has **25+ audit log entries** including:

### Login Activities:
- Admin login (30 days ago)
- Finance HOD login (25 days ago)
- Finance Staff login (20 days ago)

### User Management:
- User created: John Kamanzi (28 days ago)
- User created: Sarah Ingabire (27 days ago)
- User updated: Kevin Mutabazi (22 days ago)

### Department Activities:
- Department created: Finance (29 days ago)
- Department created: IT (29 days ago)

### Issue Activities:
- Issue created (18 days ago)
- Issue assigned (17 days ago)
- Status changed: OPEN → IN_PROGRESS (16 days ago)
- Priority changed: Medium → High (15 days ago)
- Comment added (14 days ago)
- Status changed: IN_PROGRESS → RESOLVED (10 days ago)
- Issue closed (8 days ago)

### Report & Validation:
- Report generated (7 days ago)
- Data validation (12 days ago)

---

## 🧪 9. TESTING THE MODULE

### Test Scenarios:

#### 1. **View All Logs (Admin)**
```bash
curl -H "Authorization: Bearer {admin_token}" \
  http://localhost:8080/api/v1/audit-logs
```

#### 2. **Filter by Action**
```bash
curl -H "Authorization: Bearer {admin_token}" \
  "http://localhost:8080/api/v1/audit-logs?action=STATUS_CHANGED"
```

#### 3. **Filter by User**
```bash
curl -H "Authorization: Bearer {admin_token}" \
  "http://localhost:8080/api/v1/audit-logs?userId=5"
```

#### 4. **Filter by Date Range**
```bash
curl -H "Authorization: Bearer {admin_token}" \
  "http://localhost:8080/api/v1/audit-logs?startDate=2024-04-01T00:00:00&endDate=2024-04-30T23:59:59"
```

#### 5. **Get Issue History**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/v1/audit-logs/issue/12
```

---

## 📈 10. USAGE EXAMPLES

### Example 1: Track Issue Lifecycle
```
View audit logs for Issue #12:
1. Issue created by Sarah (Staff) - 18 days ago
2. Issue assigned to Sarah by Jean (HOD) - 17 days ago
3. Status changed to IN_PROGRESS by Sarah - 16 days ago
4. Priority changed to High by Jean (HOD) - 15 days ago
5. Comment added by Sarah - 14 days ago
6. Status changed to RESOLVED by Sarah - 10 days ago
7. Issue closed by Jean (HOD) - 8 days ago
```

### Example 2: User Activity Report
```
View all actions by Sarah Ingabire:
- Logged in 5 times
- Created 3 issues
- Resolved 2 issues
- Added 8 comments
- Performed 2 data validations
```

### Example 3: Security Audit
```
View all LOGIN actions:
- Admin: 10 logins from IP 192.168.1.100
- Finance HOD: 15 logins from IP 192.168.1.101
- Finance Staff: 20 logins from IP 192.168.1.102
```

---

## ✅ 11. VERIFICATION CHECKLIST

- [x] Backend API endpoints created
- [x] Audit logging service implemented
- [x] Sample data seeded (25+ records)
- [x] Filtering functionality added
- [x] Security permissions implemented
- [x] All action types defined
- [x] Documentation complete

---

## 🚀 12. NEXT STEPS

1. **Test the API:**
   - Use Postman or curl to test endpoints
   - Verify filtering works correctly
   - Check permissions (Admin vs Staff)

2. **Create Frontend:**
   - Build Audit Log page
   - Add filters UI
   - Create audit log table
   - Add details modal

3. **Integrate Logging:**
   - Ensure all services call `auditLogService.log()`
   - Verify logs are created for all actions
   - Test with real user actions

---

## 📞 Support

Your Audit & History module is **FULLY IMPLEMENTED** on the backend!

**Status:** ✅ READY  
**API:** http://localhost:8080/api/v1/audit-logs  
**Sample Data:** 25+ audit log records  
**Documentation:** Complete

All you need now is to create the frontend UI to display the logs!

---

**Last Updated:** April 28, 2026  
**Project:** DQIMS - Rwanda Revenue Authority  
**Module:** Audit & History - COMPLETE ✅
