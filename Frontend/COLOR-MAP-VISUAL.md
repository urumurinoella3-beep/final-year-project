# 🗺️ Visual Color Map - Where Each Color Appears

A visual guide showing exactly where each color appears in your application.

---

## 🎨 COLOR LEGEND

```
🟢 #20603D - Primary Green (RRA)
🔵 #00A1DE - Secondary Blue (RRA)
🟡 #E5BE01 - Accent Orange (RRA)
🟩 green-X - Success/Resolve
🟦 blue-X  - Info/Status
🟥 red-X   - Danger/Delete
```

---

## 📱 PAGE LAYOUTS

### 1. LOGIN PAGE

```
┌─────────────────────────────────────┐
│         DQIMS Logo                  │
│                                     │
│   ┌─────────────────────────┐      │
│   │  Email Input            │      │
│   └─────────────────────────┘      │
│                                     │
│   ┌─────────────────────────┐      │
│   │  Password Input         │      │
│   └─────────────────────────┘      │
│                                     │
│   ┌─────────────────────────┐      │
│   │   🟢 Sign In Button     │  ← Line 67
│   └─────────────────────────┘      │
│                                     │
│       🔵 Forgot Password?      ← Line 72
│                                     │
└─────────────────────────────────────┘
```

**Colors:**
- Sign In Button: `bg-[#20603D]` hover `bg-[#1a4d31]`
- Forgot Link: `text-[#00A1DE]`

---

### 2. DASHBOARD PAGE

```
┌─────────────────────────────────────────────┐
│  🟢 Sidebar (active items)                  │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Total   │ │  Open    │ │ Resolved │   │
│  │  Issues  │ │  Issues  │ │  Issues  │   │
│  │   📊     │ │   📊     │ │   📊     │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  📊 Issues by Department Chart      │   │
│  │  🟢 #20603D - Chart 1                │   │
│  │  🔵 #00A1DE - Chart 2                │   │
│  │  🟡 #E5BE01 - Chart 3                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  📈 Monthly Trend Chart             │   │
│  │  (uses chart colors)                │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Colors:**
- Sidebar active: `bg-[#20603D]`
- Chart 1: `--chart-1` (Green)
- Chart 2: `--chart-2` (Blue)
- Chart 3: `--chart-3` (Orange)

---

### 3. ISSUE MANAGEMENT PAGE

```
┌─────────────────────────────────────────────────┐
│  Issues List                                    │
│  ┌──────────────────────────────────────────┐  │
│  │  🟢 Report Issue Button              ← Line 142
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Issue #1                                │  │
│  │  Title: Database Connection Timeout      │  │
│  │  Status: 🟦 Open   Priority: High        │  │
│  │  🟢 Comments Button                ← Line 460
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Issue #2                                │  │
│  │  Title: SSL Certificate Expiring         │  │
│  │  Status: 🟡 In Progress                  │  │
│  │  🟢 Comments Button                      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

CREATE ISSUE DIALOG:
┌─────────────────────────────────────┐
│  Create New Issue                   │
│  ┌─────────────────────────────┐   │
│  │  Title                      │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Description                │   │
│  └─────────────────────────────┘   │
│  🟦 Self-assign checkbox       ← Line 298
│                                     │
│  [Cancel] [🟢 Create Issue]    ← Line 316
└─────────────────────────────────────┘
```

**Colors:**
- Report Issue: `bg-[#20603D]`
- Self-assign box: `bg-blue-50`
- Create button: `bg-[#20603D]`
- Comments: `text-[#20603D]`

---

### 4. ISSUE DETAILS PAGE

```
┌─────────────────────────────────────────────────┐
│  🟢 Issue #123                           ← Line 137
│  Database Connection Timeout                    │
│  [🟩 Resolve] [🟦 Reopen] [🟥 Delete]   ← Lines 150,170
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  💬 Discussion              🟢    ← Line 193
│  │                                        │    │
│  │  ┌──────────────────────────────┐     │    │
│  │  │ 🟢 JD  John Doe          ← Line 211
│  │  │    This is urgent...           │     │    │
│  │  └──────────────────────────────┘     │    │
│  │                                        │    │
│  │  ┌──────────────────────────────┐     │    │
│  │  │  Type your comment...        │     │    │
│  │  │  [🟢 Send]              ← Line 242
│  │  └──────────────────────────────┘     │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  📎 Uploads                 🔵    ← Line 252
│  │                                        │    │
│  │  🔵 document.pdf [🟢 Download]  ← Lines 265,270
│  │  🔵 screenshot.png [🟢 Download]      │    │
│  └────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

**Colors:**
- Issue label: `text-[#20603D]`
- Resolve: `bg-green-600`
- Reopen: `bg-blue-600`
- Discussion icon: `text-[#20603D]`
- Avatar: `bg-[#20603D]`
- Send: `bg-[#20603D]`
- Attachment icon: `text-[#00A1DE]`
- Attachment box: `bg-[#00A1DE]/10`
- Download: `border-[#20603D]` `text-[#20603D]`

---

### 5. DEPARTMENT MANAGEMENT PAGE

```
┌─────────────────────────────────────────────────┐
│  Department Management                          │
│  ┌──────────────────────────────────────────┐  │
│  │  🟢 Add Department              ← Line 91
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Total   │  │ Active  │  │ Staff   │        │
│  │ Depts   │  │ Issues  │  │ 🟦 123  │   ← Line 133
│  │   8     │  │   45    │  │         │        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  🟢 👥 Staff Directory         ← Line 171
│  │                                        │    │
│  │  Finance (🟢 border)           ← Line 144
│  │  - John Doe (HOD)                     │    │
│  │  - Jane Smith (Staff)                 │    │
│  │  - 🟦 15 staff total           ← Line 151
│  │                                        │    │
│  │  IT Department                         │    │
│  │  - Bob Wilson (HOD)                   │    │
│  │  - 🟦 12 staff total           ← Line 332
│  └────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

**Colors:**
- Add button: `bg-[#20603D]`
- Staff counts: `text-blue-600`
- Card border: `border-[#20603D]/20`
- Icons: `text-[#20603D]`

---

### 6. USER MANAGEMENT PAGE

```
┌─────────────────────────────────────────────────┐
│  User Management                                │
│  ┌──────────────────────────────────────────┐  │
│  │  🟢 Create User                          │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  Search: [____________] 🔍            │    │
│  │  Filter: [All Roles ▼]                │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  Name    Email      Role    Actions    │    │
│  │  🟢 JD   john@...   ADMIN   [Edit] [🟥] │  │
│  │  🟢 JS   jane@...   HOD     [Edit] [🟥] │  │
│  │  🟢 BW   bob@...    STAFF   [Edit] [🟥] │  │
│  └────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

**Colors:**
- Create button: `bg-[#20603D]`
- Avatars: `bg-[#20603D]`
- Delete: `text-red-600`

---

### 7. DATA VALIDATION PAGE

```
┌─────────────────────────────────────────────────┐
│  Data Validation                                │
│  ┌────────────────────────────────────────┐    │
│  │  📁 Upload File                        │    │
│  │  Drop files here or click              │    │
│  │  [🟢 Select File]                      │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  Validation Results                    │    │
│  │  Total: 100  ✅ Passed: 95  ❌ Failed: 5│    │
│  │                                        │    │
│  │  🟥 Error: Missing TIN (Row 5)        │    │
│  │  🟥 Error: Invalid format (Row 12)    │    │
│  │  🟩 Success: Validation complete      │    │
│  └────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

**Colors:**
- Upload button: `bg-[#20603D]`
- Success: `text-green-600`
- Error: `text-red-600`

---

### 8. PROFILE PAGE

```
┌─────────────────────────────────────────────────┐
│  My Profile                                     │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │     🟢 JD                              │    │
│  │     John Doe                           │    │
│  │     john.doe@rra.gov.rw                │    │
│  │     Admin • Finance Department         │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  Personal Information                  │    │
│  │  Name: [____________]                  │    │
│  │  Email: [____________]                 │    │
│  │  Phone: [____________]                 │    │
│  │  [🟢 Save Changes]                     │    │
│  └────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

**Colors:**
- Avatar: `bg-[#20603D]`
- Save button: `bg-[#20603D]`

---

### 9. CHANGE PASSWORD PAGE

```
┌─────────────────────────────────────────────────┐
│  Change Password                                │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  Current Password                      │    │
│  │  [____________]                        │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  New Password                          │    │
│  │  [____________]                        │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  Confirm Password                      │    │
│  │  [____________]                        │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  [Cancel] [🟢 Change Password]         ← Line 107
└─────────────────────────────────────────────────┘
```

**Colors:**
- Submit button: `bg-[#20603D]`

---

### 10. REPORTING & ANALYTICS PAGE

```
┌─────────────────────────────────────────────────┐
│  Reports & Analytics                            │
│  ┌──────────────────────────────────────────┐  │
│  │  🟢 Generate Report                      │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  📊 Issues Trend                        │   │
│  │  🟢 Opened                               │   │
│  │  🟦 In Progress                          │   │
│  │  🟩 Resolved                             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  📈 Department Performance              │   │
│  │  (uses chart colors)                    │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**Colors:**
- Generate button: `bg-[#20603D]`
- Chart colors: `--chart-1` through `--chart-5`

---

## 🎯 COLOR HEATMAP

Shows frequency of color usage:

```
Page                    | 🟢 Green | 🔵 Blue | 🟡 Orange | 🟩 Success | 🟦 Info | 🟥 Danger
-----------------------|----------|---------|-----------|------------|---------|----------
LoginPage              |    ●●    |    ●    |           |            |         |
DashboardPage          |    ●●●   |   ●●    |     ●     |            |   ●●    |
IssueManagementPage    |   ●●●●   |    ●    |           |            |   ●     |
IssueDetailsPage       |  ●●●●●●  |   ●●    |           |     ●      |   ●     |    ●
DepartmentManagement   |   ●●●    |         |           |            |  ●●●    |
UserManagement         |   ●●●    |         |           |            |         |   ●●
DataValidationPage     |    ●●    |         |           |     ●●     |         |   ●●
ProfilePage            |    ●●    |         |           |            |         |
ChangePasswordPage     |    ●     |         |           |            |         |
ReportingAnalytics     |   ●●●    |   ●●    |     ●     |            |         |
```

Legend: ● = 1-2 uses, ●● = 3-5 uses, ●●● = 6-10 uses, etc.

---

## 🔍 COLOR BY COMPONENT TYPE

### Buttons
```
┌─────────────────────┐
│  🟢 Primary Button  │  bg-[#20603D]
└─────────────────────┘

┌─────────────────────┐
│  🟩 Success Button  │  bg-green-600
└─────────────────────┘

┌─────────────────────┐
│  🟦 Info Button     │  bg-blue-600
└─────────────────────┘

┌─────────────────────┐
│  🟥 Danger Button   │  bg-red-600
└─────────────────────┘

┌─────────────────────┐
│  🟢 Outline Button  │  border-[#20603D] text-[#20603D]
└─────────────────────┘
```

### Icons
```
💬 Discussion:  text-[#20603D]
📎 Attachment:  text-[#00A1DE]
👥 Users:       text-[#20603D]
🔔 Notification: text-[#20603D]
⚙️  Settings:    text-gray-600
```

### Avatars
```
🟢 JD   bg-[#20603D] text-white ring-[#20603D]/15
🟢 JS   bg-[#20603D] text-white ring-[#20603D]/15
🟢 BW   bg-[#20603D] text-white ring-[#20603D]/15
```

### Links
```
🔵 Forgot Password?     text-[#00A1DE]
🔵 View Details         text-[#00A1DE]
🔵 Learn More           text-[#00A1DE]
```

### Status Badges
```
🟦 Open          bg-blue-50 text-blue-700
🟡 In Progress   bg-yellow-50 text-yellow-700
🟩 Resolved      bg-green-50 text-green-700
⚫ Closed         bg-gray-100 text-gray-700
```

---

## 📊 COLOR USAGE STATISTICS

```
Total Color References: ~150+

By Color:
  🟢 #20603D (Green):    ~60 references
  🔵 #00A1DE (Blue):     ~20 references
  🟡 #E5BE01 (Orange):   ~10 references
  🟩 green-X (Success):  ~25 references
  🟦 blue-X (Info):      ~20 references
  🟥 red-X (Danger):     ~15 references

By Type:
  Buttons:               ~40 references
  Icons:                 ~30 references
  Text/Labels:           ~25 references
  Backgrounds:           ~20 references
  Borders:               ~15 references
  Avatars:               ~10 references
  Charts:                ~10 references
```

---

## 🎨 COMPLETE COLOR FLOW

```
User Journey → Color Touchpoints

1. Login
   └─ 🟢 Sign In Button
   └─ 🔵 Forgot Password Link

2. Dashboard
   └─ 🟢 Active Sidebar Items
   └─ 📊 Charts (🟢🔵🟡)

3. View Issues
   └─ 🟢 Report Issue Button
   └─ Status Badges (🟦🟡🟩)

4. Issue Details
   └─ 🟢 User Avatars
   └─ 🟢 Action Buttons
   └─ 🔵 Attachments
   └─ 🟩 Resolve Button

5. Manage Users/Depts
   └─ 🟢 Create Buttons
   └─ 🟦 Count Statistics
   └─ 🟢 Icons

6. Reports
   └─ 🟢 Generate Button
   └─ 📊 Multi-color Charts
```

---

## 🎯 PRIORITY COLOR CHANGES

If you only change these, you'll update 80% of visible colors:

### High Priority (3 changes)
1. `#20603D` → Your primary color (affects 60% of elements)
2. `#1a4d31` → Your hover color (affects 25% of elements)
3. `#00A1DE` → Your secondary color (affects 15% of elements)

### Medium Priority
4. `green-600` → Success button color
5. `blue-600` → Info/reopen button color
6. `--chart-1` through `--chart-5` → Chart colors

### Low Priority
7. Badge colors (status indicators)
8. Border opacities
9. Background tints

---

**Last Updated:** June 16, 2026
**Document Version:** 1.0
