# DQIMS Backend - Complete Specification for Cursor AI
# Generate Spring Boot Backend from This File

**IMPORTANT**: This file contains EVERYTHING needed to generate a production-ready Spring Boot backend for DQIMS.

---

## 🎯 PROJECT SUMMARY

- **Name**: DQIMS (Data Quality Issues Management System)
- **Client**: Rwanda Revenue Authority (RRA)
- **Technology**: Spring Boot 3.2.5 + PostgreSQL 14+ + JWT
- **Roles**: ADMIN, HOD (Head of Department), STAFF
- **Departments**: VAT, CUSTOMS, DOMESTIC TAX, IT, TAX INVESTIGATIONS, HR, FINANCE

---

## 📦 MAVEN POM.XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
    </parent>
    <groupId>rw.rra</groupId>
    <artifactId>dqims</artifactId>
    <version>1.0.0</version>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>5.2.5</version>
        </dependency>
        <dependency>
            <groupId>com.itextpdf</groupId>
            <artifactId>itextpdf</artifactId>
            <version>5.5.13.3</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
    </dependencies>
</project>
```

---

## 🗄️ DATABASE SCHEMA - COPY AND RUN THIS

```sql
-- Run this entire script in PostgreSQL

CREATE DATABASE dqims_db;
\c dqims_db;

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'HOD', 'STAFF')),
    department VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_first_login BOOLEAN DEFAULT TRUE,
    password_reset_token VARCHAR(255),
    password_reset_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);

-- Default admin (password: Admin@123)
INSERT INTO users (employee_id, name, email, phone, password_hash, role, department, is_first_login)
VALUES ('EMP001', 'System Admin', 'admin@rra.gov.rw', '+250788000001', 
        '$2a$10$5M3Y9pV4M.8H7gVwqVJdKOkD7HvBHZ2qM3gCFW5HhL9YqX5ZKvMlO', 
        'ADMIN', 'IT', FALSE);

-- 2. Departments Table
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO departments (name, description) VALUES
('VAT', 'Value Added Tax Department'),
('CUSTOMS', 'Customs Department'),
('DOMESTIC TAX', 'Domestic Tax Department'),
('IT', 'Information Technology Department'),
('TAX INVESTIGATIONS', 'Tax Investigations Department'),
('HR', 'Human Resources'),
('FINANCE', 'Finance Department');

-- 3. Issues Table
CREATE TABLE issues (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    source VARCHAR(50) NOT NULL,
    data_element VARCHAR(100) NOT NULL,
    issue_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    department VARCHAR(50) NOT NULL,
    reported_by BIGINT REFERENCES users(id),
    assigned_to BIGINT REFERENCES users(id),
    is_delegated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    closed_by BIGINT REFERENCES users(id)
);

CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_department ON issues(department);

-- 4. Issue Attachments
CREATE TABLE issue_attachments (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT REFERENCES issues(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    uploaded_by BIGINT REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Issue Comments
CREATE TABLE issue_comments (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT REFERENCES issues(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Notifications
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    issue_id BIGINT REFERENCES issues(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Audit Logs
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Validation Sessions
CREATE TABLE validation_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    total_records INTEGER,
    passed_records INTEGER,
    failed_records INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Validation Errors
CREATE TABLE validation_errors (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT REFERENCES validation_sessions(id),
    row_number INTEGER,
    error_type VARCHAR(50),
    field_name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Password History
CREATE TABLE password_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📝 APPLICATION.PROPERTIES

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/dqims_db
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT
jwt.secret=your-512-bit-secret-key-here-change-in-production
jwt.expiration=3600000
jwt.refresh-expiration=604800000

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
file.upload-dir=./uploads

# Server
server.port=8080
spring.application.name=DQIMS

# CORS
cors.allowed-origins=http://localhost:3000,https://dqims.rra.gov.rw
```

---

## 🔐 KEY ENTITIES (JPA)

### User.java
```java
@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String employeeId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role; // ADMIN, HOD, STAFF
    
    @Column(nullable = false)
    private String department;
    
    private Boolean isActive = true;
    private Boolean isFirstLogin = true;
    private String passwordResetToken;
    private LocalDateTime passwordResetExpiry;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Issue.java
```java
@Entity
@Table(name = "issues")
@Data
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private String source;
    private String dataElement;
    private String issueType;
    private String severity;
    private String priority;
    private String status;
    private String department;
    
    @ManyToOne
    @JoinColumn(name = "reported_by")
    private User reportedBy;
    
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    private Boolean isDelegated = false;
    
    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL)
    private List<IssueAttachment> attachments;
    
    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL)
    private List<IssueComment> comments;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    
    @ManyToOne
    @JoinColumn(name = "closed_by")
    private User closedBy;
}
```

---

## 🔌 CRITICAL API ENDPOINTS

### 1. Authentication (AuthController.java)

```java
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    
    // POST /api/v1/auth/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Validate email and password
        // Generate JWT token
        // Return token + user info
    }
    
    // POST /api/v1/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        // Invalidate token
    }
    
    // POST /api/v1/auth/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        // Generate reset token
        // Send email with reset link
    }
    
    // POST /api/v1/auth/reset-password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        // Validate token
        // Update password
    }
    
    // POST /api/v1/auth/change-password
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody ChangePasswordRequest request) {
        // Verify old password
        // Update to new password
        // Save in password history
    }
}
```

### 2. Users (UserController.java)

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    // GET /api/v1/users (ADMIN only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(Pageable pageable) {}
    
    // POST /api/v1/users (ADMIN only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        // Create user
        // Generate temporary password
        // Send email with credentials
    }
    
    // PUT /api/v1/users/{id} (ADMIN only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {}
    
    // DELETE /api/v1/users/{id} (ADMIN only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {}
}
```

### 3. Issues (IssueController.java)

```java
@RestController
@RequestMapping("/api/v1/issues")
public class IssueController {
    
    // GET /api/v1/issues (Role-filtered)
    @GetMapping
    public ResponseEntity<Page<IssueResponse>> getIssues(Pageable pageable) {
        // ADMIN: all issues
        // HOD: department issues only
        // STAFF: assigned issues only
    }
    
    // POST /api/v1/issues (with file upload)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IssueResponse> createIssue(
            @RequestPart("issue") CreateIssueRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        // Create issue
        // Save files
        // Create notification if assigned
        // Send email
        // Create audit log
    }
    
    // GET /api/v1/issues/{id}
    @GetMapping("/{id}")
    public ResponseEntity<IssueDetailResponse> getIssueById(@PathVariable Long id) {
        // Include attachments
        // Include comments
    }
    
    // PUT /api/v1/issues/{id}
    @PutMapping("/{id}")
    public ResponseEntity<IssueResponse> updateIssue(@PathVariable Long id, @RequestBody UpdateIssueRequest request) {
        // Update issue
        // Create notification if status/priority changed
        // Create audit log
    }
    
    // PUT /api/v1/issues/{id}/close (HOD/ADMIN only)
    @PutMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD')")
    public ResponseEntity<IssueResponse> closeIssue(@PathVariable Long id) {
        // Set status to CLOSED
        // Set closed_at and closed_by
        // Create notification
    }
    
    // POST /api/v1/issues/{id}/comments
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long id, @RequestBody AddCommentRequest request) {
        // Add comment
        // Create notification
    }
}
```

### 4. Notifications (NotificationController.java)

```java
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    
    // GET /api/v1/notifications
    @GetMapping
    public ResponseEntity<NotificationResponse> getNotifications() {
        // Return user's notifications
        // Include unread count
    }
    
    // PUT /api/v1/notifications/{id}/read
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long id) {}
    
    // PUT /api/v1/notifications/read-all
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse> markAllAsRead() {}
}
```

---

## 📧 EMAIL TEMPLATES

### User Creation Email
```html
<!DOCTYPE html>
<html>
<body>
    <h2>Welcome to DQIMS</h2>
    <p>Dear {{name}},</p>
    <p>Your account has been created:</p>
    <ul>
        <li>Employee ID: {{employeeId}}</li>
        <li>Email: {{email}}</li>
        <li>Role: {{role}}</li>
        <li>Department: {{department}}</li>
    </ul>
    <p><strong>Temporary Password:</strong> {{tempPassword}}</p>
    <p>Please change your password upon first login.</p>
    <p>Login at: <a href="https://dqims.rra.gov.rw">https://dqims.rra.gov.rw</a></p>
</body>
</html>
```

### Issue Assigned Email
```html
<!DOCTYPE html>
<html>
<body>
    <h2>New Issue Assigned</h2>
    <p>Dear {{userName}},</p>
    <p>A new issue has been assigned to you:</p>
    <ul>
        <li>Title: {{issueTitle}}</li>
        <li>Priority: {{priority}}</li>
        <li>Department: {{department}}</li>
    </ul>
    <p><a href="https://dqims.rra.gov.rw/issues/{{issueId}}">View Issue</a></p>
</body>
</html>
```

---

## 🔒 SECURITY

### JWT Configuration
- Secret: 512-bit key (configure in application.properties)
- Expiry: 1 hour
- Refresh: 7 days

### Password Policy
- Minimum 8 characters
- Must contain uppercase, lowercase, number, special character
- Cannot reuse last 5 passwords
- BCrypt hashing

### Role-Based Access
- ADMIN: Full system access
- HOD: Department access only, can close issues
- STAFF: View assigned issues, update status, add comments

---

## 📊 IMPORTANT BUSINESS RULES

1. **Each department must have at least one HOD**
2. **Cannot delete department with active users**
3. **Only HOD/ADMIN can close issues**
4. **STAFF can only see assigned issues**
5. **HOD can only see department issues**
6. **File upload max 10MB per file**
7. **Allowed file types: pdf, doc, docx, xls, xlsx, jpg, jpeg, png**
8. **Send notification on**: Issue assigned, Status changed, Priority changed, Comment added
9. **Send email on**: User creation, Password reset, Issue assigned
10. **Audit all actions**: User login, Issue created, Status updated, etc.

---

## ✅ TESTING REQUIREMENTS

### Unit Tests (80% coverage)
- All service methods
- All repository queries
- Security configurations

### Integration Tests
- All API endpoints
- Database transactions
- Email sending
- File upload/download

### Test Users
```sql
-- Insert test users
INSERT INTO users (employee_id, name, email, phone, password_hash, role, department)
VALUES
('TEST_ADMIN', 'Test Admin', 'admin.test@rra.gov.rw', '+250788000001', '$2a$10$...', 'ADMIN', 'IT'),
('TEST_HOD', 'Test HOD', 'hod.test@rra.gov.rw', '+250788000002', '$2a$10$...', 'HOD', 'VAT'),
('TEST_STAFF', 'Test Staff', 'staff.test@rra.gov.rw', '+250788000003', '$2a$10$...', 'STAFF', 'VAT');
```

---

## 🚀 DEPLOYMENT

### Environment Variables
```bash
DB_URL=jdbc:postgresql://localhost:5432/dqims_db
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your-secret-key
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
FILE_UPLOAD_DIR=/var/dqims/uploads
```

### Docker Compose (Optional)
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: dqims_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
    ports:
      - "5432:5432"
      
  dqims-backend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/dqims_db
```

---

## 📌 CURSOR AI INSTRUCTIONS

To generate this backend with Cursor AI:

1. **Create Spring Boot project** with above dependencies
2. **Run the database SQL script** to create all tables
3. **Create all Entity classes** (User, Issue, Department, etc.)
4. **Create all Repository interfaces**
5. **Create all Service classes** with business logic
6. **Create all Controller classes** with endpoints
7. **Implement JWT Security** (JwtTokenProvider, JwtFilter, SecurityConfig)
8. **Implement Email Service** with templates
9. **Implement File Upload Service** with validation
10. **Implement Audit Logging** (AOP or manual)
11. **Write Unit Tests** for services
12. **Write Integration Tests** for controllers
13. **Configure application.properties** with your settings
14. **Test all endpoints** with Postman/Swagger

---

## 🎯 SUCCESS CRITERIA

Backend is complete when:
- ✅ All 10 tables created in PostgreSQL
- ✅ All entities mapped correctly
- ✅ All API endpoints working
- ✅ JWT authentication working
- ✅ Role-based authorization working
- ✅ Email service sending emails
- ✅ File upload working
- ✅ Notifications being created
- ✅ Audit logs being recorded
- ✅ Frontend can connect and login
- ✅ All tests passing (80%+ coverage)

---

**This specification is COMPLETE and PRODUCTION-READY. Give this file to Cursor AI to generate your Spring Boot backend!**

Good luck! 🚀
