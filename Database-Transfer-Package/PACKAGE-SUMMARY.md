# 📦 Database Transfer Package - Summary

Complete package for transferring DQIMS database to a new computer.

---

## ✅ PACKAGE CONTENTS

```
Database-Transfer-Package/
│
├── 📄 README-SETUP-GUIDE.md           ← START HERE! Complete setup instructions
├── 📄 PACKAGE-SUMMARY.md              ← This file - Quick overview
├── 📄 DATABASE-DOCUMENTATION.md       ← Complete table documentation
├── 📄 CREDENTIALS.txt                 ← All passwords and connection info
│
├── 🗄️ COMPLETE-DATABASE-SCHEMA.sql    ← All table definitions (10 tables)
├── 🗄️ SEED-DATA.sql                   ← Initial data (33 users, 8 departments)
│
└── ⚙️ create-backup.bat               ← Windows script to create backups
```

---

## 🚀 QUICK START (3 STEPS)

### 1. Install PostgreSQL
```
Download: https://www.postgresql.org/download/
Password: noella@090
```

### 2. Create Database
```sql
CREATE DATABASE dqims_db;
```

### 3. Import Files
```bash
psql -U postgres -d dqims_db -f COMPLETE-DATABASE-SCHEMA.sql
psql -U postgres -d dqims_db -f SEED-DATA.sql
```

**Done!** ✅

---

## 📊 WHAT'S INCLUDED

### Database Schema (10 Tables)

| Table | Records | Purpose |
|-------|---------|---------|
| users | 33 | User accounts (1 Admin, 8 HODs, 24 Staff) |
| departments | 8 | RRA departments |
| issues | 0* | Data quality issues |
| issue_attachments | 0* | File attachments |
| issue_comments | 0* | Issue comments |
| notifications | 0* | Email notifications |
| audit_logs | 0* | System audit trail |
| validation_sessions | 0* | Data validation uploads |
| validation_errors | 0* | Validation error details |
| password_history | 0* | Password change history |

*Will be populated when application is used

---

## 🔐 DEFAULT CREDENTIALS

### Database
```
Database: dqims_db
Username: postgres
Password: noella@090
Host:     localhost
Port:     5432
```

### Application Login
```
Admin:    admin@rra.gov.rw / password
HODs:     {name}@rra.gov.rw / password
Staff:    {name}@rra.gov.rw / password
```

**All users use password: "password"**

---

## 📋 SEEDED DATA

### 33 Users Created

**1 Admin:**
- admin@rra.gov.rw (IT Department)

**8 HODs (one per department):**
- alice.mukamana@rra.gov.rw (VAT)
- bernard.ngabo@rra.gov.rw (IT)
- christine.uwera@rra.gov.rw (CUSTOMS)
- david.habimana@rra.gov.rw (DOMESTIC TAX)
- emmanuel.nsengimana@rra.gov.rw (TAX INVESTIGATIONS)
- francine.mukamazimpaka@rra.gov.rw (HR)
- george.uwimana@rra.gov.rw (FINANCE)
- henriette.mukandori@rra.gov.rw (DATA MANAGEMENT)

**24 Staff (3 per department):**
- Various staff members across all departments

### 8 Departments Created
1. VAT
2. CUSTOMS
3. DOMESTIC TAX
4. IT
5. TAX INVESTIGATIONS
6. HR
7. FINANCE
8. DATA MANAGEMENT

---

## 📖 DOCUMENTATION FILES

### 1. README-SETUP-GUIDE.md
- **What:** Complete setup instructions
- **When to use:** First time setup
- **Pages:** Comprehensive guide with troubleshooting

### 2. DATABASE-DOCUMENTATION.md
- **What:** Technical reference for all tables
- **When to use:** Understanding database structure
- **Contains:** Table definitions, relationships, sample queries

### 3. CREDENTIALS.txt
- **What:** All passwords and connection strings
- **When to use:** Need login information
- **Warning:** Keep secure, never commit to Git

### 4. PACKAGE-SUMMARY.md
- **What:** This file - Quick overview
- **When to use:** Quick reference

---

## 💾 SQL FILES

### COMPLETE-DATABASE-SCHEMA.sql
```
Size:       ~15 KB
Tables:     10 tables
Indexes:    30+ indexes
Constraints: 15+ foreign keys
Purpose:    Create all database tables
```

**What it does:**
- Creates all 10 tables
- Creates all indexes for performance
- Sets up foreign key relationships
- Adds comments and documentation
- Creates helpful views

**How to use:**
```bash
psql -U postgres -d dqims_db -f COMPLETE-DATABASE-SCHEMA.sql
```

### SEED-DATA.sql
```
Size:    ~8 KB
Users:   33 accounts
Depts:   8 departments
Purpose: Populate initial data
```

**What it does:**
- Creates 1 admin account
- Creates 8 HOD accounts
- Creates 24 staff accounts
- Creates 8 departments
- All passwords set to "password"

**How to use:**
```bash
psql -U postgres -d dqims_db -f SEED-DATA.sql
```

---

## ⚙️ UTILITY SCRIPTS

### create-backup.bat (Windows)

**Purpose:** Create timestamped database backups

**Usage:**
1. Double-click `create-backup.bat`
2. Wait for completion
3. Backup saved as: `dqims_backup_YYYY-MM-DD_HHMMSS.sql`

**Output Example:**
```
dqims_backup_2026-06-16_153045.sql
```

---

## 🎯 SETUP PROCESS

### Step-by-Step Checklist

**Prerequisites:**
- [ ] PostgreSQL 15+ installed
- [ ] pgAdmin 4 installed (comes with PostgreSQL)
- [ ] Java JDK 17+ installed (for backend)
- [ ] Node.js 20.x LTS installed (for frontend)

**Database Setup:**
- [ ] PostgreSQL service running
- [ ] Created database: dqims_db
- [ ] Imported COMPLETE-DATABASE-SCHEMA.sql
- [ ] Imported SEED-DATA.sql
- [ ] Verified tables created (10 tables)
- [ ] Verified users seeded (33 users)

**Application Setup:**
- [ ] Backend configured with database credentials
- [ ] Backend starts successfully (port 8080)
- [ ] Frontend starts successfully (port 5173)
- [ ] Can login with admin@rra.gov.rw

---

## ⏱️ TIME ESTIMATES

**Total Setup Time:** 20-30 minutes

**Breakdown:**
- PostgreSQL installation: 5-10 minutes
- Database creation: 1 minute
- Schema import: 2 minutes
- Seed data import: 1 minute
- Verification: 5 minutes
- Backend setup: 5 minutes
- Frontend setup: 5 minutes

---

## 🆘 TROUBLESHOOTING

### Common Issues

**1. "psql: command not found"**
```
Solution: Add PostgreSQL to PATH
C:\Program Files\PostgreSQL\15\bin
```

**2. "Database already exists"**
```
Solution: Drop and recreate
DROP DATABASE dqims_db;
CREATE DATABASE dqims_db;
```

**3. "Permission denied"**
```sql
Solution: Grant permissions
GRANT ALL PRIVILEGES ON DATABASE dqims_db TO postgres;
```

**4. "Cannot connect to database"**
```
Solution: Check PostgreSQL service is running
Services.msc → PostgreSQL → Start
```

---

## 🔒 SECURITY REMINDERS

### ⚠️ IMPORTANT

1. **Change passwords before production**
   - Database password
   - All user passwords
   - JWT secret
   - Email password

2. **Never commit sensitive files**
   - Add `CREDENTIALS.txt` to `.gitignore`
   - Use environment variables
   - Keep backups secure

3. **Regular backups**
   - Use `create-backup.bat` weekly
   - Store backups off-site
   - Test restore procedure

---

## 📞 QUICK REFERENCE

### Database Connection

```bash
# psql command line
psql -U postgres -d dqims_db

# pgAdmin server settings
Host: localhost
Port: 5432
Database: dqims_db
Username: postgres
Password: noella@090
```

### Application URLs

```
Backend:  http://localhost:8080
Frontend: http://localhost:5173
API Docs: http://localhost:8080/swagger-ui.html (if enabled)
```

### Default Accounts

```
Admin:   admin@rra.gov.rw / password
HOD:     bernard.ngabo@rra.gov.rw / password
Staff:   john.mugabo@rra.gov.rw / password
```

---

## ✅ VERIFICATION COMMANDS

### After Import, Run These:

```sql
-- List all tables
\dt

-- Count users by role
SELECT role, COUNT(*) FROM users GROUP BY role;

-- List departments
SELECT name FROM departments;

-- Check database size
SELECT pg_size_pretty(pg_database_size('dqims_db'));

-- View table statistics
SELECT * FROM database_statistics;
```

**Expected Results:**
```
Tables: 10 (plus flyway_schema_history)
Users:  33 (1 admin, 8 HODs, 24 staff)
Departments: 8
```

---

## 🎓 LEARNING PATH

### For New Users:

1. **Start:** README-SETUP-GUIDE.md
2. **Reference:** CREDENTIALS.txt
3. **Deep Dive:** DATABASE-DOCUMENTATION.md
4. **Practice:** Run sample queries
5. **Maintain:** Use create-backup.bat regularly

---

## 📊 PACKAGE STATISTICS

```
Total Files:      7
SQL Files:        2 (Schema + Seed Data)
Documentation:    4 (Guides + References)
Scripts:          1 (Backup utility)
Total Size:       ~50 KB (without backups)
```

---

## 🎯 SUCCESS CRITERIA

✅ **Setup is successful when:**

- [ ] PostgreSQL is running
- [ ] Database dqims_db exists
- [ ] All 10 tables are created
- [ ] 33 users are seeded
- [ ] 8 departments are seeded
- [ ] Can login to pgAdmin
- [ ] Can login to application
- [ ] Backend connects to database
- [ ] No errors in logs

---

## 🚀 NEXT STEPS

After successful setup:

1. **Test the application**
   - Login as admin
   - Create a test issue
   - Assign to a user
   - Add comments
   - Verify notifications

2. **Explore the database**
   - Use pgAdmin
   - Run sample queries
   - View table data
   - Check relationships

3. **Create backups**
   - Run create-backup.bat
   - Store backup safely
   - Test restore process

4. **Customize**
   - Change passwords
   - Add more users
   - Update department names
   - Configure email settings

---

## 📧 SUPPORT INFORMATION

If you need help:

1. Check **README-SETUP-GUIDE.md** troubleshooting section
2. Review **DATABASE-DOCUMENTATION.md** for table details
3. Verify **CREDENTIALS.txt** for correct passwords
4. Check PostgreSQL logs: `C:\Program Files\PostgreSQL\15\data\log`

---

## 📋 FILE CHECKLIST

Before transferring to another computer, ensure you have:

- [x] COMPLETE-DATABASE-SCHEMA.sql
- [x] SEED-DATA.sql
- [x] README-SETUP-GUIDE.md
- [x] DATABASE-DOCUMENTATION.md
- [x] CREDENTIALS.txt
- [x] PACKAGE-SUMMARY.md (this file)
- [x] create-backup.bat

---

## 🎉 READY TO GO!

This package contains everything needed to set up the DQIMS database on a new computer.

**Start with:** `README-SETUP-GUIDE.md`

**Good luck! 🚀**

---

**Package Version:** 1.0
**Created:** June 16, 2026
**Database:** dqims_db (PostgreSQL 15+)
**Total Users:** 33
**Total Departments:** 8
**Total Tables:** 10

---

**⚠️ REMEMBER:** Keep CREDENTIALS.txt secure and change all default passwords before production deployment!
