# 📊 DQIMS - Data Quality Issues Management System

**Final Year Project - Rwanda Revenue Authority**

A comprehensive web-based system for tracking, managing, and resolving data quality issues across organizational departments.

---

## 🎯 Project Overview

DQIMS is an enterprise-grade issue management system specifically designed for tracking and resolving data quality problems within the Rwanda Revenue Authority (RRA). The system provides role-based access control, real-time notifications, comprehensive audit trails, and advanced reporting capabilities.

### Key Features

- ✅ **Role-Based Access Control** - Admin, HOD, and Staff roles with appropriate permissions
- ✅ **Issue Lifecycle Management** - Create, assign, track, and resolve data quality issues
- ✅ **Department Management** - Organized by RRA departments (Finance, Tax, Customs, IT, HR)
- ✅ **Dual-Channel Notifications** - In-system notifications + professional email alerts
- ✅ **Real-time Comments** - Collaborative issue resolution with comment threads
- ✅ **Comprehensive Audit Trail** - Track all system activities with detailed logs
- ✅ **Advanced Reporting** - Generate professional Excel reports with filters
- ✅ **Priority Management** - HIGH, MEDIUM, LOW priority levels
- ✅ **Status Tracking** - OPEN → IN_PROGRESS → RESOLVED → CLOSED workflow

---

## 🏗️ System Architecture

### Technology Stack

#### Backend
- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **Database**: PostgreSQL 15
- **Security**: Spring Security + JWT Authentication
- **Email**: Spring Mail (Gmail SMTP)
- **Migration**: Flyway
- **Build Tool**: Maven
- **API**: RESTful APIs with comprehensive endpoints

#### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Build Tool**: Vite

#### Additional Tools
- **Documentation**: PlantUML diagrams
- **Version Control**: Git
- **API Testing**: Postman/Insomnia compatible

---

## 📁 Project Structure

```
Final Year Project/
├── Backend/
│   └── DQIMS/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/rw/rra/dqims/
│       │   │   │   ├── config/          # Configuration classes
│       │   │   │   ├── controller/      # REST controllers
│       │   │   │   ├── dto/            # Data transfer objects
│       │   │   │   ├── entity/         # JPA entities
│       │   │   │   ├── exception/      # Exception handlers
│       │   │   │   ├── repository/     # Data repositories
│       │   │   │   ├── security/       # Security configuration
│       │   │   │   ├── service/        # Business logic
│       │   │   │   └── util/           # Utility classes
│       │   │   └── resources/
│       │   │       ├── db/migration/   # Flyway migrations
│       │   │       └── application.properties
│       │   └── test/                   # Unit tests
│       ├── pom.xml                     # Maven dependencies
│       └── Documentation/              # API & system docs
│
├── Frontend/
│   └── dqims-app/
│       ├── src/
│       │   ├── components/            # React components
│       │   ├── contexts/             # Context providers
│       │   ├── pages/                # Page components
│       │   ├── services/             # API services
│       │   ├── types/                # TypeScript types
│       │   └── utils/                # Utility functions
│       ├── public/                   # Static assets
│       ├── package.json              # Dependencies
│       └── vite.config.ts            # Vite configuration
│
└── Documentation/
    ├── Database/                     # Database schemas
    ├── PlantUML/                     # Architecture diagrams
    ├── API-Documentation.md
    ├── Database-Schema.md
    └── Project-Overview.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **PostgreSQL**: v15 or higher
- **Maven**: 3.8+ (included via wrapper)
- **Git**: For version control

### 1️⃣ Database Setup

```sql
-- Create database
CREATE DATABASE dqims_db;

-- Create user (optional)
CREATE USER dqims_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE dqims_db TO dqims_user;
```

### 2️⃣ Backend Setup

```bash
cd Backend/DQIMS

# Configure application.properties
# Edit src/main/resources/application.properties:
# - Database credentials
# - Email credentials (for notifications)
# - JWT secret

# Build and run
./mvnw spring-boot:run

# Or on Windows
.\mvnw spring-boot:run
```

The backend will start on **http://localhost:8080**

### 3️⃣ Frontend Setup

```bash
cd Frontend/dqims-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:5173**

---

## 🔐 Default User Accounts

After running Flyway migrations and data seeding, the following test accounts are available:

| Role | Email | Password | Department |
|------|-------|----------|------------|
| **Admin** | admin@rra.gov.rw | Admin@123 | IT |
| **HOD** | hod.finance@rra.gov.rw | Hod@123 | Finance |
| **HOD** | hod.tax@rra.gov.rw | Hod@123 | Tax |
| **Staff** | staff1@rra.gov.rw | Staff@123 | Finance |
| **Staff** | staff2@rra.gov.rw | Staff@123 | Tax |

⚠️ **Important**: Change these passwords in production!

---

## 📧 Email Notification Setup

The system uses Gmail SMTP for sending email notifications. To configure:

1. Create a Gmail account or use existing
2. Enable 2-Step Verification
3. Generate an App Password
4. Update `application.properties`:

```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
app.mail.from=your-email@gmail.com
```

### Notification Features
- ✅ Welcome emails with temporary passwords
- ✅ Issue assignment notifications
- ✅ Status change alerts
- ✅ Comment notifications
- ✅ Password reset emails
- ✅ Account update confirmations

---

## 🎨 User Roles & Permissions

### 👨‍💼 Admin
- Full system access
- Create/manage users
- View all issues across departments
- Generate system-wide reports
- Access audit logs
- System configuration

### 👔 Head of Department (HOD)
- View all issues in their department
- Assign issues to staff members
- Change issue priority and status
- Generate department reports
- Approve issue resolutions

### 👤 Staff
- Create new issues
- View assigned issues
- Update issue progress
- Add comments and attachments
- Mark issues as resolved

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/login              # User login
POST   /api/auth/forgot-password    # Request password reset
POST   /api/auth/reset-password     # Reset password
PUT    /api/auth/change-password    # Change password
GET    /api/auth/me                 # Get current user
```

### Users
```
GET    /api/users                   # List all users
POST   /api/users                   # Create user (Admin)
GET    /api/users/{id}              # Get user details
PUT    /api/users/{id}              # Update user (Admin)
DELETE /api/users/{id}              # Deactivate user (Admin)
GET    /api/users/department/{dept} # Users by department
```

### Issues
```
GET    /api/issues                  # List issues (paginated)
POST   /api/issues                  # Create issue
GET    /api/issues/{id}             # Get issue details
PUT    /api/issues/{id}             # Update issue
DELETE /api/issues/{id}             # Delete issue (soft)
POST   /api/issues/{id}/comments    # Add comment
GET    /api/issues/{id}/comments    # Get comments
```

### Notifications
```
GET    /api/notifications           # Get my notifications
PUT    /api/notifications/{id}/read # Mark as read
PUT    /api/notifications/read-all  # Mark all as read
```

### Reports
```
GET    /api/reports/export          # Export Excel report
GET    /api/reports/summary         # Dashboard summary
```

### Audit Logs
```
GET    /api/audit-logs              # System audit trail (Admin)
```

---

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts and authentication
- `issues` - Data quality issues
- `issue_comments` - Issue discussion threads
- `notifications` - In-system notifications
- `audit_logs` - System activity tracking
- `password_history` - Password change history

See `Documentation/Database-Schema.md` for detailed schema.

---

## 📈 Reporting Features

### Available Reports
- Issues by Department
- Issues by Status
- Issues by Priority
- Issues by Date Range
- User Activity Reports
- Resolution Time Analytics

### Export Formats
- ✅ Excel (.xlsx) with formatting
- ✅ Professional styling and branding
- ✅ Multiple worksheets for different views

---

## 🧪 Testing

### Backend Testing Guide
See `Backend/DQIMS/NOTIFICATION-TESTING-GUIDE.md` for comprehensive testing procedures.

### Quick Test
```bash
# Test backend health
curl http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rra.gov.rw","password":"Admin@123"}'
```

---

## 📚 Documentation

- **NOTIFICATION-SYSTEM-COMPLETE.md** - Email notification architecture
- **NOTIFICATION-TESTING-GUIDE.md** - Testing procedures
- **NOTIFICATION-QUICK-REFERENCE.md** - Quick reference card
- **Database-Schema.md** - Complete database documentation
- **SEEDED-DATA-SUMMARY.md** - Test data reference
- **PlantUML/** - System architecture diagrams

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password encryption (BCrypt)
- ✅ Role-based authorization
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (JPA)
- ✅ XSS protection
- ✅ Audit logging

---

## 🛠️ Configuration

### Environment Variables (Production)
```bash
# Database
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=dqims_db
export DB_USER=your_user
export DB_PASSWORD=your_password

# JWT
export JWT_SECRET=your-512-bit-secret-key
export JWT_EXPIRATION=3600000

# Email
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password

# Application
export SERVER_PORT=8080
export CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🚀 Deployment

### Backend (Production)
```bash
# Build JAR
./mvnw clean package -DskipTests

# Run
java -jar target/dqims-1.0.0.jar
```

### Frontend (Production)
```bash
# Build for production
npm run build

# Serve with nginx or deploy to cloud
```

---

## 📝 Project Information

- **Project Name**: Data Quality Issues Management System (DQIMS)
- **Organization**: Rwanda Revenue Authority (RRA)
- **Type**: Final Year Project
- **Author**: Noella Urumuri
- **Academic Year**: 2025/2026
- **Version**: 1.0.0
- **License**: Proprietary (RRA)

---

## 🤝 Contributing

This is an academic/organizational project. For contributions or suggestions:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📞 Support & Contact

For issues, questions, or support:
- **Email**: urumurinoella3@gmail.com
- **GitLab**: https://gitlab.com/urumulinoella/final_exam_project

---

## 🏆 Acknowledgments

- Rwanda Revenue Authority (RRA) - Project sponsorship and requirements
- Academic Supervisors - Guidance and feedback
- Spring Boot & React Communities - Technical support

---

## 📅 Project Milestones

- ✅ Requirements Analysis - Completed
- ✅ System Design - Completed
- ✅ Database Design - Completed
- ✅ Backend Development - Completed
- ✅ Frontend Development - Completed
- ✅ Notification System - Completed
- ✅ Testing - In Progress
- ⏳ Deployment - Pending
- ⏳ Documentation - Finalization

---

**Built with ❤️ for Rwanda Revenue Authority**

*Last Updated: June 9, 2026*
