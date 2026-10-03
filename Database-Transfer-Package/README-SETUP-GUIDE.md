

# 🚀 DQIMS Database Transfer Package

Complete database setup guide for transferring to a new computer.

---

## 📦 PACKAGE CONTENTS

```
Database-Transfer-Package/
├── README-SETUP-GUIDE.md           ← This file
├── COMPLETE-DATABASE-SCHEMA.sql    ← All table definitions
├── SEED-DATA.sql                   ← Initial data (users, departments)
├── FULL-DATABASE-BACKUP.sql        ← Complete backup with all data
└── CREDENTIALS.txt                 ← Database connection info
```

---

## 🎯 QUICK START (3 Steps)

### Step 1: Install PostgreSQL
```bash
# Download PostgreSQL 15.x or higher
https://www.postgresql.org/download/

# Install with default settings
# Set postgres user password: noella@090
```

### Step 2: Create Database
```sql
-- Open pgAdmin or psql
CREATE DATABASE dqims_db;
```

### Step 3: Import Schema & Data
```bash
# Method 1: Using psql
psql -U postgres -d dqims_db -f COMPLETE-DATABASE-SCHEMA.sql
psql -U postgres -d dqims_db -f SEED-DATA.sql

# Method 2: Using pgAdmin
# 1. Open pgAdmin
# 2. Right-click on dqims_db → Query Tool
# 3. Open and execute COMPLETE-DATABASE-SCHEMA.sql
# 4. Open and execute SEED-DATA.sql
```

**Done!** Database is ready to use.

---

## 📋 DETAILED SETUP INSTRUCTIONS

### Prerequisites

**Required Software:**
- ✅ PostgreSQL 15.x or higher
- ✅ pgAdmin 4 (comes with PostgreSQL)
- ✅ Java JDK 17 or higher (for backend)
- ✅ Node.js 20.x LTS (for frontend)

**Download Links:**
- PostgreSQL: https://www.postgresql.org/download/
- Java JDK: https://www.oracle.com/java/technologies/downloads/
- Node.js: https://nodejs.org/

---

## 🔧 STEP-BY-STEP SETUP

### 1️⃣ Install PostgreSQL

**Windows:**
```
1. Download PostgreSQL installer
2. Run the installer
3. Set password for postgres user: noella@090
4. Port: 5432 (default)
5. Install pgAdmin 4 (included)
6. Finish installation
```

**Verify Installation:**
```bash
# Open Command Prompt
psql --version
# Should show: psql (PostgreSQL) 15.x
```

---

### 2️⃣ Create Database

**Option A: Using pgAdmin (Recommended for Beginners)**

1. **Open pgAdmin 4**
   - Start menu → pgAdmin 4

2. **Connect to Server**
   - Master password: noella@090 (or your pgAdmin password)
   - Expand: Servers → PostgreSQL 15

3. **Create Database**
   - Right-click on "Databases"
   - Select "Create" → "Database..."
   - Database name: `dqims_db`
   - Owner: `postgres`
   - Click "Save"

**Option B: Using Command Line (psql)**

```bash
# Open Command Prompt
psql -U postgres

# When prompted, enter password: noella@090

# Create database
CREATE DATABASE dqims_db;

# Verify
\l

# Quit
\q
```

---

### 3️⃣ Import Database Schema

**Using pgAdmin:**

1. **Open Query Tool**
   - In pgAdmin, expand: Servers → PostgreSQL 15 → Databases
   - Right-click on `dqims_db`
   - Select "Query Tool"

2. **Open Schema File**
   - Click folder icon (📁) or File → Open
   - Navigate to: `COMPLETE-DATABASE-SCHEMA.sql`
   - Click "Open"

3. **Execute Schema**
   - Click ▶️ (Execute/Refresh) button
   - Wait for completion
   - Check for success message

**Using Command Line:**

```bash
# Navigate to the package folder
cd "C:\Users\YourName\Desktop\Database-Transfer-Package"

# Import schema
psql -U postgres -d dqims_db -f COMPLETE-DATABASE-SCHEMA.sql

# Enter password when prompted: noella@090
```

---

### 4️⃣ Import Seed Data

**Using pgAdmin:**

1. **Open New Query Tool**
   - Same as step 3 above

2. **Open Seed Data File**
   - File → Open
   - Select: `SEED-DATA.sql`

3. **Execute Seed Data**
   - Click ▶️ (Execute) button
   - Verify users and departments were created

**Using Command Line:**

```bash
# Import seed data
psql -U postgres -d dqims_db -f SEED-DATA.sql
```

---

### 5️⃣ Verify Installation

**Check Tables:**

```sql
-- Open Query Tool in pgAdmin or psql

-- List all tables
\dt

-- Should show:
-- users
-- departments
-- issues
-- issue_attachments
-- issue_comments
-- notifications
-- audit_logs
-- validation_sessions
-- validation_errors
-- password_history
```

**Check Data:**

```sql
-- Count users by role
SELECT role, COUNT(*) 
FROM users 
GROUP BY role;

-- Should show:
-- ADMIN: 1
-- HOD: 8
-- STAFF: 24

-- List departments
SELECT name FROM departments;

-- Should show 8 departments
```

---

## 🔐 DEFAULT CREDENTIALS

### Database Connection

```
Database Name:  dqims_db
Host:           localhost
Port:           5432
Username:       postgres
Password:       noella@090
```

### Application Login

**Admin Account:**
```
Email:    admin@rra.gov.rw
Password: password
```

**HOD Accounts:**
```
Email:    {firstname}.{lastname}@rra.gov.rw
Password: password
Examples:
  - alice.mukamana@rra.gov.rw / password
  - bernard.ngabo@rra.gov.rw / password
```

**Staff Accounts:**
```
Email:    {firstname}.{lastname}@rra.gov.rw
Password: password
Examples:
  - john.mugabo@rra.gov.rw / password
  - linda.uwimana@rra.gov.rw / password
```

---

## 📊 DATABASE STRUCTURE

### Tables Overview

| # | Table Name | Records | Purpose |
|---|------------|---------|---------|
| 1 | users | 33 | User accounts (1 Admin, 8 HODs, 24 Staff) |
| 2 | departments | 8 | Organizational departments |
| 3 | issues | 0* | Data quality issues |
| 4 | issue_attachments | 0* | File attachments |
| 5 | issue_comments | 0* | Issue comments |
| 6 | notifications | 0* | Email notifications |
| 7 | audit_logs | 0* | System audit trail |
| 8 | validation_sessions | 0* | Data validation sessions |
| 9 | validation_errors | 0* | Validation errors |
| 10 | password_history | 0* | Password change history |

*Will be populated when application is used

---

## 🔄 OPTIONAL: Import Full Backup with Sample Data

If you have the `FULL-DATABASE-BACKUP.sql` file with sample issues and data:

```bash
# This will include all sample issues, comments, etc.
psql -U postgres -d dqims_db -f FULL-DATABASE-BACKUP.sql
```

---

## 🛠️ TROUBLESHOOTING

### Problem: "psql" command not found
**Solution:**
```bash
# Add PostgreSQL to PATH
# Windows: Add to System Environment Variables
C:\Program Files\PostgreSQL\15\bin

# Then restart Command Prompt
```

### Problem: Cannot connect to PostgreSQL
**Solution:**
```
1. Check PostgreSQL service is running
   - Services.msc → PostgreSQL
   - Status should be "Running"

2. Verify port 5432 is not blocked
   - Firewall settings

3. Check pg_hba.conf for connection permissions
   - Location: C:\Program Files\PostgreSQL\15\data\pg_hba.conf
```

### Problem: Permission denied
**Solution:**
```sql
-- Grant permissions to postgres user
GRANT ALL PRIVILEGES ON DATABASE dqims_db TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

### Problem: Tables already exist
**Solution:**
```sql
-- Drop all tables (WARNING: This deletes all data!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;

-- Then re-run schema and seed files
```

---

## 📝 BACKEND CONFIGURATION

### application.properties

Update your backend `application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/dqims_db
spring.datasource.username=postgres
spring.datasource.password=noella@090
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Flyway (if you want to use migrations instead)
spring.flyway.enabled=false
# Set to true if using Flyway migrations
```

---

## 🚀 START THE APPLICATION

### Backend (Spring Boot)

```bash
# Navigate to backend folder
cd Backend/DQIMS

# Run with Maven
mvn spring-boot:run

# Or if using JAR
java -jar target/dqims-1.0.0.jar

# Backend will start on: http://localhost:8080
```

### Frontend (React + Vite)

```bash
# Navigate to frontend folder
cd Frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Frontend will start on: http://localhost:5173
```

---

## ✅ VERIFICATION CHECKLIST

After setup, verify:

- [ ] PostgreSQL is running
- [ ] Database `dqims_db` exists
- [ ] All 10 tables are created
- [ ] 33 users are seeded
- [ ] 8 departments are seeded
- [ ] Can login to pgAdmin
- [ ] Backend connects to database
- [ ] Can login to application with admin@rra.gov.rw

---

## 📊 DATABASE BACKUP & RESTORE

### Create Backup

```bash
# Full backup
pg_dump -U postgres -d dqims_db -f dqims_backup.sql

# Schema only
pg_dump -U postgres -d dqims_db --schema-only -f dqims_schema.sql

# Data only
pg_dump -U postgres -d dqims_db --data-only -f dqims_data.sql
```

### Restore Backup

```bash
# Restore from backup
psql -U postgres -d dqims_db -f dqims_backup.sql
```

---

## 🔒 SECURITY NOTES

### For Production Deployment:

1. **Change Database Password**
   ```sql
   ALTER USER postgres WITH PASSWORD 'your-secure-password';
   ```

2. **Change Application Passwords**
   - Update all user passwords from default "password"
   - Use strong passwords (min 8 chars, mixed case, numbers, symbols)

3. **Update JWT Secret**
   - Change JWT secret in application.properties
   - Use a strong 256-bit random key

4. **Restrict Access**
   - Configure pg_hba.conf to restrict connections
   - Use firewall rules
   - Enable SSL connections

---

## 📞 QUICK REFERENCE CARD

```
╔═══════════════════════════════════════════════╗
║           DQIMS DATABASE SETUP                ║
╠═══════════════════════════════════════════════╣
║ 1. Install PostgreSQL 15+                    ║
║ 2. Create database: dqims_db                  ║
║ 3. Import: COMPLETE-DATABASE-SCHEMA.sql       ║
║ 4. Import: SEED-DATA.sql                      ║
║ 5. Start Backend (port 8080)                  ║
║ 6. Start Frontend (port 5173)                 ║
║ 7. Login: admin@rra.gov.rw / password         ║
╠═══════════════════════════════════════════════╣
║ Database: dqims_db                            ║
║ User:     postgres                            ║
║ Password: noella@090                          ║
║ Port:     5432                                ║
╚═══════════════════════════════════════════════╝
```

---

## 📧 SUPPORT

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check PostgreSQL logs: `C:\Program Files\PostgreSQL\15\data\log`
4. Verify database credentials are correct

---

## 📋 COMPLETE SETUP SUMMARY

**Installation Time:** 15-30 minutes

**Steps:**
1. ✅ Install PostgreSQL (5 min)
2. ✅ Install pgAdmin (included with PostgreSQL)
3. ✅ Create database (1 min)
4. ✅ Import schema (2 min)
5. ✅ Import seed data (2 min)
6. ✅ Verify installation (5 min)
7. ✅ Start backend (2 min)
8. ✅ Start frontend (2 min)
9. ✅ Test login (1 min)

**Total:** 20 minutes (with downloads)

---

**Package Created:** June 16, 2026
**Version:** 1.0
**Database:** PostgreSQL 15+
**Status:** ✅ Ready for Transfer

---

## 🎉 SUCCESS!

If you can see all tables in pgAdmin and login to the application, your database transfer is complete!

**Happy Development! 🚀**
