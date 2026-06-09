# 🧪 Audit & History API - Testing Guide

## 🚀 Quick Start

Your Audit & History API is **LIVE** and ready to test!

**Base URL:** `http://localhost:8080/api/v1/audit-logs`

---

## 🔐 Authentication

All endpoints require JWT token in header:
```
Authorization: Bearer {your_jwt_token}
```

### Get Token:
```bash
# Login as Admin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rra.gov.rw",
    "password": "password"
  }'
```

---

## 📋 API Endpoints

### 1. Get All Audit Logs
```bash
GET /api/v1/audit-logs
```

**Example:**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/v1/audit-logs
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "userName": "System Administrator",
    "userRole": "ADMIN",
    "action": "LOGIN",
    "entityType": null,
    "entityId": null,
    "details": "{\"success\": true, \"role\": \"ADMIN\"}",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2024-03-29 10:00:00"
  }
]
```

---

### 2. Filter by User (Admin Only)
```bash
GET /api/v1/audit-logs?userId=5
```

**Example:**
```bash
curl -H "Authorization: Bearer {admin_token}" \
  "http://localhost:8080/api/v1/audit-logs?userId=5"
```

---

### 3. Filter by Action
```bash
GET /api/v1/audit-logs?action=STATUS_CHANGED
```

**Example:**
```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8080/api/v1/audit-logs?action=STATUS_CHANGED"
```

**Available Actions:**
- LOGIN
- USER_CREATED
- USER_UPDATED
- DEPARTMENT_CREATED
- ISSUE_CREATED
- ISSUE_ASSIGNED
- STATUS_CHANGED
- PRIORITY_CHANGED
- COMMENT_ADDED
- ISSUE_CLOSED
- REPORT_GENERATED
- DATA_VALIDATION

---

### 4. Filter by Entity Type
```bash
GET /api/v1/audit-logs?entityType=Issue
```

**Example:**
```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8080/api/v1/audit-logs?entityType=Issue"
```

**Available Entity Types:**
- Issue
- User
- Department
- Report
- ValidationSession

---

### 5. Filter by Date Range
```bash
GET /api/v1/audit-logs?startDate=2024-04-01T00:00:00&endDate=2024-04-30T23:59:59
```

**Example:**
```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8080/api/v1/audit-logs?startDate=2024-04-01T00:00:00&endDate=2024-04-30T23:59:59"
```

---

### 6. Combine Multiple Filters
```bash
GET /api/v1/audit-logs?action=STATUS_CHANGED&entityType=Issue&startDate=2024-04-01T00:00:00
```

**Example:**
```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8080/api/v1/audit-logs?action=STATUS_CHANGED&entityType=Issue&startDate=2024-04-01T00:00:00"
```

---

### 7. Get Audit Logs for Specific Issue
```bash
GET /api/v1/audit-logs/issue/{issueId}
```

**Example:**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/v1/audit-logs/issue/1
```

**Response:** All audit logs related to Issue #1

---

### 8. Get Audit Logs for Specific User
```bash
GET /api/v1/audit-logs/user/{userId}
```

**Example:**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/v1/audit-logs/user/5
```

**Note:** Only Admin can view other users' logs

---

### 9. Get Available Action Types
```bash
GET /api/v1/audit-logs/actions
```

**Example:**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/v1/audit-logs/actions
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

---

### 10. Get Available Entity Types
```bash
GET /api/v1/audit-logs/entity-types
```

**Example:**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/v1/audit-logs/entity-types
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

## 🧪 Test Scenarios

### Scenario 1: View All Logs as Admin
```bash
# 1. Login as Admin
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rra.gov.rw","password":"password"}' \
  | jq -r '.token')

# 2. Get all logs
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/audit-logs
```

---

### Scenario 2: Filter Logs by Action
```bash
# Get only STATUS_CHANGED actions
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/audit-logs?action=STATUS_CHANGED"
```

---

### Scenario 3: View Issue History
```bash
# Get all logs for Issue #1
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/audit-logs/issue/1
```

---

### Scenario 4: View User Activity
```bash
# Get all logs for User #5
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/audit-logs/user/5
```

---

### Scenario 5: Date Range Filter
```bash
# Get logs from last 7 days
START_DATE=$(date -d '7 days ago' -Iseconds)
END_DATE=$(date -Iseconds)

curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/audit-logs?startDate=$START_DATE&endDate=$END_DATE"
```

---

## 📊 Expected Data

Your database already has **25+ audit log entries**:

### Sample Logs:
1. **LOGIN** - Admin logged in (30 days ago)
2. **USER_CREATED** - John Kamanzi created (28 days ago)
3. **USER_CREATED** - Sarah Ingabire created (27 days ago)
4. **DEPARTMENT_CREATED** - Finance department (29 days ago)
5. **ISSUE_CREATED** - Missing TIN issue (18 days ago)
6. **ISSUE_ASSIGNED** - Assigned to John (17 days ago)
7. **STATUS_CHANGED** - OPEN → IN_PROGRESS (16 days ago)
8. **PRIORITY_CHANGED** - Medium → High (15 days ago)
9. **COMMENT_ADDED** - Progress update (14 days ago)
10. **STATUS_CHANGED** - IN_PROGRESS → RESOLVED (10 days ago)
11. **ISSUE_CLOSED** - Issue approved (8 days ago)
12. **REPORT_GENERATED** - System report (7 days ago)
13. **DATA_VALIDATION** - CSV validation (12 days ago)

---

## ✅ Verification Checklist

Test each endpoint:

- [ ] Get all logs (no filters)
- [ ] Filter by user (Admin only)
- [ ] Filter by action
- [ ] Filter by entity type
- [ ] Filter by date range
- [ ] Combine multiple filters
- [ ] Get issue audit logs
- [ ] Get user audit logs
- [ ] Get action types list
- [ ] Get entity types list

---

## 🔍 Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Make sure you're sending valid JWT token in Authorization header

### Issue: Empty array returned
**Solution:** Check if filters are too restrictive, try without filters first

### Issue: 403 Forbidden
**Solution:** Non-admin users can only view their own logs

---

## 📞 Quick Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/audit-logs` | GET | Required | Get all logs (with filters) |
| `/api/v1/audit-logs/issue/{id}` | GET | Required | Get issue logs |
| `/api/v1/audit-logs/user/{id}` | GET | Required | Get user logs |
| `/api/v1/audit-logs/actions` | GET | Required | Get action types |
| `/api/v1/audit-logs/entity-types` | GET | Required | Get entity types |

---

**Status:** ✅ API READY FOR TESTING  
**Base URL:** http://localhost:8080/api/v1/audit-logs  
**Sample Data:** 25+ records available  
**Authentication:** JWT token required

Start testing now! 🚀
