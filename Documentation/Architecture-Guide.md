# DQIMS System Architecture Guide

## Overview
This guide explains the system architecture diagrams for the Data Quality Issues Management System (DQIMS). Four different architecture diagrams are provided, each serving a specific purpose.

---

## Architecture Diagrams Summary

### 1. Detailed System Architecture (`17-System-Architecture.puml`)
**Purpose:** Complete technical architecture showing all system components

**Best for:**
- Technical documentation
- Developer onboarding
- System design chapter in thesis
- Detailed technical specifications

**What it shows:**
- ✅ Three-tier architecture (Presentation, Application, Data)
- ✅ All frontend components (Pages, Components, Services, Libraries)
- ✅ All backend components (Security, Controllers, Services, Repositories)
- ✅ Database tables (all 10 tables)
- ✅ External systems (Email, File Storage)
- ✅ Communication protocols (HTTP/REST, JDBC, SMTP)
- ✅ Security flow (JWT authentication)
- ✅ Data flow example (Issue reporting)
- ✅ Technology stack details
- ✅ Deployment architecture

**Use in thesis:**
- Chapter 4: System Design - Section 4.1 (System Architecture)
- Shows complete technical implementation

---

### 2. Simplified System Architecture (`18-System-Architecture-Simple.puml`)
**Purpose:** Easy-to-understand overview for non-technical audiences

**Best for:**
- Executive summary
- Presentations
- Quick overview
- Non-technical stakeholders

**What it shows:**
- ✅ Three main layers (Frontend, Backend, Database)
- ✅ User roles (Admin, HOD, Staff)
- ✅ Core services
- ✅ External systems
- ✅ Communication flow
- ✅ Simple, clean design

**Use in thesis:**
- Chapter 1: Introduction - System Overview
- Chapter 3: System Analysis - High-level Architecture
- Easy for readers to understand

---

### 3. C4 Model Architecture (`19-System-Architecture-C4.puml`)
**Purpose:** Industry-standard C4 model architecture diagram

**Best for:**
- Professional documentation
- Industry-standard format
- Software architecture best practices
- Academic credibility

**What it shows:**
- ✅ System context
- ✅ Container diagram (C4 Level 2)
- ✅ Users (Admin, HOD, Staff)
- ✅ System containers (Web App, API, Database)
- ✅ External systems
- ✅ Relationships and protocols
- ✅ Standard C4 notation

**Use in thesis:**
- Chapter 4: System Design - Section 4.1
- Shows adherence to industry standards
- Demonstrates professional software architecture knowledge

**Note:** This diagram uses the C4 model, which is widely recognized in software architecture. It shows:
- **Person:** Users of the system
- **Container:** Separately deployable/executable units
- **System:** The DQIMS system boundary
- **External System:** Third-party systems

---

### 4. Deployment Architecture (`20-Deployment-Architecture.puml`)
**Purpose:** Shows physical/virtual infrastructure and deployment setup

**Best for:**
- Deployment planning
- Infrastructure documentation
- DevOps documentation
- System administration

**What it shows:**
- ✅ Client devices (Web browsers)
- ✅ Network layer (Internet/RRA Network)
- ✅ Web server (Nginx - optional)
- ✅ Application server (Spring Boot)
- ✅ Database server (MySQL)
- ✅ File storage server
- ✅ Email service (Gmail SMTP)
- ✅ Backup server
- ✅ Monitoring & logging
- ✅ Ports and protocols
- ✅ Server specifications
- ✅ Backup strategy

**Use in thesis:**
- Chapter 4: System Design - Section 4.5 (Deployment Architecture)
- Chapter 5: Implementation - Section 5.4 (Deployment)
- Shows how system is deployed in production

---

## Comparison Table

| Feature | Detailed (17) | Simplified (18) | C4 Model (19) | Deployment (20) |
|---------|--------------|-----------------|---------------|-----------------|
| **Complexity** | High | Low | Medium | High |
| **Technical Detail** | Very High | Low | Medium | Very High |
| **Best Audience** | Developers | Everyone | Architects | DevOps/Admins |
| **Components Shown** | All | Main only | Containers | Infrastructure |
| **Technology Stack** | ✅ Detailed | ✅ Basic | ✅ Basic | ✅ Detailed |
| **Communication** | ✅ All protocols | ✅ Basic | ✅ Basic | ✅ All protocols |
| **Infrastructure** | ❌ | ❌ | ❌ | ✅ Complete |
| **Industry Standard** | ❌ | ❌ | ✅ C4 Model | ✅ UML Deployment |

---

## How to Use in Your Thesis

### Chapter 3: System Analysis & Design

**Section 3.4: System Architecture Overview**
```
Use: 18-System-Architecture-Simple.puml
Why: Easy introduction to system architecture
```

### Chapter 4: System Design

**Section 4.1: System Architecture**
```
Use: 17-System-Architecture.puml OR 19-System-Architecture-C4.puml
Why: Detailed technical architecture
Recommendation: Use C4 model (19) for academic credibility
```

**Section 4.2: Three-Tier Architecture**
```
Use: 17-System-Architecture.puml
Why: Shows clear separation of layers
Extract: Presentation, Application, and Data layers
```

**Section 4.3: Component Architecture**
```
Use: 17-System-Architecture.puml
Why: Shows all components in each layer
```

**Section 4.4: Communication Architecture**
```
Use: 17-System-Architecture.puml
Why: Shows all protocols and data flow
```

**Section 4.5: Deployment Architecture**
```
Use: 20-Deployment-Architecture.puml
Why: Shows physical deployment setup
```

### Chapter 5: Implementation

**Section 5.1: Technology Stack**
```
Use: 17-System-Architecture.puml
Why: Lists all technologies used
```

**Section 5.4: System Deployment**
```
Use: 20-Deployment-Architecture.puml
Why: Shows how system is deployed
```

---

## Recommended Thesis Structure

```
Chapter 4: System Design
├── 4.1 System Architecture Overview
│   ├── Figure 4.1: Simplified System Architecture (Diagram 18)
│   └── Explanation of three-tier architecture
│
├── 4.2 Detailed System Architecture
│   ├── Figure 4.2: Complete System Architecture (Diagram 17 or 19)
│   ├── 4.2.1 Presentation Layer
│   ├── 4.2.2 Application Layer
│   └── 4.2.3 Data Layer
│
├── 4.3 Component Design
│   ├── Frontend Components (from Diagram 17)
│   ├── Backend Components (from Diagram 17)
│   └── Database Design (from Database-Schema.md)
│
├── 4.4 Communication Architecture
│   ├── REST API Communication
│   ├── Database Communication
│   └── External Service Integration
│
└── 4.5 Deployment Architecture
    ├── Figure 4.5: Deployment Diagram (Diagram 20)
    ├── Server Infrastructure
    ├── Network Configuration
    └── Backup Strategy
```

---

## Viewing the Diagrams

### Online Viewer (Easiest)
1. Go to http://www.plantuml.com/plantuml/uml/
2. Copy content from any `.puml` file
3. Paste and view

### VS Code (Recommended for editing)
1. Install "PlantUML" extension
2. Open `.puml` file
3. Press `Alt+D` to preview
4. Export as PNG/SVG for thesis

### Command Line
```bash
# Install PlantUML
sudo apt-get install plantuml

# Generate all architecture diagrams
plantuml Documentation/PlantUML/17-System-Architecture.puml
plantuml Documentation/PlantUML/18-System-Architecture-Simple.puml
plantuml Documentation/PlantUML/19-System-Architecture-C4.puml
plantuml Documentation/PlantUML/20-Deployment-Architecture.puml

# Generate all diagrams at once
plantuml Documentation/PlantUML/*.puml
```

---

## Architecture Highlights

### Three-Tier Architecture Benefits
1. **Separation of Concerns:** Each layer has specific responsibility
2. **Maintainability:** Changes in one layer don't affect others
3. **Scalability:** Each layer can be scaled independently
4. **Security:** Multiple security layers
5. **Testability:** Each layer can be tested separately

### Technology Choices

**Frontend: React + TypeScript**
- ✅ Component-based architecture
- ✅ Type safety with TypeScript
- ✅ Large ecosystem
- ✅ Excellent performance

**Backend: Spring Boot**
- ✅ Enterprise-grade framework
- ✅ Built-in security
- ✅ Easy REST API development
- ✅ Excellent documentation

**Database: MySQL**
- ✅ Reliable and mature
- ✅ ACID compliance
- ✅ Good performance
- ✅ Wide industry adoption

### Security Architecture

**Multiple Security Layers:**
1. **Frontend:** Input validation, XSS prevention
2. **Network:** HTTPS encryption, CORS
3. **Backend:** JWT authentication, role-based authorization
4. **Database:** Parameterized queries, access control
5. **Audit:** Complete activity logging

---

## Key Architectural Decisions

### 1. Why Three-Tier Architecture?
- **Separation of concerns:** UI, business logic, and data are separate
- **Scalability:** Each tier can scale independently
- **Maintainability:** Easier to update and maintain
- **Security:** Multiple security checkpoints

### 2. Why REST API?
- **Stateless:** Better scalability
- **Standard:** Industry-standard approach
- **Flexible:** Easy to consume from any client
- **Cacheable:** Improved performance

### 3. Why JWT Authentication?
- **Stateless:** No server-side session storage
- **Scalable:** Works across multiple servers
- **Secure:** Cryptographically signed
- **Standard:** Industry-standard approach

### 4. Why MySQL?
- **Relational:** Complex relationships between entities
- **ACID:** Data integrity guaranteed
- **Mature:** Proven in production
- **Performance:** Good for read-heavy workloads

---

## Architecture Patterns Used

### 1. MVC Pattern (Backend)
- **Model:** Entity classes (User, Issue, etc.)
- **View:** JSON responses
- **Controller:** REST controllers

### 2. Repository Pattern
- **Abstraction:** Data access abstraction
- **Testability:** Easy to mock for testing
- **Flexibility:** Easy to change data source

### 3. Service Layer Pattern
- **Business Logic:** Centralized business rules
- **Reusability:** Services can be reused
- **Transaction Management:** Consistent transactions

### 4. DTO Pattern
- **Data Transfer:** Clean API contracts
- **Security:** Don't expose entities directly
- **Flexibility:** Different views of same data

---

## Performance Considerations

### Frontend Optimization
- Code splitting
- Lazy loading
- Caching strategies
- Minification and compression

### Backend Optimization
- Database connection pooling (HikariCP)
- Query optimization
- Caching (if needed)
- Async processing for emails

### Database Optimization
- Proper indexing
- Query optimization
- Connection pooling
- Regular maintenance

---

## Scalability Strategy

### Horizontal Scaling
- Multiple application servers behind load balancer
- Stateless architecture (JWT) enables this
- Database replication (master-slave)

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries
- Add caching layer

### Future Enhancements
- Redis for caching
- Message queue for async processing
- Microservices architecture (if needed)
- CDN for static assets

---

## Conclusion

The DQIMS architecture is designed with:
- ✅ **Scalability** in mind
- ✅ **Security** as a priority
- ✅ **Maintainability** for long-term support
- ✅ **Performance** for good user experience
- ✅ **Industry standards** for credibility

Choose the appropriate diagram based on your audience and purpose. For academic writing, use the C4 model (Diagram 19) for credibility and the detailed architecture (Diagram 17) for completeness.

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Author:** DQIMS Development Team  
**Organization:** Rwanda Revenue Authority (RRA)
