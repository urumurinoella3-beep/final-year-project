package rw.rra.dqims.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import rw.rra.dqims.entity.AuditLog;
import rw.rra.dqims.entity.Department;
import rw.rra.dqims.entity.Issue;
import rw.rra.dqims.entity.PasswordHistory;
import rw.rra.dqims.entity.User;
import rw.rra.dqims.entity.enums.IssueStatus;
import rw.rra.dqims.entity.enums.UserRole;
import rw.rra.dqims.repository.AuditLogRepository;
import rw.rra.dqims.repository.DepartmentRepository;
import rw.rra.dqims.repository.IssueRepository;
import rw.rra.dqims.repository.PasswordHistoryRepository;
import rw.rra.dqims.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds comprehensive demo data on application startup.
 * Creates departments, users (Admin, HODs, Staff), sample issues, audit logs, and password history.
 * All users have password: "password"
 * Idempotent – skips data that already exists.
 */
@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String DEMO_PASSWORD = "password";

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final IssueRepository issueRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordHistoryRepository passwordHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, 
                     DepartmentRepository departmentRepository,
                     IssueRepository issueRepository,
                     AuditLogRepository auditLogRepository,
                     PasswordHistoryRepository passwordHistoryRepository,
                     PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.issueRepository = issueRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordHistoryRepository = passwordHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        log.info("Starting comprehensive data seeding...");
        
        String encodedPassword = passwordEncoder.encode(DEMO_PASSWORD);

        // Step 1: Seed Departments
        seedDepartments();

        // Step 2: Seed Users (Admin, HODs, Staff)
        seedUsers(encodedPassword);

        // Step 3: Seed Sample Issues
        seedIssues();

        // Step 4: Seed Audit Logs
        seedAuditLogs();

        // Step 5: Seed Password History
        seedPasswordHistory(encodedPassword);

        log.info("✅ Demo data seeding complete. All users have password: 'password'");
    }

    private void seedDepartments() {
        log.info("Seeding departments...");
        
        seedDepartment("Finance", "Financial operations, accounting, and revenue management");
        seedDepartment("IT", "Information Technology, systems development and maintenance");
        seedDepartment("HR", "Human Resources, recruitment, and employee management");
        seedDepartment("Operations", "Operational activities and process management");
        seedDepartment("Customs", "Customs operations and border control");
        seedDepartment("VAT", "Value Added Tax administration and compliance");
        seedDepartment("Compliance", "Regulatory compliance, auditing, and risk management");
        seedDepartment("Data Management", "Data quality, governance, and analytics");
        
        log.info("✅ Departments seeded successfully");
    }

    private void seedDepartment(String name, String description) {
        if (departmentRepository.findByNameIgnoreCase(name).isPresent()) {
            log.info("Department already exists: {}", name);
            return;
        }
        
        Department dept = Department.builder()
                .name(name)
                .description(description)
                .isActive(true)
                .build();
        departmentRepository.save(dept);
        log.info("Created department: {}", name);
    }

    private void seedUsers(String encodedPassword) {
        log.info("Seeding users...");
        
        // ========== ADMIN USER ==========
        seedUser("EMP001", "System Administrator", "admin@rra.gov.rw", "+250788000001",
                encodedPassword, UserRole.ADMIN, "IT");

        // ========== HODs (Heads of Department) ==========
        seedUser("EMP101", "Jean Claude Mugisha", "jean.mugisha@rra.gov.rw", "+250788100101",
                encodedPassword, UserRole.HOD, "Finance");
        
        // IT: single HOD (Bernard); STAFF below (Kevin, Linda, Frank)
        seedUser("EMP102", "Bernard Ngabo", "bernard.ngabo@rra.gov.rw", "+250788100102",
                encodedPassword, UserRole.HOD, "IT");
        
        seedUser("EMP103", "Patrick Nkurunziza", "patrick.nkurunziza@rra.gov.rw", "+250788100103",
                encodedPassword, UserRole.HOD, "HR");
        
        seedUser("EMP104", "Grace Mukamana", "grace.mukamana@rra.gov.rw", "+250788100104",
                encodedPassword, UserRole.HOD, "Operations");
        
        seedUser("EMP105", "David Habimana", "david.habimana@rra.gov.rw", "+250788100105",
                encodedPassword, UserRole.HOD, "Customs");
        
        seedUser("EMP106", "Alice Uwera", "alice.uwera@rra.gov.rw", "+250788100106",
                encodedPassword, UserRole.HOD, "VAT");
        
        seedUser("EMP107", "Emmanuel Bizimana", "emmanuel.bizimana@rra.gov.rw", "+250788100107",
                encodedPassword, UserRole.HOD, "Compliance");
        
        seedUser("EMP108", "Diane Umutoni", "diane.umutoni@rra.gov.rw", "+250788100108",
                encodedPassword, UserRole.HOD, "Data Management");

        // ========== STAFF - Finance Department ==========
        seedUser("EMP201", "John Kamanzi", "john.kamanzi@rra.gov.rw", "+250788200201",
                encodedPassword, UserRole.STAFF, "Finance");
        
        seedUser("EMP202", "Sarah Ingabire", "sarah.ingabire@rra.gov.rw", "+250788200202",
                encodedPassword, UserRole.STAFF, "Finance");
        
        seedUser("EMP203", "Eric Ndayisaba", "eric.ndayisaba@rra.gov.rw", "+250788200203",
                encodedPassword, UserRole.STAFF, "Finance");

        // ========== STAFF - IT Department ==========
        seedUser("EMP204", "Kevin Mutabazi", "kevin.mutabazi@rra.gov.rw", "+250788200204",
                encodedPassword, UserRole.STAFF, "IT");
        
        seedUser("EMP205", "Linda Uwimana", "linda.uwimana@rra.gov.rw", "+250788200205",
                encodedPassword, UserRole.STAFF, "IT");
        
        seedUser("EMP206", "Frank Nshuti", "frank.nshuti@rra.gov.rw", "+250788200206",
                encodedPassword, UserRole.STAFF, "IT");

        // ========== STAFF - HR Department ==========
        seedUser("EMP207", "Betty Mukandori", "betty.mukandori@rra.gov.rw", "+250788200207",
                encodedPassword, UserRole.STAFF, "HR");
        
        seedUser("EMP208", "James Niyonzima", "james.niyonzima@rra.gov.rw", "+250788200208",
                encodedPassword, UserRole.STAFF, "HR");

        // ========== STAFF - Operations Department ==========
        seedUser("EMP209", "Rose Nyiramana", "rose.nyiramana@rra.gov.rw", "+250788200209",
                encodedPassword, UserRole.STAFF, "Operations");
        
        seedUser("EMP210", "Peter Mugabo", "peter.mugabo@rra.gov.rw", "+250788200210",
                encodedPassword, UserRole.STAFF, "Operations");
        
        seedUser("EMP211", "Claire Mukeshimana", "claire.mukeshimana@rra.gov.rw", "+250788200211",
                encodedPassword, UserRole.STAFF, "Operations");

        // ========== STAFF - Customs Department ==========
        seedUser("EMP212", "Joseph Uwizeyimana", "joseph.uwizeyimana@rra.gov.rw", "+250788200212",
                encodedPassword, UserRole.STAFF, "Customs");
        
        seedUser("EMP213", "Agnes Mukamazimpaka", "agnes.mukamazimpaka@rra.gov.rw", "+250788200213",
                encodedPassword, UserRole.STAFF, "Customs");
        
        seedUser("EMP214", "Robert Nsengimana", "robert.nsengimana@rra.gov.rw", "+250788200214",
                encodedPassword, UserRole.STAFF, "Customs");

        // ========== STAFF - VAT Department ==========
        seedUser("EMP215", "Christine Uwamahoro", "christine.uwamahoro@rra.gov.rw", "+250788200215",
                encodedPassword, UserRole.STAFF, "VAT");
        
        seedUser("EMP216", "Daniel Hakizimana", "daniel.hakizimana@rra.gov.rw", "+250788200216",
                encodedPassword, UserRole.STAFF, "VAT");
        
        seedUser("EMP217", "Florence Mukamugema", "florence.mukamugema@rra.gov.rw", "+250788200217",
                encodedPassword, UserRole.STAFF, "VAT");

        // ========== STAFF - Compliance Department ==========
        seedUser("EMP218", "Samuel Mugisha", "samuel.mugisha@rra.gov.rw", "+250788200218",
                encodedPassword, UserRole.STAFF, "Compliance");
        
        seedUser("EMP219", "Jacqueline Uwase", "jacqueline.uwase@rra.gov.rw", "+250788200219",
                encodedPassword, UserRole.STAFF, "Compliance");

        // ========== STAFF - Data Management Department ==========
        seedUser("EMP220", "Michael Nkubito", "michael.nkubito@rra.gov.rw", "+250788200220",
                encodedPassword, UserRole.STAFF, "Data Management");
        
        seedUser("EMP221", "Esther Mukandayisenga", "esther.mukandayisenga@rra.gov.rw", "+250788200221",
                encodedPassword, UserRole.STAFF, "Data Management");
        
        seedUser("EMP222", "Vincent Habiyambere", "vincent.habiyambere@rra.gov.rw", "+250788200222",
                encodedPassword, UserRole.STAFF, "Data Management");

        log.info("✅ Users seeded successfully (1 Admin + 8 HODs + 22 Staff = 31 users)");
    }

    private void seedUser(String employeeId, String name, String email, String phone,
            String passwordHash, UserRole role, String department) {
        if (userRepository.findByEmail(email).isPresent()) {
            User existing = userRepository.findByEmail(email).get();
            existing.setPasswordHash(passwordHash);
            userRepository.save(existing);
            log.info("Updated password for existing user: {}", email);
            return;
        }
        User user = User.builder()
                .employeeId(employeeId)
                .name(name)
                .email(email)
                .phone(phone)
                .passwordHash(passwordHash)
                .role(role)
                .department(department)
                .isActive(true)
                .isFirstLogin(false)
                .build();
        userRepository.save(user);
        log.info("Created user: {} ({} - {})", name, role, department);
    }

    private void seedIssues() {
        log.info("Seeding realistic RRA issues...");
        
        // First, delete all existing issues to start fresh
        // We need to handle foreign key constraints properly
        try {
            // Delete in correct order to avoid foreign key violations
            log.info("Cleaning up existing data...");
            auditLogRepository.deleteAll(); // Delete audit logs first
            issueRepository.deleteAll(); // Then delete issues
            log.info("Deleted all existing issues and related data");
        } catch (Exception e) {
            log.warn("Could not delete existing issues: {}", e.getMessage());
            // Continue anyway - issues might not exist yet
        }
        
        // Get users for issue assignment
        User financeStaff1 = userRepository.findByEmail("john.kamanzi@rra.gov.rw").orElse(null);
        User financeStaff2 = userRepository.findByEmail("sarah.ingabire@rra.gov.rw").orElse(null);
        User financeStaff3 = userRepository.findByEmail("eric.ndayisaba@rra.gov.rw").orElse(null);
        
        User itStaff1 = userRepository.findByEmail("kevin.mutabazi@rra.gov.rw").orElse(null);
        User itStaff2 = userRepository.findByEmail("linda.uwimana@rra.gov.rw").orElse(null);
        User itStaff3 = userRepository.findByEmail("frank.nshuti@rra.gov.rw").orElse(null);
        
        User hrStaff1 = userRepository.findByEmail("betty.mukandori@rra.gov.rw").orElse(null);
        User hrStaff2 = userRepository.findByEmail("james.niyonzima@rra.gov.rw").orElse(null);
        
        User opsStaff1 = userRepository.findByEmail("rose.nyiramana@rra.gov.rw").orElse(null);
        User opsStaff2 = userRepository.findByEmail("peter.mugabo@rra.gov.rw").orElse(null);
        User opsStaff3 = userRepository.findByEmail("claire.mukeshimana@rra.gov.rw").orElse(null);
        
        User customsStaff1 = userRepository.findByEmail("joseph.uwizeyimana@rra.gov.rw").orElse(null);
        User customsStaff2 = userRepository.findByEmail("agnes.mukamazimpaka@rra.gov.rw").orElse(null);
        User customsStaff3 = userRepository.findByEmail("robert.nsengimana@rra.gov.rw").orElse(null);
        
        User vatStaff1 = userRepository.findByEmail("christine.uwamahoro@rra.gov.rw").orElse(null);
        User vatStaff2 = userRepository.findByEmail("daniel.hakizimana@rra.gov.rw").orElse(null);
        User vatStaff3 = userRepository.findByEmail("florence.mukamugema@rra.gov.rw").orElse(null);
        
        User complianceStaff1 = userRepository.findByEmail("samuel.mugisha@rra.gov.rw").orElse(null);
        User complianceStaff2 = userRepository.findByEmail("jacqueline.uwase@rra.gov.rw").orElse(null);
        
        User dataStaff1 = userRepository.findByEmail("michael.nkubito@rra.gov.rw").orElse(null);
        User dataStaff2 = userRepository.findByEmail("esther.mukandayisenga@rra.gov.rw").orElse(null);
        User dataStaff3 = userRepository.findByEmail("vincent.habiyambere@rra.gov.rw").orElse(null);

        // Get HODs for closing issues
        User financeHOD = userRepository.findByEmail("jean.mugisha@rra.gov.rw").orElse(null);
        User itHOD = userRepository.findByEmail("bernard.ngabo@rra.gov.rw").orElse(null);
        User hrHOD = userRepository.findByEmail("patrick.nkurunziza@rra.gov.rw").orElse(null);
        User opsHOD = userRepository.findByEmail("grace.mukamana@rra.gov.rw").orElse(null);
        User customsHOD = userRepository.findByEmail("david.habimana@rra.gov.rw").orElse(null);
        User vatHOD = userRepository.findByEmail("alice.uwera@rra.gov.rw").orElse(null);
        User complianceHOD = userRepository.findByEmail("emmanuel.bizimana@rra.gov.rw").orElse(null);
        User dataHOD = userRepository.findByEmail("diane.umutoni@rra.gov.rw").orElse(null);

        // ========== FINANCE DEPARTMENT ISSUES (5) ==========
        seedIssue("Incorrect Tax Calculation for Import Duties", 
                "Tax calculation system applying wrong duty rates for goods from EAC countries. Should be 0% but system charging 25%.",
                "Tax Calculation System", "Duty Rate", "Calculation Error", "Critical", "High",
                IssueStatus.OPEN, "Finance", financeStaff1, financeStaff1, null);

        seedIssue("Missing TIN in Corporate Tax Returns", 
                "Over 200 corporate tax returns submitted without valid TIN numbers, blocking revenue processing.",
                "Tax Returns Database", "TIN", "Missing Data", "High", "High",
                IssueStatus.IN_PROGRESS, "Finance", financeStaff2, financeStaff2, null);

        seedIssue("Duplicate Payment Records in Revenue System", 
                "Same taxpayer payments recorded multiple times causing inflated revenue figures in monthly reports.",
                "Revenue Management System", "Payment ID", "Duplication", "High", "Medium",
                IssueStatus.IN_PROGRESS, "Finance", financeStaff3, financeStaff3, null);

        seedIssue("Exchange Rate Not Updated for USD Transactions", 
                "Foreign currency exchange rates for USD not updated since last week, affecting customs duty calculations.",
                "Currency Exchange Module", "Exchange Rate", "Outdated Data", "Medium", "Medium",
                IssueStatus.RESOLVED, "Finance", financeStaff1, financeStaff1, LocalDateTime.now().minusDays(2));

        seedClosedIssue("Negative Balance in Taxpayer Accounts", 
                "Several taxpayer accounts showing negative balances due to refund processing errors.",
                "Taxpayer Account System", "Account Balance", "Data Integrity", "High", "High",
                "Finance", financeStaff2, financeStaff2, financeHOD,
                LocalDateTime.now().minusDays(8), LocalDateTime.now().minusDays(3));

        // ========== IT DEPARTMENT ISSUES (5) ==========
        seedIssue("Database Connection Timeout During Peak Hours", 
                "Main tax database experiencing connection timeouts between 9-11 AM affecting all users.",
                "Database Server", "Connection Pool", "Performance Issue", "Critical", "Critical",
                IssueStatus.OPEN, "IT", itStaff1, itStaff1, null);

        seedIssue("User Authentication Failures in Mobile App", 
                "Taxpayers unable to login to RRA mobile app, getting 'Invalid credentials' error even with correct password.",
                "Mobile Application", "Authentication", "System Error", "High", "High",
                IssueStatus.OPEN, "IT", itStaff2, null, null);

        seedIssue("Backup System Not Running for 3 Days", 
                "Automated database backup jobs failing silently, no backups created since Monday.",
                "Backup System", "Backup Job", "System Configuration", "Critical", "Critical",
                IssueStatus.IN_PROGRESS, "IT", itStaff3, itStaff3, null);

        seedIssue("SSL Certificate Expiring in 7 Days", 
                "SSL certificate for rra.gov.rw portal expiring next week, need urgent renewal to avoid service disruption.",
                "Web Portal", "SSL Certificate", "Configuration Issue", "High", "High",
                IssueStatus.RESOLVED, "IT", itStaff1, itStaff1, LocalDateTime.now().minusDays(1));

        seedClosedIssue("Email Server Disk Space Full", 
                "Email server storage at 100% capacity, emails not being delivered to staff.",
                "Email Server", "Disk Space", "System Resource", "Critical", "Critical",
                "IT", itStaff2, itStaff2, itHOD,
                LocalDateTime.now().minusDays(5), LocalDateTime.now().minusDays(4));

        // ========== HR DEPARTMENT ISSUES (5) ==========
        seedIssue("Employee Records Missing National ID Numbers", 
                "45 employee records in HRIS system missing national ID numbers required for RSSB reporting.",
                "HRIS System", "National ID", "Missing Data", "Medium", "Medium",
                IssueStatus.OPEN, "HR", hrStaff1, hrStaff1, null);

        seedIssue("Payroll System Calculating Wrong Tax Deductions", 
                "PAYE tax deductions incorrect for employees earning above 100,000 RWF per month.",
                "Payroll System", "Tax Deduction", "Calculation Error", "High", "High",
                IssueStatus.IN_PROGRESS, "HR", hrStaff2, hrStaff2, null);

        seedIssue("Leave Balance Not Updating After Approval", 
                "Approved leave requests not deducting from employee leave balances in the system.",
                "Leave Management System", "Leave Balance", "System Logic Error", "Medium", "Low",
                IssueStatus.IN_PROGRESS, "HR", hrStaff1, hrStaff1, null);

        seedIssue("Duplicate Employee Records in Database", 
                "Same employees appearing twice with different employee IDs causing payroll confusion.",
                "HRIS Database", "Employee ID", "Duplication", "High", "Medium",
                IssueStatus.RESOLVED, "HR", hrStaff2, hrStaff2, LocalDateTime.now().minusDays(3));

        seedClosedIssue("Performance Appraisal Forms Not Accessible", 
                "Staff unable to access annual performance appraisal forms due to broken link in portal.",
                "HR Portal", "Form Access", "System Error", "Medium", "Medium",
                "HR", hrStaff1, hrStaff1, hrHOD,
                LocalDateTime.now().minusDays(10), LocalDateTime.now().minusDays(6));

        // ========== OPERATIONS DEPARTMENT ISSUES (5) ==========
        seedIssue("Taxpayer Service Queue System Malfunction", 
                "Queue management system at Kimihurura office not issuing tickets, causing service delays.",
                "Queue Management System", "Ticket Generation", "Hardware Issue", "High", "High",
                IssueStatus.OPEN, "Operations", opsStaff1, opsStaff1, null);

        seedIssue("Document Scanning Quality Poor", 
                "Scanned tax documents illegible due to scanner resolution settings, need reconfiguration.",
                "Document Management System", "Scan Quality", "Configuration Issue", "Medium", "Low",
                IssueStatus.OPEN, "Operations", opsStaff2, null, null);

        seedIssue("Printer Not Working at Nyarugenge Branch", 
                "Main receipt printer offline for 2 days, staff manually writing receipts.",
                "Branch Equipment", "Printer", "Hardware Failure", "Medium", "Medium",
                IssueStatus.IN_PROGRESS, "Operations", opsStaff3, opsStaff3, null);

        seedIssue("Taxpayer Complaint System Not Recording Submissions", 
                "Online complaint form submissions not being saved to database, complaints lost.",
                "Complaint Management System", "Form Submission", "System Error", "High", "High",
                IssueStatus.RESOLVED, "Operations", opsStaff1, opsStaff1, LocalDateTime.now().minusDays(2));

        seedClosedIssue("Office Access Cards Not Working", 
                "Staff access cards deactivated after system upgrade, employees locked out of offices.",
                "Access Control System", "Card Reader", "System Configuration", "High", "High",
                "Operations", opsStaff2, opsStaff2, opsHOD,
                LocalDateTime.now().minusDays(7), LocalDateTime.now().minusDays(5));

        // ========== CUSTOMS DEPARTMENT ISSUES (5) ==========
        seedIssue("ASYCUDA System Integration Failure", 
                "ASYCUDA World not syncing with RRA internal systems, customs declarations stuck in pending status.",
                "ASYCUDA Integration", "API Connection", "Integration Error", "Critical", "Critical",
                IssueStatus.OPEN, "Customs", customsStaff1, customsStaff1, null);

        seedIssue("Missing HS Codes in Import Declarations", 
                "Over 300 import declarations missing Harmonized System codes, blocking duty assessment.",
                "Customs Declaration System", "HS Code", "Missing Data", "High", "High",
                IssueStatus.OPEN, "Customs", customsStaff2, customsStaff2, null);

        seedIssue("Incorrect Duty Calculation for Used Vehicles", 
                "System calculating import duty based on new vehicle value instead of depreciated value.",
                "Duty Calculation Module", "Vehicle Valuation", "Calculation Error", "High", "Medium",
                IssueStatus.IN_PROGRESS, "Customs", customsStaff3, customsStaff3, null);

        seedIssue("Cargo Tracking System Showing Wrong Location", 
                "Container tracking showing goods at Mombasa port when they already cleared at Kigali.",
                "Cargo Tracking System", "GPS Location", "Data Accuracy", "Medium", "Low",
                IssueStatus.RESOLVED, "Customs", customsStaff1, customsStaff1, LocalDateTime.now().minusDays(1));

        seedClosedIssue("Customs Declaration Numbers Not Sequential", 
                "Declaration reference numbers skipping sequences causing audit trail gaps.",
                "Declaration Numbering System", "Reference Number", "System Logic Error", "Medium", "Medium",
                "Customs", customsStaff2, customsStaff2, customsHOD,
                LocalDateTime.now().minusDays(12), LocalDateTime.now().minusDays(8));

        // ========== VAT DEPARTMENT ISSUES (5) ==========
        seedIssue("VAT Return Submission Portal Down", 
                "Online VAT return submission portal showing 503 error, taxpayers cannot file returns.",
                "VAT Portal", "Web Service", "System Outage", "Critical", "Critical",
                IssueStatus.OPEN, "VAT", vatStaff1, vatStaff1, null);

        seedIssue("Incorrect VAT Rate Applied to Medical Supplies", 
                "System charging 18% VAT on medical supplies which should be VAT-exempt.",
                "VAT Calculation Engine", "VAT Rate", "Configuration Error", "High", "High",
                IssueStatus.IN_PROGRESS, "VAT", vatStaff2, vatStaff2, null);

        seedIssue("VAT Refund Claims Missing Supporting Documents", 
                "120 VAT refund applications submitted without required invoices and receipts.",
                "VAT Refund System", "Supporting Documents", "Missing Data", "Medium", "Medium",
                IssueStatus.IN_PROGRESS, "VAT", vatStaff3, vatStaff3, null);

        seedIssue("Duplicate VAT Registration Numbers Issued", 
                "Same VAT number assigned to two different businesses causing payment confusion.",
                "VAT Registration System", "VAT Number", "Duplication", "High", "High",
                IssueStatus.RESOLVED, "VAT", vatStaff1, vatStaff1, LocalDateTime.now().minusDays(4));

        seedClosedIssue("VAT Credit Notes Not Reflecting in System", 
                "Approved VAT credit notes not updating taxpayer accounts, showing incorrect balances.",
                "VAT Account Management", "Credit Note", "System Update Error", "Medium", "Medium",
                "VAT", vatStaff2, vatStaff2, vatHOD,
                LocalDateTime.now().minusDays(9), LocalDateTime.now().minusDays(6));

        // ========== COMPLIANCE DEPARTMENT ISSUES (5) ==========
        seedIssue("Audit Trail Logs Not Being Generated", 
                "System audit logs empty for last 48 hours, no record of user activities.",
                "Audit System", "Audit Logs", "System Error", "Critical", "Critical",
                IssueStatus.OPEN, "Compliance", complianceStaff1, complianceStaff1, null);

        seedIssue("Tax Evasion Risk Scores Incorrect", 
                "Risk assessment algorithm flagging compliant taxpayers as high-risk incorrectly.",
                "Risk Assessment System", "Risk Score", "Algorithm Error", "High", "Medium",
                IssueStatus.IN_PROGRESS, "Compliance", complianceStaff2, complianceStaff2, null);

        seedIssue("Compliance Report Generation Failing", 
                "Monthly compliance reports timing out and not generating PDF output.",
                "Reporting Module", "Report Generation", "System Timeout", "Medium", "Medium",
                IssueStatus.IN_PROGRESS, "Compliance", complianceStaff1, complianceStaff1, null);

        seedIssue("Missing Digital Signatures on Tax Assessments", 
                "Tax assessment notices being issued without required digital signatures.",
                "Document Management System", "Digital Signature", "Configuration Issue", "High", "High",
                IssueStatus.RESOLVED, "Compliance", complianceStaff2, complianceStaff2, LocalDateTime.now().minusDays(2));

        seedClosedIssue("Taxpayer Audit Schedule Not Syncing", 
                "Audit schedules in compliance system not syncing with taxpayer portal calendar.",
                "Audit Scheduling System", "Calendar Sync", "Integration Error", "Medium", "Low",
                "Compliance", complianceStaff1, complianceStaff1, complianceHOD,
                LocalDateTime.now().minusDays(15), LocalDateTime.now().minusDays(10));

        // ========== DATA MANAGEMENT DEPARTMENT ISSUES (5) ==========
        seedIssue("Data Warehouse ETL Jobs Failing", 
                "Nightly ETL processes failing to load data from operational systems into data warehouse.",
                "Data Warehouse", "ETL Process", "System Error", "Critical", "High",
                IssueStatus.OPEN, "Data Management", dataStaff1, dataStaff1, null);

        seedIssue("Taxpayer Master Data Contains Duplicates", 
                "Same taxpayer registered multiple times with slight name variations causing data quality issues.",
                "Master Data Management", "Taxpayer ID", "Duplication", "High", "High",
                IssueStatus.OPEN, "Data Management", dataStaff2, dataStaff2, null);

        seedIssue("Revenue Dashboard Showing Incorrect Figures", 
                "Executive dashboard displaying revenue figures 15% lower than actual collections.",
                "Business Intelligence System", "Revenue Metrics", "Data Accuracy", "High", "High",
                IssueStatus.IN_PROGRESS, "Data Management", dataStaff3, dataStaff3, null);

        seedIssue("Data Quality Rules Not Being Enforced", 
                "Data validation rules disabled after system upgrade, allowing invalid data entry.",
                "Data Quality System", "Validation Rules", "Configuration Issue", "Medium", "Medium",
                IssueStatus.RESOLVED, "Data Management", dataStaff1, dataStaff1, LocalDateTime.now().minusDays(3));

        seedClosedIssue("Historical Data Migration Incomplete", 
                "2022 tax records not fully migrated to new system, missing 3 months of data.",
                "Data Migration System", "Historical Data", "Migration Error", "High", "Medium",
                "Data Management", dataStaff2, dataStaff2, dataHOD,
                LocalDateTime.now().minusDays(20), LocalDateTime.now().minusDays(14));

        log.info("✅ Realistic RRA issues seeded successfully (40 issues - 5 per department)");
    }

    private void seedIssue(String title, String description, String source, String dataElement,
                          String issueType, String severity, String priority, IssueStatus status,
                          String department, User reportedBy, User assignedTo, LocalDateTime resolvedAt) {
        
        if (issueRepository.findAll().stream().anyMatch(i -> i.getTitle().equals(title))) {
            log.info("Issue already exists: {}", title);
            return;
        }

        Issue issue = Issue.builder()
                .title(title)
                .description(description)
                .source(source)
                .dataElement(dataElement)
                .issueType(issueType)
                .severity(severity)
                .priority(priority)
                .status(status)
                .department(department)
                .reportedBy(reportedBy)
                .assignedTo(assignedTo)
                .resolvedAt(resolvedAt)
                .isDelegated(false)
                .build();
        
        issueRepository.save(issue);
        log.info("Created issue: {} (Status: {}, Department: {})", title, status, department);
    }

    private void seedClosedIssue(String title, String description, String source, String dataElement,
                                 String issueType, String severity, String priority,
                                 String department, User reportedBy, User assignedTo, User closedBy,
                                 LocalDateTime resolvedAt, LocalDateTime closedAt) {
        
        if (issueRepository.findAll().stream().anyMatch(i -> i.getTitle().equals(title))) {
            log.info("Issue already exists: {}", title);
            return;
        }

        Issue issue = Issue.builder()
                .title(title)
                .description(description)
                .source(source)
                .dataElement(dataElement)
                .issueType(issueType)
                .severity(severity)
                .priority(priority)
                .status(IssueStatus.CLOSED)
                .department(department)
                .reportedBy(reportedBy)
                .assignedTo(assignedTo)
                .closedBy(closedBy)
                .resolvedAt(resolvedAt)
                .closedAt(closedAt)
                .isDelegated(false)
                .build();
        
        issueRepository.save(issue);
        log.info("Created closed issue: {} (Department: {})", title, department);
    }

    private void seedAuditLogs() {
        log.info("Seeding audit logs...");
        
        // Check if audit logs already exist
        if (auditLogRepository.count() > 0) {
            log.info("Audit logs already exist, skipping...");
            return;
        }

        // Get users
        User admin = userRepository.findByEmail("admin@rra.gov.rw").orElse(null);
        User financeHOD = userRepository.findByEmail("jean.mugisha@rra.gov.rw").orElse(null);
        User itHOD = userRepository.findByEmail("bernard.ngabo@rra.gov.rw").orElse(null);
        User financeStaff1 = userRepository.findByEmail("john.kamanzi@rra.gov.rw").orElse(null);
        User financeStaff2 = userRepository.findByEmail("sarah.ingabire@rra.gov.rw").orElse(null);
        User itStaff1 = userRepository.findByEmail("kevin.mutabazi@rra.gov.rw").orElse(null);

        // Get issues
        List<Issue> issues = issueRepository.findAll();

        // ========== LOGIN ACTIVITIES ==========
        seedAuditLog(admin, "LOGIN", null, null, 
                "{\"success\": true, \"role\": \"ADMIN\"}", 
                "192.168.1.100", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(30));

        seedAuditLog(financeHOD, "LOGIN", null, null, 
                "{\"success\": true, \"role\": \"HOD\", \"department\": \"Finance\"}", 
                "192.168.1.101", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(25));

        seedAuditLog(financeStaff1, "LOGIN", null, null, 
                "{\"success\": true, \"role\": \"STAFF\", \"department\": \"Finance\"}", 
                "192.168.1.102", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(20));

        // ========== USER MANAGEMENT ACTIVITIES ==========
        seedAuditLog(admin, "USER_CREATED", "User", financeStaff1 != null ? financeStaff1.getId() : null, 
                "{\"employeeId\": \"EMP201\", \"name\": \"John Kamanzi\", \"role\": \"STAFF\", \"department\": \"Finance\"}", 
                "192.168.1.100", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(28));

        seedAuditLog(admin, "USER_CREATED", "User", financeStaff2 != null ? financeStaff2.getId() : null, 
                "{\"employeeId\": \"EMP202\", \"name\": \"Sarah Ingabire\", \"role\": \"STAFF\", \"department\": \"Finance\"}", 
                "192.168.1.100", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(27));

        seedAuditLog(admin, "USER_UPDATED", "User", itStaff1 != null ? itStaff1.getId() : null, 
                "{\"field\": \"department\", \"oldValue\": \"Operations\", \"newValue\": \"IT\"}", 
                "192.168.1.100", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(22));

        // ========== DEPARTMENT ACTIVITIES ==========
        seedAuditLog(admin, "DEPARTMENT_CREATED", "Department", 1L, 
                "{\"name\": \"Finance\", \"description\": \"Financial operations\"}", 
                "192.168.1.100", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(29));

        seedAuditLog(admin, "DEPARTMENT_CREATED", "Department", 2L, 
                "{\"name\": \"IT\", \"description\": \"Information Technology\"}", 
                "192.168.1.100", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(29));

        // ========== ISSUE ACTIVITIES ==========
        if (!issues.isEmpty()) {
            Issue issue1 = issues.get(0);
            
            seedAuditLog(financeStaff1, "ISSUE_CREATED", "Issue", issue1.getId(), 
                    "{\"title\": \"" + issue1.getTitle() + "\", \"priority\": \"High\", \"department\": \"Finance\"}", 
                    "192.168.1.102", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                    LocalDateTime.now().minusDays(18));

            seedAuditLog(financeHOD, "ISSUE_ASSIGNED", "Issue", issue1.getId(), 
                    "{\"assignedTo\": \"John Kamanzi\", \"assignedBy\": \"Jean Claude Mugisha\"}", 
                    "192.168.1.101", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                    LocalDateTime.now().minusDays(17));

            seedAuditLog(financeStaff1, "STATUS_CHANGED", "Issue", issue1.getId(), 
                    "{\"oldStatus\": \"OPEN\", \"newStatus\": \"IN_PROGRESS\"}", 
                    "192.168.1.102", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                    LocalDateTime.now().minusDays(16));

            seedAuditLog(financeHOD, "PRIORITY_CHANGED", "Issue", issue1.getId(), 
                    "{\"oldPriority\": \"Medium\", \"newPriority\": \"High\"}", 
                    "192.168.1.101", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                    LocalDateTime.now().minusDays(15));

            seedAuditLog(financeStaff1, "COMMENT_ADDED", "Issue", issue1.getId(), 
                    "{\"comment\": \"Investigating the root cause of missing TIN numbers\"}", 
                    "192.168.1.102", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                    LocalDateTime.now().minusDays(14));

            seedAuditLog(financeStaff1, "STATUS_CHANGED", "Issue", issue1.getId(), 
                    "{\"oldStatus\": \"IN_PROGRESS\", \"newStatus\": \"RESOLVED\"}", 
                    "192.168.1.102", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                    LocalDateTime.now().minusDays(10));

            seedAuditLog(financeHOD, "ISSUE_CLOSED", "Issue", issue1.getId(), 
                    "{\"closedBy\": \"Jean Claude Mugisha\", \"resolution\": \"Approved\"}", 
                    "192.168.1.101", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                    LocalDateTime.now().minusDays(8));
        }

        // ========== REPORT GENERATION ==========
        seedAuditLog(admin, "REPORT_GENERATED", "Report", null, 
                "{\"reportType\": \"System Report\", \"format\": \"PDF\", \"dateRange\": \"Last 30 days\"}", 
                "192.168.1.100", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(7));

        seedAuditLog(financeHOD, "REPORT_GENERATED", "Report", null, 
                "{\"reportType\": \"Department Report\", \"format\": \"Excel\", \"department\": \"Finance\"}", 
                "192.168.1.101", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(5));

        // ========== DATA VALIDATION ==========
        seedAuditLog(financeStaff1, "DATA_VALIDATION", "ValidationSession", null, 
                "{\"fileName\": \"tax_returns_2024.csv\", \"totalRecords\": 1000, \"passedRecords\": 950, \"failedRecords\": 50}", 
                "192.168.1.102", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(12));

        seedAuditLog(itStaff1, "DATA_VALIDATION", "ValidationSession", null, 
                "{\"fileName\": \"user_data.xlsx\", \"totalRecords\": 500, \"passedRecords\": 480, \"failedRecords\": 20}", 
                "192.168.1.103", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusDays(9));

        // ========== RECENT LOGIN ACTIVITIES ==========
        seedAuditLog(admin, "LOGIN", null, null, 
                "{\"success\": true, \"role\": \"ADMIN\"}", 
                "192.168.1.100", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusHours(2));

        seedAuditLog(financeHOD, "LOGIN", null, null, 
                "{\"success\": true, \"role\": \"HOD\", \"department\": \"Finance\"}", 
                "192.168.1.101", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusHours(1));

        seedAuditLog(financeStaff1, "LOGIN", null, null, 
                "{\"success\": true, \"role\": \"STAFF\", \"department\": \"Finance\"}", 
                "192.168.1.102", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
                LocalDateTime.now().minusMinutes(30));

        log.info("✅ Audit logs seeded successfully (25+ audit records)");
    }

    private void seedAuditLog(User user, String action, String entityType, Long entityId, 
                             String details, String ipAddress, String userAgent, LocalDateTime createdAt) {
        if (user == null) return;

        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .build();
        
        // Manually set createdAt for historical data
        auditLog.setCreatedAt(createdAt);
        
        auditLogRepository.save(auditLog);
    }

    private void seedPasswordHistory(String encodedPassword) {
        log.info("Seeding password history...");
        
        // Check if password history already exists
        if (passwordHistoryRepository.count() > 0) {
            log.info("Password history already exists, skipping...");
            return;
        }

        // Get some users
        User admin = userRepository.findByEmail("admin@rra.gov.rw").orElse(null);
        User financeHOD = userRepository.findByEmail("jean.mugisha@rra.gov.rw").orElse(null);
        User financeStaff1 = userRepository.findByEmail("john.kamanzi@rra.gov.rw").orElse(null);
        User itStaff1 = userRepository.findByEmail("kevin.mutabazi@rra.gov.rw").orElse(null);

        // Generate some old password hashes (simulating password changes)
        String oldPassword1 = passwordEncoder.encode("oldPassword1");
        String oldPassword2 = passwordEncoder.encode("oldPassword2");
        String oldPassword3 = passwordEncoder.encode("oldPassword3");

        // ========== ADMIN PASSWORD HISTORY ==========
        if (admin != null) {
            seedPasswordHistory(admin, oldPassword1, LocalDateTime.now().minusDays(90));
            seedPasswordHistory(admin, oldPassword2, LocalDateTime.now().minusDays(60));
            seedPasswordHistory(admin, oldPassword3, LocalDateTime.now().minusDays(30));
            seedPasswordHistory(admin, encodedPassword, LocalDateTime.now().minusDays(1));
        }

        // ========== FINANCE HOD PASSWORD HISTORY ==========
        if (financeHOD != null) {
            seedPasswordHistory(financeHOD, oldPassword1, LocalDateTime.now().minusDays(80));
            seedPasswordHistory(financeHOD, oldPassword2, LocalDateTime.now().minusDays(50));
            seedPasswordHistory(financeHOD, encodedPassword, LocalDateTime.now().minusDays(2));
        }

        // ========== FINANCE STAFF PASSWORD HISTORY ==========
        if (financeStaff1 != null) {
            seedPasswordHistory(financeStaff1, oldPassword1, LocalDateTime.now().minusDays(70));
            seedPasswordHistory(financeStaff1, oldPassword2, LocalDateTime.now().minusDays(40));
            seedPasswordHistory(financeStaff1, oldPassword3, LocalDateTime.now().minusDays(20));
            seedPasswordHistory(financeStaff1, encodedPassword, LocalDateTime.now().minusDays(3));
        }

        // ========== IT STAFF PASSWORD HISTORY ==========
        if (itStaff1 != null) {
            seedPasswordHistory(itStaff1, oldPassword1, LocalDateTime.now().minusDays(65));
            seedPasswordHistory(itStaff1, encodedPassword, LocalDateTime.now().minusDays(5));
        }

        log.info("✅ Password history seeded successfully (15+ password records)");
    }

    private void seedPasswordHistory(User user, String passwordHash, LocalDateTime createdAt) {
        PasswordHistory history = PasswordHistory.builder()
                .user(user)
                .passwordHash(passwordHash)
                .build();
        
        // Manually set createdAt for historical data
        history.setCreatedAt(createdAt);
        
        passwordHistoryRepository.save(history);
    }
}
