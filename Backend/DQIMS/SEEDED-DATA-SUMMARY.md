# DQIMS Seeded Data Summary

## 🔐 Login Credentials
**All users have the same password:** `password`

---

## 👤 ADMIN USER (1 user)

| Employee ID | Name | Email | Role | Department |
|------------|------|-------|------|------------|
| EMP001 | System Administrator | admin@rra.gov.rw | ADMIN | IT |

---

## 👔 HEAD OF DEPARTMENT (HOD) - 8 users

| Employee ID | Name | Email | Role | Department |
|------------|------|-------|------|------------|
| EMP101 | Jean Claude Mugisha | jean.mugisha@rra.gov.rw | HOD | Finance |
| EMP102 | Marie Uwase | marie.uwase@rra.gov.rw | HOD | IT |
| EMP103 | Patrick Nkurunziza | patrick.nkurunziza@rra.gov.rw | HOD | HR |
| EMP104 | Grace Mukamana | grace.mukamana@rra.gov.rw | HOD | Operations |
| EMP105 | David Habimana | david.habimana@rra.gov.rw | HOD | Customs |
| EMP106 | Alice Uwera | alice.uwera@rra.gov.rw | HOD | VAT |
| EMP107 | Emmanuel Bizimana | emmanuel.bizimana@rra.gov.rw | HOD | Compliance |
| EMP108 | Diane Umutoni | diane.umutoni@rra.gov.rw | HOD | Data Management |

---

## 👥 STAFF MEMBERS - 22 users

### Finance Department (3 staff)
| Employee ID | Name | Email | Department |
|------------|------|-------|------------|
| EMP201 | John Kamanzi | john.kamanzi@rra.gov.rw | Finance |
| EMP202 | Sarah Ingabire | sarah.ingabire@rra.gov.rw | Finance |
| EMP203 | Eric Ndayisaba | eric.ndayisaba@rra.gov.rw | Finance |

### IT Department (3 staff)
| Employee ID | Name | Email | Department |
|------------|------|-------|------------|
| EMP204 | Kevin Mutabazi | kevin.mutabazi@rra.gov.rw | IT |
| EMP205 | Linda Uwimana | linda.uwimana@rra.gov.rw | IT |
| EMP206 | Frank Nshuti | frank.nshuti@rra.gov.rw | IT |

### HR Department (2 staff)
| Employee ID | Name | Email | Department |
|------------|------|-------|------------|
| EMP207 | Betty Mukandori | betty.mukandori@rra.gov.rw | HR |
| EMP208 | James Niyonzima | james.niyonzima@rra.gov.rw | HR |

### Operations Department (3 staff)
| Employee ID | Name | Email | Department |
|------------|------|-------|------------|
| EMP209 | Rose Nyiramana | rose.nyiramana@rra.gov.rw | Operations |
| EMP210 | Peter Mugabo | peter.mugabo@rra.gov.rw | Operations |
| EMP211 | Claire Mukeshimana | claire.mukeshimana@rra.gov.rw | Operations |

### Customs Department (3 staff)
| Employee ID | Name | Email | Department |
|------------|------|-------|------------|
| EMP212 | Joseph Uwizeyimana | joseph.uwizeyimana@rra.gov.rw | Customs |
| EMP213 | Agnes Mukamazimpaka | agnes.mukamazimpaka@rra.gov.rw | Customs |
| EMP214 | Robert Nsengimana | robert.nsengimana@rra.gov.rw | Customs |

### VAT Department (3 staff)
| Employee ID | Name | Email | Department |
|------------|------|-------|------------|
| EMP215 | Christine Uwamahoro | christine.uwamahoro@rra.gov.rw | VAT |
| EMP216 | Daniel Hakizimana | daniel.hakizimana@rra.gov.rw | VAT |
| EMP217 | Florence Mukamugema | florence.mukamugema@rra.gov.rw | VAT |

### Compliance Department (2 staff)
| Employee ID | Name | Email | Department |
|------------|------|-------|------------|
| EMP218 | Samuel Mugisha | samuel.mugisha@rra.gov.rw | Compliance |
| EMP219 | Jacqueline Uwase | jacqueline.uwase@rra.gov.rw | Compliance |

### Data Management Department (3 staff)
| Employee ID | Name | Email | Department |
|------------|------|-------|------------|
| EMP220 | Michael Nkubito | michael.nkubito@rra.gov.rw | Data Management |
| EMP221 | Esther Mukandayisenga | esther.mukandayisenga@rra.gov.rw | Data Management |
| EMP222 | Vincent Habiyambere | vincent.habiyambere@rra.gov.rw | Data Management |

---

## 🏢 DEPARTMENTS - 8 departments

| Department | Description |
|-----------|-------------|
| Finance | Financial operations, accounting, and revenue management |
| IT | Information Technology, systems development and maintenance |
| HR | Human Resources, recruitment, and employee management |
| Operations | Operational activities and process management |
| Customs | Customs operations and border control |
| VAT | Value Added Tax administration and compliance |
| Compliance | Regulatory compliance, auditing, and risk management |
| Data Management | Data quality, governance, and analytics |

---

## 📋 SAMPLE ISSUES - 13 issues

### OPEN Issues (3)
1. **Missing TIN Numbers in Tax Returns** - Finance (High Priority)
2. **Duplicate Customer Records** - Data Management (Medium Priority)
3. **Invalid Email Formats in User Database** - IT (Low Priority)

### IN_PROGRESS Issues (4)
4. **Inconsistent Date Formats in Import Records** - Customs (High Priority)
5. **Missing VAT Amounts in Sales Records** - VAT (Critical Priority)
6. **Negative Values in Revenue Reports** - Finance (High Priority)
7. **System Performance Degradation** - IT (High Priority)

### RESOLVED Issues (3)
8. **Incorrect Tax Rate Applied** - Finance (Critical Priority)
9. **Missing Audit Trail Logs** - Compliance (High Priority)
10. **Data Export Timeout Issues** - IT (Medium Priority)

### CLOSED Issues (3)
11. **Outdated Exchange Rates** - Finance (Critical Priority)
12. **Broken Report Generation** - IT (High Priority)
13. **Missing Customs Declaration Numbers** - Customs (High Priority)

---

## 📊 SUMMARY STATISTICS

| Category | Count |
|----------|-------|
| **Total Users** | **31** |
| - Admin | 1 |
| - HODs | 8 |
| - Staff | 22 |
| **Total Departments** | **8** |
| **Total Issues** | **13** |
| - Open | 3 |
| - In Progress | 4 |
| - Resolved | 3 |
| - Closed | 3 |

---

## 🚀 HOW TO USE

1. **Start the application:**
   ```bash
   cd Backend/DQIMS
   ./mvnw spring-boot:run
   ```

2. **Login with any user:**
   - Email: Any email from the tables above
   - Password: `password`

3. **Test different roles:**
   - **Admin:** `admin@rra.gov.rw` / `password`
   - **HOD (Finance):** `jean.mugisha@rra.gov.rw` / `password`
   - **Staff (Finance):** `john.kamanzi@rra.gov.rw` / `password`

4. **The system will automatically:**
   - Create all departments
   - Create all users with hashed passwords
   - Create sample issues with different statuses
   - Link issues to appropriate users

---

## ✅ BENEFITS

✅ **No manual data entry needed** - Everything is seeded automatically  
✅ **Realistic test data** - Issues span all departments and statuses  
✅ **Easy testing** - All users have same password for convenience  
✅ **Complete workflow** - Issues in all stages (OPEN → IN_PROGRESS → RESOLVED → CLOSED)  
✅ **Multiple departments** - Test department-based filtering  
✅ **Role-based testing** - Test Admin, HOD, and Staff permissions  

---

## 🔄 RE-SEEDING DATA

If you need to reset the data:

1. **Drop and recreate database:**
   ```sql
   DROP DATABASE dqims;
   CREATE DATABASE dqims;
   ```

2. **Restart application:**
   ```bash
   ./mvnw spring-boot:run
   ```

The DataSeeder will automatically populate all data again.

---

**Last Updated:** 2024  
**Project:** Data Quality Issues Management System (DQIMS)  
**Organization:** Rwanda Revenue Authority (RRA)
