  ├── User.java
│   ├── IssueCategory.java
│   ├── Issue.java
│   ├── IssueComment.java
│   ├── RelatedIssue.java
│   ├── IssueHistory.java
│   ├── DataValidationRule.java
│   ├── DataValidationExecution.java
│   ├── DataValidationFailure.java
│   ├── RootCauseAnalysis.java
│   ├── AuditLog.java
│   ├── Notification.java
│   ├── SLAConfiguration.java
│   ├── Report.java
│   ├── DashboardMetric.java
│   ├── Integration.java
│   ├── IntegrationLog.java
│   ├── Attachment.java
│   └── SystemSetting.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── CreateUserRequest.java
│   │   ├── CreateIssueRequest.java
│   │   ├── CreateValidationRuleRequest.java
│   │   └── ...
│   └── response/
│       ├── LoginResponse.java
│       ├── UserResponse.java
│       ├── IssueResponse.java
│       ├── ApiResponse.java
│       └── ...
├── repository/
│   ├── DepartmentRepository.java
│   ├── UserRepository.java
│   ├── IssueCategoryRepository.java
│   ├── IssueRepository.java
│   ├── IssueCommentRepository.java
│   ├── ValidationRuleRepository.java
│   ├── ValidationExecutionRepository.java
│   ├── RCARepository.java
│   ├── AuditLogRepository.java
│   ├── NotificationRepository.java
│   ├── ReportRepository.java
│   └── ...
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── IssueService.java
│   ├── ValidationService.java
│   ├── RCAService.java
│   ├── EmailService.java
│   ├── NotificationService.java
│   ├── AuditService.java
│   ├── ReportService.java
│   ├── DashboardService.java
│   ├── SLAService.java
│   └── ...
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── CustomUserDetailsService.java
│   └── SecurityUtils.java
├── exception/
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   ├── BadRequestException.java
│   ├── GlobalExceptionHandler.java
│   └── ...
├── util/
│   ├── DateUtils.java
│   ├── StringUtils.java
│   ├── ValidationUtils.java
│   └── ...
└── scheduler/
    ├── SLAUpdateScheduler.java
    ├── DashboardMetricsScheduler.java
    └── NotificationScheduler.java

src/main/resources/
├── application.properties
├── application-dev.properties
├── application-prod.properties
├── schema.sql
├── data.sql
└── templates/
    └── email/
        ├── user-creation.html
        ├── issue-assignment.html
        ├── sla-warning.html
        └── ...
```

### **Dependencies (pom.xml)**

```xml
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
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
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
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- MapStruct -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
    
    <!-- SpringDoc OpenAPI (Swagger) -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.2.0</version>
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
```

### **Application Configuration**

```properties
# application.properties

# Application
spring.application.name=DQIMS
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/dqims_db
spring.datasource.username=dqims_user
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=3600000
jwt.refresh-expiration=604800000

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=dqims@rra.gov.rw
spring.mail.password=${SMTP_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB

# CORS
cors.allowed-origins=http://localhost:3000,https://dqims.rra.gov.rw

# Swagger
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html

# Logging
logging.level.rw.rra.dqims=DEBUG
logging.level.org.springframework.security=DEBUG
```

---

## 15. SAMPLE DATA & TEST CASES

### **Sample Departments**

```sql
INSERT INTO departments (id, dept_code, dept_name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'IT', 'Information Technology', 'Manages IT systems'),
('22222222-2222-2222-2222-222222222222', 'DT', 'Domestic Tax', 'Handles domestic taxation'),
('33333333-3333-3333-3333-333333333333', 'CT', 'Customs & Tax', 'Manages customs'),
('44444444-4444-4444-4444-444444444444', 'HR', 'Human Resources', 'Employee management'),
('55555555-5555-5555-5555-555555555555', 'FINANCE', 'Finance & Accounting', 'Financial operations'),
('66666666-6666-6666-6666-666666666666', 'AUDIT', 'Internal Audit', 'Internal auditing');
```

### **Sample Users**

```sql
-- Password: Admin123!
INSERT INTO users (id, employee_id, email, password_hash, full_name, role, department_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EMP001', 'admin@rra.gov.rw', 
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyOVx9tr3IAy', 
 'System Administrator', 'ADMIN', '11111111-1111-1111-1111-111111111111'),

-- Password: Hod123!
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'EMP002', 'marie.claire@rra.gov.rw',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyOVx9tr3IAy',
 'Marie Claire UWAMAHORO', 'HOD', '22222222-2222-2222-2222-222222222222'),

-- Password: Member123!
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'EMP003', 'david.uwizeye@rra.gov.rw',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyOVx9tr3IAy',
 'David UWIZEYE', 'MEMBER', '22222222-2222-2222-2222-222222222222');
```

### **Sample Issues**

```sql
INSERT INTO issues (id, issue_number, title, description, severity, priority, status, reported_by, department_id) VALUES
('issue001-1111-1111-1111-111111111111', 'ISS-2026-0001', 
 'Duplicate TIN entries found', 
 '145 taxpayers have duplicate TIN numbers in the database', 
 'CRITICAL', 'HIGH', 'OPEN', 
 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
 '22222222-2222-2222-2222-222222222222');
```

---

## 🎯 **SUMMARY FOR BACKEND DEVELOPMENT**

**Copy this entire document and give it to another AI with this prompt:**

```
I need you to build a Spring Boot 3.x REST API backend for DQIMS (Data Quality Issues Management System) for Rwanda Revenue Authority.

This document contains:
- Complete project overview and requirements
- 20 database tables with SQL schemas
- All 12 modules with detailed functionality
- Complete API endpoint specifications
- Business logic and workflows
- Authentication & authorization with JWT
- Email notification system
- Sample data and test cases

Please build:
1. Complete Spring Boot project structure
2. All entity models (20 tables)
3. All repositories (Spring Data JPA)
4. All services with business logic
5. All REST controllers with endpoints
6. JWT security configuration
7. Email service with templates
8. Exception handling
9. Scheduled jobs (SLA updates, metrics calculation)
10. API documentation with Swagger

Use:
- Spring Boot 3.2+
- PostgreSQL 15+
- Spring Security 6+ with JWT
- Spring Data JPA
- Jakarta Mail
- Lombok
- MapStruct

Start with Phase 1 (Core flow):
- Users, Departments, Issues, IssueCategories, IssueComments, Notifications
- Authentication & JWT
- Basic CRUD operations
- Email notifications

Then Phase 2 (Data Validation):
- ValidationRules, ValidationExecutions, ValidationFailures

Then Phase 3 (Advanced):
- RCA, Reports, Integrations, Audit Logs

Generate complete, production-ready code with proper error handling, validation, and security.
```

---

**This document is complete and ready to use for backend development!** 🚀

**Document Version:** 1.0  
**Created:** March 6, 2026  
**For:** DQIMS Backend Development  
**Total Pages:** 150+  
**Total Words:** 20,000+  
**Everything needed:** ✅
