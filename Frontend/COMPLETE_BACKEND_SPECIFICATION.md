# DQIMS - Complete Backend Specification for Cursor AI
# Spring Boot Implementation Guide

**Project:** Data Quality Issues Management System (DQIMS)  
**Client:** Rwanda Revenue Authority (RRA)  
**Technology Stack:** Spring Boot 3.x + PostgreSQL 14+ + JWT Authentication  
**Frontend:** React + TypeScript (Already Complete)

---

## 📋 TABLE OF CONTENTS

1. [Project Structure](#project-structure)
2. [Database Schema (SQL Scripts)](#database-schema)
3. [Entity Classes](#entity-classes)
4. [Repository Layer](#repository-layer)
5. [Service Layer](#service-layer)
6. [Controller Layer](#controller-layer)
7. [Security Configuration](#security-configuration)
8. [Email Service](#email-service)
9. [File Upload Service](#file-upload-service)
10. [Configuration Files](#configuration-files)
11. [Testing](#testing)

---

## 1. PROJECT STRUCTURE

```
dqims-backend/
├── src/main/java/rw/rra/dqims/
│   ├── DqimsApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtConfig.java
│   │   ├── CorsConfig.java
│   │   └── EmailConfig.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Department.java
│   │   ├── Issue.java
│   │   ├── IssueAttachment.java
│   │   ├── IssueComment.java
│   │   ├── Notification.java
│   │   ├── AuditLog.java
│   │   ├── ValidationSession.java
│   │   ├── ValidationError.java
│   │   └── PasswordHistory.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── DepartmentRepository.java
│   │   ├── IssueRepository.java
│   │   ├── IssueAttachmentRepository.java
│   │   ├── IssueCommentRepository.java
│   │   ├── NotificationRepository.java
│   │   ├── AuditLogRepository.java
│   │   ├── ValidationSessionRepository.java
│   │   └── ValidationErrorRepository.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── DepartmentService.java
│   │   ├── IssueService.java
│   │   ├── NotificationService.java
│   │   ├── EmailService.java
│   │   ├── FileStorageService.java
│   │   ├── AuditService.java
│   │   └── ValidationService.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── DepartmentController.java
│   │   ├── IssueController.java
│   │   ├── NotificationController.java
│   │   ├── AuditController.java
│   │   ├── ValidationController.java
│   │   └── ReportController.java
│   ├── dto/
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── ChangePasswordRequest.java
│   │   │   ├── CreateUserRequest.java
│   │   │   ├── CreateIssueRequest.java
│   │   │   └── UpdateIssueRequest.java
│   │   └── response/
│   │       ├── LoginResponse.java
│   │       ├── UserResponse.java
│   │       ├── IssueResponse.java
│   │       ├── DashboardStatsResponse.java
│   │       └── ApiResponse.java
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── UserDetailsServiceImpl.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── BadRequestException.java
│   │   └── UnauthorizedException.java
│   └── util/
│       ├── PasswordGenerator.java
│       └── FileValidator.java
├── src/main/resources/
│   ├── application.properties
│   ├── application-dev.properties
│   ├── application-prod.properties
│   └── templates/
│       ├── email/
│       │   ├── user-creation.html
│       │   ├── password-reset.html
│       │   └── issue-assigned.html
│       └── reports/
│           └── issue-report-template.html
└── pom.xml
```

---

## 2. DATABASE SCHEMA

### Create Database

```sql
CREATE DATABASE dqims_db;
\c dqims_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Table 1: users

```sql
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Insert default admin user (password: Admin@123)
INSERT INTO users (employee_id, name, email, phone, password_hash, role, department, is_first_login)
VALUES ('EMP001', 'System Admin', 'admin@rra.gov.rw', '+250788000001', 
        '$2a$10$5M3Y9pV4M.8H7gVwqVJdKOkD7HvBHZ2qM3gCFW5HhL9YqX5ZKvMlO', 
        'ADMIN', 'IT', FALSE);
```

### Table 2: departments

```sql
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_departments_name ON departments(name);
CREATE INDEX idx_departments_is_active ON departments(is_active);

-- Insert default departments
INSERT INTO departments (name, description, created_by) VALUES
('VAT', 'Value Added Tax Department', 1),
('CUSTOMS', 'Customs Department', 1),
('DOMESTIC TAX', 'Domestic Tax Department', 1),
('IT', 'Information Technology Department', 1),
('TAX INVESTIGATIONS', 'Tax Investigations Department', 1),
('HR', 'Human Resources Department', 1),
('FINANCE', 'Finance Department', 1);
```

### Table 3: issues

```sql
CREATE TABLE issues (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    source VARCHAR(50) NOT NULL CHECK (source IN ('VAT', 'CUSTOMS', 'TAXPAYER_SYSTEM', 'OTHER')),
    data_element VARCHAR(100) NOT NULL,
    issue_type VARCHAR(50) NOT NULL CHECK (issue_type IN ('DUPLICATE', 'MISSING', 'INCORRECT', 'INCONSISTENT')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    department VARCHAR(50) NOT NULL,
    reported_by BIGINT NOT NULL,
    assigned_to BIGINT,
    is_delegated BOOLEAN DEFAULT FALSE,
    delegated_from VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    closed_by BIGINT,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (closed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_priority ON issues(priority);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_department ON issues(department);
CREATE INDEX idx_issues_reported_by ON issues(reported_by);
CREATE INDEX idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_issues_updated_at ON issues(updated_at DESC);
```

### Table 4: issue_attachments

```sql
CREATE TABLE issue_attachments (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    uploaded_by BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_attachments_issue_id ON issue_attachments(issue_id);
CREATE INDEX idx_attachments_uploaded_by ON issue_attachments(uploaded_by);
```

### Table 5: issue_comments

```sql
CREATE TABLE issue_comments (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_issue_id ON issue_comments(issue_id);
CREATE INDEX idx_comments_user_id ON issue_comments(user_id);
CREATE INDEX idx_comments_created_at ON issue_comments(created_at DESC);
```

### Table 6: notifications

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ISSUE_ASSIGNED', 'STATUS_UPDATED', 'PRIORITY_CHANGED', 'COMMENT_ADDED', 'ISSUE_CLOSED')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    issue_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

### Table 7: audit_logs

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
```

### Table 8: validation_sessions

```sql
CREATE TABLE validation_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    total_records INTEGER NOT NULL,
    passed_records INTEGER NOT NULL,
    failed_records INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_validation_user_id ON validation_sessions(user_id);
CREATE INDEX idx_validation_created_at ON validation_sessions(created_at DESC);
```

### Table 9: validation_errors

```sql
CREATE TABLE validation_errors (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL,
    row_number INTEGER NOT NULL,
    error_type VARCHAR(50) NOT NULL CHECK (error_type IN ('ACCURACY', 'COMPLETENESS', 'UNIQUENESS', 'FORMAT')),
    field_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES validation_sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_validation_errors_session_id ON validation_errors(session_id);
CREATE INDEX idx_validation_errors_error_type ON validation_errors(error_type);
```

### Table 10: password_history

```sql
CREATE TABLE password_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_password_history_user_id ON password_history(user_id);
CREATE INDEX idx_password_history_created_at ON password_history(created_at DESC);
```

---

## 3. MAVEN DEPENDENCIES (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/>
    </parent>
    
    <groupId>rw.rra</groupId>
    <artifactId>dqims</artifactId>
    <version>1.0.0</version>
    <name>DQIMS</name>
    <description>Data Quality Issues Management System for RRA</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
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
        
        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Apache POI for Excel/CSV -->
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>5.2.5</version>
        </dependency>
        
        <!-- PDF Generation -->
        <dependency>
            <groupId>com.itextpdf</groupId>
            <artifactId>itext7-core</artifactId>
            <version>7.2.5</version>
            <type>pom</type>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

This file is getting very long. I'll create separate comprehensive files for:
1. Complete backend implementation
2. Database diagrams
3. Project documentation for your book

Let me create these essential files next.
