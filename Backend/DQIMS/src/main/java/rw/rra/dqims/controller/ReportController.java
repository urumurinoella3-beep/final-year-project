package rw.rra.dqims.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.rra.dqims.entity.enums.IssueStatus;
import rw.rra.dqims.repository.IssueRepository;
import rw.rra.dqims.repository.UserRepository;
import rw.rra.dqims.service.ReportService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Report Controller
 * 
 * Provides endpoints for:
 * - Dashboard statistics
 * - Professional Excel report generation with activity logs and audit trail
 * - Professional Word report generation with activity logs and audit trail
 * - Filtered reports by department, status, date range
 * 
 * Both Excel and Word formats include comprehensive activity logs for audit purposes
 */
@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final ReportService reportService;

    public ReportController(IssueRepository issueRepository, 
                           UserRepository userRepository,
                           ReportService reportService) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.reportService = reportService;
    }

    /**
     * Get dashboard statistics
     * 
     * Returns real-time statistics for the dashboard including:
     * - Total issues count
     * - Issues by status (Open, In Progress, Resolved, Closed)
     * - Total users count
     * 
     * Example: GET /api/v1/reports/dashboard-stats
     */
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> dashboardStats() {
        var allIssues = issueRepository.findAll();
        long total = allIssues.size();
        long open = allIssues.stream().filter(i -> i.getStatus() == IssueStatus.OPEN).count();
        long inProgress = allIssues.stream().filter(i -> i.getStatus() == IssueStatus.IN_PROGRESS).count();
        long resolved = allIssues.stream().filter(i -> i.getStatus() == IssueStatus.RESOLVED).count();
        long closed = allIssues.stream().filter(i -> i.getStatus() == IssueStatus.CLOSED).count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalIssues", total);
        stats.put("openIssues", open);
        stats.put("inProgressIssues", inProgress);
        stats.put("resolvedIssues", resolved);
        stats.put("closedIssues", closed);
        stats.put("totalUsers", userRepository.count());

        return ResponseEntity.ok(stats);
    }
    
    /**
     * Generate professional Excel report for data validation
     * 
     * Creates a comprehensive Excel workbook with 4 sheets:
     * 1. Summary - Overview statistics, metadata, and applied filters
     * 2. Issues - Detailed issue listing with all data fields
     * 3. Statistics - Breakdowns by status, priority, severity, and department
     * 4. Activity Log - Issue lifecycle tracking with audit trail
     * 
     * Optional filters:
     * - department: Filter by specific department
     * - status: Filter by issue status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
     * - startDate: Filter issues created after this date (ISO format: 2024-01-01T00:00:00)
     * - endDate: Filter issues created before this date (ISO format: 2024-12-31T23:59:59)
     * 
     * Examples:
     * - GET /api/v1/reports/generate-excel
     * - GET /api/v1/reports/generate-excel?department=Finance
     * - GET /api/v1/reports/generate-excel?status=OPEN&startDate=2024-01-01T00:00:00
     * - GET /api/v1/reports/generate-excel?department=IT&status=IN_PROGRESS
     */
    @GetMapping("/generate-excel")
    public ResponseEntity<byte[]> generateExcelReport(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) throws IOException {
        
        byte[] reportData = reportService.generateExcelReport(department, status, startDate, endDate);
        
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HHmm"));
        String filename = "DQIMS-Report-" + timestamp + ".xlsx";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", filename);
        headers.setContentLength(reportData.length);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(reportData);
    }
    
    /**
     * Generate professional Word report with activity logs
     * 
     * Creates a comprehensive Word document with:
     * 1. Title Page - RRA branding, metadata, and applied filters
     * 2. Executive Summary - Overview and key statistics
     * 3. Detailed Statistics - Breakdowns by status, priority, severity, department
     * 4. Issues Table - Complete issue listing
     * 5. Activity Log - Issue lifecycle tracking with audit trail (urgent issues highlighted)
     * 6. Footer - Generation information and confidentiality notice
     * 
     * Optional filters:
     * - department: Filter by specific department
     * - status: Filter by issue status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
     * - startDate: Filter issues created after this date (ISO format: 2024-01-01T00:00:00)
     * - endDate: Filter issues created before this date (ISO format: 2024-12-31T23:59:59)
     * 
     * Examples:
     * - GET /api/v1/reports/generate-word
     * - GET /api/v1/reports/generate-word?department=Finance
     * - GET /api/v1/reports/generate-word?status=OPEN&startDate=2024-01-01T00:00:00
     * - GET /api/v1/reports/generate-word?department=IT&status=IN_PROGRESS
     */
    @GetMapping("/generate-word")
    public ResponseEntity<byte[]> generateWordReport(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) throws IOException {
        
        byte[] reportData = reportService.generateWordReport(department, status, startDate, endDate);
        
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HHmm"));
        String filename = "DQIMS-Report-" + timestamp + ".docx";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
        headers.setContentDispositionFormData("attachment", filename);
        headers.setContentLength(reportData.length);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(reportData);
    }
}
