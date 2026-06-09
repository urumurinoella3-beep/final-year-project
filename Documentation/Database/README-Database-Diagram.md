# DQIMS Database Diagram for dbdiagram.io

## 🎯 How to Use

### Method 1: Direct Import (Recommended)
1. Go to https://dbdiagram.io/d
2. Click "Import" button (top right)
3. Select "From file"
4. Upload `DQIMS-Database-Diagram.dbml`
5. View your complete database diagram!

### Method 2: Copy & Paste
1. Go to https://dbdiagram.io/d
2. Open `DQIMS-Database-Diagram.dbml` file
3. Copy all the content
4. Paste into the dbdiagram.io editor
5. The diagram will render automatically!

---

## 📊 What's Included

### 10 Database Tables
1. **users** - System users (Admin, HOD, Staff)
2. **departments** - Organizational departments
3. **issues** - Core issue tracking table
4. **issue_comments** - Comments on issues
5. **issue_attachments** - File attachments
6. **notifications** - In-app notifications
7. **audit_logs** - System activity tracking
8. **password_history** - Password reuse prevention
9. **validation_sessions** - Data validation tracking
10. **validation_errors** - Validation error details

### 14 Relationships
- All foreign key relationships defined
- Proper referential integrity
- Cascade and restrict rules

### Complete Schema Details
- ✅ All field types
- ✅ Primary keys
- ✅ Foreign keys
- ✅ Unique constraints
- ✅ Default values
- ✅ Indexes for performance
- ✅ Field descriptions
- ✅ Table notes

---

## 🎨 Diagram Features

### Visual Elements
- **Blue headers** - Table names
- **Key icons** - Primary keys (🔑)
- **Arrow icons** - Foreign keys (🔗)
- **Relationship lines** - Show connections between tables
- **Cardinality** - One-to-many relationships shown

### Interactive Features
- Click tables to highlight relationships
- Zoom in/out
- Pan around the diagram
- Export as PNG/PDF/SVG
- Share diagram link

---

## 📥 Export Options

Once your diagram is rendered on dbdiagram.io:

### 1. Export as Image
- Click "Export" → "PNG" (for presentations)
- Click "Export" → "PDF" (for documentation)
- Click "Export" → "SVG" (for high quality)

### 2. Export SQL
- Click "Export" → "MySQL" (get CREATE TABLE statements)
- Use this to create your actual database!

### 3. Share Link
- Click "Share" to get a public link
- Share with your team or advisor

---

## 🔍 Understanding the Diagram

### Table Colors
All tables have blue headers for consistency

### Relationship Types
- **One-to-Many (1:N)** - One user can have many issues
- **Many-to-One (N:1)** - Many issues belong to one user

### Key Relationships

**Users Table (Central)**
- Users report issues (`issues.reported_by`)
- Users are assigned issues (`issues.assigned_to`)
- Users close issues (`issues.closed_by`)
- Users write comments (`issue_comments.user_id`)
- Users upload attachments (`issue_attachments.uploaded_by`)
- Users receive notifications (`notifications.user_id`)
- Users perform actions (`audit_logs.user_id`)

**Issues Table (Core)**
- Issues have comments (`issue_comments.issue_id`)
- Issues have attachments (`issue_attachments.issue_id`)
- Issues trigger notifications (`notifications.issue_id`)

**Validation Tables**
- Sessions track validation runs (`validation_sessions`)
- Errors link to sessions (`validation_errors.session_id`)

---

## 📋 Database Statistics

| Metric | Value |
|--------|-------|
| Total Tables | 10 |
| Total Relationships | 14 |
| Total Fields | 100+ |
| Primary Keys | 10 |
| Foreign Keys | 14 |
| Unique Constraints | 4 |
| Indexes | 25+ |

---

## 🎓 For Your Thesis

### Chapter 4: Database Design

**Section 4.2: Database Schema**

1. **Import diagram to dbdiagram.io**
2. **Export as PNG or PDF**
3. **Insert in your thesis**
4. **Add caption:**
   ```
   Figure 4.X: DQIMS Database Schema showing 10 tables 
   and their relationships
   Source: Author's Design, 2024
   ```

### Explanation Points

**In your thesis, explain:**

1. **Entity-Relationship Model**
   - "The database follows a relational model with 10 normalized tables"
   - "Foreign key constraints ensure referential integrity"

2. **Core Entities**
   - Users (authentication and authorization)
   - Issues (core business entity)
   - Departments (organizational structure)

3. **Supporting Entities**
   - Comments (collaboration)
   - Attachments (documentation)
   - Notifications (real-time updates)
   - Audit Logs (compliance and security)

4. **Data Validation**
   - Validation Sessions (tracking)
   - Validation Errors (detailed reporting)

5. **Security**
   - Password History (prevents reuse)
   - Audit Logs (tracks all actions)

---

## 🔧 Customization

### To Modify the Diagram

1. **Edit the DBML file** (`DQIMS-Database-Diagram.dbml`)
2. **Add new tables:**
   ```dbml
   Table new_table {
     id bigint [pk, increment]
     name varchar(255)
   }
   ```

3. **Add new relationships:**
   ```dbml
   Table table1 {
     table2_id bigint [ref: > table2.id]
   }
   ```

4. **Re-import to dbdiagram.io**

---

## ✅ Quality Checklist

Before using in thesis:

- [ ] All 10 tables visible
- [ ] All relationships shown
- [ ] Diagram is clear and readable
- [ ] Exported in high quality (PNG/PDF/SVG)
- [ ] Figure caption added
- [ ] Explanation text written
- [ ] Referenced in thesis text

---

## 🎯 Quick Tips

### For Best Results

1. **Use SVG export** for thesis (scalable, high quality)
2. **Zoom to fit** before exporting
3. **Use landscape orientation** if diagram is wide
4. **Add to appendix** if too large for main text
5. **Reference specific tables** in your explanation

### Common Issues

**Problem:** Diagram too large
**Solution:** Export as PDF, insert in landscape page

**Problem:** Text too small
**Solution:** Zoom in before exporting, or split into multiple diagrams

**Problem:** Relationships unclear
**Solution:** Click on a table to highlight its relationships

---

## 📞 Support

### dbdiagram.io Help
- Documentation: https://dbdiagram.io/docs
- Syntax Guide: https://dbdiagram.io/docs/syntax

### DBML Language
- GitHub: https://github.com/holistics/dbml
- Specification: https://www.dbml.org/

---

## 🎉 You're Ready!

Your database diagram is complete and ready to use:

✅ **10 tables** fully defined  
✅ **14 relationships** properly connected  
✅ **100+ fields** documented  
✅ **All constraints** specified  
✅ **Indexes** for performance  
✅ **Ready for thesis** and documentation  

**Go to https://dbdiagram.io/d and import your diagram!**

---

**File:** `DQIMS-Database-Diagram.dbml`  
**Format:** DBML (Database Markup Language)  
**Compatible with:** dbdiagram.io, dbdocs.io  
**Version:** 1.0  
**Date:** 2024

**Project:** Data Quality Issues Management System (DQIMS)  
**Organization:** Rwanda Revenue Authority (RRA)  
**Contact:** urumurinoella3@gmail.com
