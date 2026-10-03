# DQIMS - Data Quality Issues Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

A comprehensive web-based system for managing data quality issues at Rwanda Revenue Authority (RRA). Built with Spring Boot backend and React frontend, featuring role-based access control, real-time notifications, and comprehensive reporting.

## 🎯 Project Overview

DQIMS is a Final Year Project that provides a robust platform for identifying, tracking, and resolving data quality issues within an organization. The system supports three user roles (Admin, HOD, and Staff) with distinct permissions and workflows.

### Key Features

- **Role-Based Access Control**: Admin, Head of Department (HOD), and Staff roles with specific permissions
- **Issue Management**: Complete lifecycle tracking from creation to resolution
- **Data Validation**: CSV file upload and validation with error reporting
- **Real-Time Notifications**: Email and in-system notifications for issue updates
- **Comprehensive Reporting**: Excel and Word reports with statistics and audit trails
- **Department Management**: Organize issues by department with HOD oversight
- **Audit Logging**: Complete activity tracking for accountability
- **Responsive UI**: Modern, professional interface built with React and Tailwind CSS

## 📸 Screenshots

*Coming soon - Add screenshots of your application here*

## 🏗️ System Architecture

### Technology Stack

#### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL 15
- **Security**: Spring Security with JWT
- **Email**: JavaMail API
- **Reporting**: Apache POI (Excel & Word)

#### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Architecture Pattern
- **Backend**: Layered architecture (Controller → Service → Repository → Entity)
- **Frontend**: Component-based architecture with context API for state management
- **Database**: Relational database with proper foreign key relationships

## 📦 Installation & Setup

### Prerequisites

- **Java Development Kit (JDK) 17+**
- **Node.js 18+ and npm**
- **PostgreSQL 15+**
- **Git**
- **Maven** (included with Spring Boot)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/urumurinoella3-beep/final-year-project.git
cd final-year-project
```

2. **Set up PostgreSQL database**
```sql
CREATE DATABASE dqims_db;
CREATE USER postgres WITH PASSWORD 'noella@090';
GRANT ALL PRIVILEGES ON DATABASE dqims_db TO postgres;
```

3. **Import database schema and seed data**
```bash
# Navigate to database package
cd Database-Transfer-Package

# Import schema (using psql or pgAdmin)
psql -U postgres -d dqims_db -f COMPLETE-DATABASE-SCHEMA.sql

# Import seed data
psql -U postgres -d dqims_db -f SEED-DATA.sql
```

4. **Configure backend application**

Create `Backend/DQIMS/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/dqims_db
spring.datasource.username=postgres
spring.datasource.password=noella@090
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Port
server.port=8080

# JWT Configuration
jwt.secret=your-secret-key-here-make-it-long-and-secure
jwt.expiration=86400000

# Email Configuration (Optional - for notifications)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

5. **Run the backend**
```bash
cd Backend/DQIMS
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**
```bash
cd Frontend
npm install
```

2. **Configure API endpoint** (if needed)

The frontend is already configured to connect to `http://localhost:8080`. If your backend runs on a different port, update the API base URL in `src/app/context/AuthContext.tsx`.

3. **Run the frontend**
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## 👥 Default Users

After importing the seed data, you can log in with these credentials:

| Role | Email | Password | Department |
|------|-------|----------|------------|
| **Admin** | admin@rra.gov.rw | password | - |
| **HOD (IT)** | hod.it@rra.gov.rw | password | IT |
| **HOD (VAT)** | hod.vat@rra.gov.rw | password | VAT |
| **Staff (IT)** | john.mugabo@rra.gov.rw | password | IT |
| **Staff (VAT)** | staff.vat@rra.gov.rw | password | VAT |

*See `Database-Transfer-Package/DATABASE-DOCUMENTATION.md` for complete list of users*

## 📚 Documentation

### Available Documentation

- **[Database Setup Guide](Database-Transfer-Package/README-SETUP-GUIDE.md)** - Complete database setup instructions
- **[Database Documentation](Database-Transfer-Package/DATABASE-DOCUMENTATION.md)** - Schema and relationships
- **[Staff Dashboard Fix](START-HERE-STAFF-FIX.md)** - Latest feature implementation
- **[Color Customization Guide](Frontend/COLOR-CUSTOMIZATION-GUIDE.md)** - UI theming guide

## 🎨 User Roles & Permissions

### Admin
- ✅ View all issues across all departments
- ✅ Manage users (create, update, deactivate)
- ✅ Manage departments
- ✅ Generate system-wide reports
- ✅ Access complete audit logs
- ✅ System configuration

### Head of Department (HOD)
- ✅ View all issues in their department
- ✅ Assign issues to staff members
- ✅ Change issue priority and status
- ✅ Close resolved issues
- ✅ Generate department reports
- ✅ View department activity logs

### Staff
- ✅ Report new data quality issues
- ✅ View issues assigned to them
- ✅ View issues they reported
- ✅ Update status of assigned issues
- ✅ Add comments to issues
- ✅ Upload validation files
- ✅ Receive notifications

## 📊 Features in Detail

### Issue Management
- Create, track, and resolve data quality issues
- Priority levels: High, Medium, Low
- Status tracking: Open → In Progress → Resolved → Closed
- Issue types: Missing, Duplicate, Incorrect, Inconsistent
- File attachments support
- Comment system for collaboration

### Data Validation
- CSV file upload and parsing
- Real-time validation with error reporting
- Preview data before acceptance
- Validation session management
- Error categorization and details

### Notifications
- Email notifications for issue updates
- In-system notification center
- Real-time updates on status changes
- Assignment notifications
- Comment notifications

### Reporting
- Excel reports with statistics and issue listings
- Word reports with professional formatting
- Date range filtering
- Department filtering
- Status filtering
- Complete audit trail included

### Audit Logging
- Track all system activities
- User action history
- Issue lifecycle tracking
- Export audit logs

## 🚀 Deployment

### Production Deployment Checklist

- [ ] Update database credentials in `application.properties`
- [ ] Set strong JWT secret key
- [ ] Configure production email server
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (not update)
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure log levels
- [ ] Set up monitoring

### Building for Production

**Backend:**
```bash
cd Backend/DQIMS
mvn clean package
java -jar target/dqims-1.0.0.jar
```

**Frontend:**
```bash
cd Frontend
npm run build
# Deploy the 'dist' folder to your web server
```

## 🧪 Testing

### Test User Accounts
All test accounts use password: `password`

### Quick Test Scenarios

1. **Admin Flow**: Login as admin → Manage users → View all issues → Generate reports
2. **HOD Flow**: Login as HOD → View department issues → Assign to staff → Close resolved
3. **Staff Flow**: Login as staff → Report issue → Track status → Update assigned issues

## 🔒 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Role-based authorization
- CORS configuration
- SQL injection prevention (JPA)
- XSS protection
- CSRF protection

## 📝 API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Key Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration (Admin only)

#### Issues
- `GET /issues` - Get filtered issues
- `POST /issues` - Create new issue
- `PUT /issues/{id}` - Update issue
- `GET /issues/{id}` - Get issue details
- `POST /issues/{id}/comments` - Add comment

#### Reports
- `POST /reports/excel` - Generate Excel report
- `POST /reports/word` - Generate Word report

#### Data Validation
- `POST /data-validation/upload` - Upload CSV file
- `GET /data-validation/sessions` - Get validation sessions

*See backend controllers for complete API documentation*

## 🤝 Contributing

This is a Final Year Project for academic purposes. However, suggestions and feedback are welcome!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Noella Urumuri**
- GitHub: [@urumurinoella3-beep](https://github.com/urumurinoella3-beep)
- Email: noella.urumuri@student.ur.ac.rw

## 🎓 Academic Information

- **Institution**: University of Rwanda
- **Program**: Bachelor of Science in Computer Science
- **Year**: Final Year (2026)
- **Project Type**: Final Year Project
- **Supervisor**: [Supervisor Name]

## 🙏 Acknowledgments

- Rwanda Revenue Authority (RRA) for project inspiration
- University of Rwanda for academic support
- Spring Boot and React communities for excellent documentation
- All open-source contributors whose libraries made this project possible

## 📞 Support

For questions or issues:
1. Open an issue on GitHub
2. Contact via email: noella.urumuri@student.ur.ac.rw
3. Check documentation in the `Database-Transfer-Package` folder

## 🗺️ Project Structure

```
final-year-project/
├── Backend/
│   └── DQIMS/
│       ├── src/main/java/rw/rra/dqims/
│       │   ├── config/          # Security, CORS, Async config
│       │   ├── controller/      # REST API controllers
│       │   ├── dto/            # Data Transfer Objects
│       │   ├── entity/         # JPA entities
│       │   ├── repository/     # Database repositories
│       │   ├── service/        # Business logic
│       │   └── exception/      # Custom exceptions
│       ├── src/main/resources/
│       │   └── application.properties
│       └── pom.xml
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── context/       # React Context (Auth, etc.)
│   │   │   ├── pages/         # Page components
│   │   │   ├── services/      # API service layer
│   │   │   └── types/         # TypeScript types
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── Database-Transfer-Package/
│   ├── COMPLETE-DATABASE-SCHEMA.sql
│   ├── SEED-DATA.sql
│   ├── README-SETUP-GUIDE.md
│   └── DATABASE-DOCUMENTATION.md
├── Documentation/              # Thesis diagrams (PlantUML)
├── test_taxpayers_sample.csv   # Sample data for testing
└── README.md                   # This file
```

## 🔄 Recent Updates

### Latest Features (July 2026)
- ✅ Staff dashboard now shows both assigned and reported issues
- ✅ Data validation module with CSV upload
- ✅ Enhanced reporting with Excel and Word formats
- ✅ Complete audit logging system
- ✅ Email notification system
- ✅ Improved UI with better color schemes
- ✅ Bug fixes for issue creation and CORS

See commit history for detailed changes.

---

**Built with ❤️ for Rwanda Revenue Authority**
