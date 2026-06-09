package rw.rra.dqims.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;
import org.springframework.stereotype.Service;
import rw.rra.dqims.entity.Issue;
import rw.rra.dqims.entity.User;
import rw.rra.dqims.entity.enums.IssueStatus;
import rw.rra.dqims.repository.IssueRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Professional Report Generation Service
 * 
 * Generates professional reports in Excel and Word formats with:
 * - RRA branding and professional formatting
 * - Summary with key statistics and metadata
 * - Detailed issues listing with all data fields
 * - Statistics with breakdowns by status, priority, severity, and department
 * - Activity log tracking issue lifecycle and actions
 * - Complete audit trail with generation metadata
 * 
 * Both Excel and Word formats include comprehensive activity logs for audit purposes
 */
@Service
public class ReportService {
    
    private final IssueRepository issueRepository;
    private final CurrentUserService currentUserService;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private final DateTimeFormatter displayFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
    
    public ReportService(IssueRepository issueRepository, CurrentUserService currentUserService) {
        this.issueRepository = issueRepository;
        this.currentUserService = currentUserService;
    }
    
    /**
     * Generate Professional Excel Report with Activity Logs and Audit Trail
     * 
     * Creates a comprehensive Excel workbook with 4 sheets:
     * 1. Summary - Overview statistics and generation metadata
     * 2. Issues - Detailed issue listing with all fields
     * 3. Statistics - Breakdowns by status, priority, severity, department
     * 4. Activity Log - Issue lifecycle tracking with actions and timelines
     */
    public byte[] generateExcelReport(String department, String status, LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        List<Issue> issues = getFilteredIssues(department, status, startDate, endDate);
        User currentUser = null;
        try {
            currentUser = currentUserService.getCurrentUser();
        } catch (Exception e) {
            // If user cannot be retrieved, use a default placeholder
            currentUser = new User();
            currentUser.setName("System");
            currentUser.setEmail("system@rra.gov.rw");
            currentUser.setRole(rw.rra.dqims.entity.enums.UserRole.ADMIN);
        }
        
        XSSFWorkbook workbook = new XSSFWorkbook();
        
        // Create sheets with enhanced formatting
        createSummarySheet(workbook, issues, currentUser, department, status, startDate, endDate);
        createIssuesSheet(workbook, issues);
        createStatisticsSheet(workbook, issues);
        createActivityLogSheet(workbook, issues);
        
        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        
        return outputStream.toByteArray();
    }
    
    /**
     * Generate Professional Word Report with Activity Logs and Audit Trail
     * 
     * Creates a comprehensive Word document with:
     * 1. Title Page - RRA branding and report metadata
     * 2. Executive Summary - Overview and key statistics
     * 3. Detailed Statistics - Breakdowns by various categories
     * 4. Issues Table - Complete issue listing
     * 5. Activity Log - Issue lifecycle tracking with audit trail
     * 6. Footer - Generation information
     */
    public byte[] generateWordReport(String department, String status, LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        List<Issue> issues = getFilteredIssues(department, status, startDate, endDate);
        User currentUser = null;
        try {
            currentUser = currentUserService.getCurrentUser();
        } catch (Exception e) {
            // If user cannot be retrieved, use a default placeholder
            currentUser = new User();
            currentUser.setName("System");
            currentUser.setEmail("system@rra.gov.rw");
            currentUser.setRole(rw.rra.dqims.entity.enums.UserRole.ADMIN);
        }
        
        XWPFDocument document = new XWPFDocument();
        
        // Create document sections
        createWordTitlePage(document, currentUser, department, status, startDate, endDate);
        createWordExecutiveSummary(document, issues);
        createWordStatisticsSection(document, issues);
        createWordIssuesTable(document, issues);
        createWordActivityLog(document, issues);
        createWordFooter(document);
        
        // Write to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        document.write(outputStream);
        document.close();
        
        return outputStream.toByteArray();
    }
    
    // ==================== EXCEL SHEET CREATION METHODS ====================
    
    private void createSummarySheet(XSSFWorkbook workbook, List<Issue> issues, User currentUser, 
                                   String department, String status, LocalDateTime startDate, LocalDateTime endDate) {
        XSSFSheet sheet = workbook.createSheet("Summary");
        
        int rowNum = 0;
        
        // Title
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("RWANDA REVENUE AUTHORITY");
        CellStyle titleStyle = createTitleStyle(workbook);
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 5));
        
        // Subtitle
        rowNum++;
        Row subtitleRow = sheet.createRow(rowNum++);
        Cell subtitleCell = subtitleRow.createCell(0);
        subtitleCell.setCellValue("Data Quality Issues Management System - Excel Report");
        CellStyle subtitleStyle = createSubtitleStyle(workbook);
        subtitleCell.setCellStyle(subtitleStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 5));
        
        // Report metadata section
        rowNum++;
        Row metadataHeaderRow = sheet.createRow(rowNum++);
        Cell metadataHeaderCell = metadataHeaderRow.createCell(0);
        metadataHeaderCell.setCellValue("REPORT METADATA");
        CellStyle headerStyle = createHeaderStyle(workbook);
        metadataHeaderCell.setCellStyle(headerStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 5));
        
        rowNum++;
        createInfoRow(sheet, workbook, rowNum++, "Generated:", LocalDateTime.now().format(displayFormatter));
        createInfoRow(sheet, workbook, rowNum++, "Generated by:", currentUser != null ? currentUser.getName() : "System");
        createInfoRow(sheet, workbook, rowNum++, "User Role:", currentUser != null ? currentUser.getRole().name() : "ADMIN");
        createInfoRow(sheet, workbook, rowNum++, "User Email:", currentUser != null ? currentUser.getEmail() : "system@rra.gov.rw");
        createInfoRow(sheet, workbook, rowNum++, "Report Type:", "Data Validation & Analysis");
        
        // Applied filters section
        rowNum++;
        Row filtersHeaderRow = sheet.createRow(rowNum++);
        Cell filtersHeaderCell = filtersHeaderRow.createCell(0);
        filtersHeaderCell.setCellValue("APPLIED FILTERS");
        filtersHeaderCell.setCellStyle(headerStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 5));
        
        rowNum++;
        createInfoRow(sheet, workbook, rowNum++, "Department Filter:", department != null ? department : "All Departments");
        createInfoRow(sheet, workbook, rowNum++, "Status Filter:", status != null ? status : "All Statuses");
        createInfoRow(sheet, workbook, rowNum++, "Start Date:", startDate != null ? startDate.format(displayFormatter) : "Not Applied");
        createInfoRow(sheet, workbook, rowNum++, "End Date:", endDate != null ? endDate.format(displayFormatter) : "Not Applied");
        
        // Statistics section
        rowNum++;
        Row statsHeaderRow = sheet.createRow(rowNum++);
        Cell statsHeaderCell = statsHeaderRow.createCell(0);
        statsHeaderCell.setCellValue("SUMMARY STATISTICS");
        statsHeaderCell.setCellStyle(headerStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 5));
        
        rowNum++;
        long totalIssues = issues.size();
        long openIssues = issues.stream().filter(i -> i.getStatus() == IssueStatus.OPEN).count();
        long inProgressIssues = issues.stream().filter(i -> i.getStatus() == IssueStatus.IN_PROGRESS).count();
        long resolvedIssues = issues.stream().filter(i -> i.getStatus() == IssueStatus.RESOLVED).count();
        long closedIssues = issues.stream().filter(i -> i.getStatus() == IssueStatus.CLOSED).count();
        
        createStatRow(sheet, workbook, rowNum++, "Total Issues:", String.valueOf(totalIssues));
        createStatRow(sheet, workbook, rowNum++, "Open Issues:", String.valueOf(openIssues));
        createStatRow(sheet, workbook, rowNum++, "In Progress Issues:", String.valueOf(inProgressIssues));
        createStatRow(sheet, workbook, rowNum++, "Resolved Issues:", String.valueOf(resolvedIssues));
        createStatRow(sheet, workbook, rowNum++, "Closed Issues:", String.valueOf(closedIssues));
        createStatRow(sheet, workbook, rowNum++, "Completion Rate:", 
                String.format("%.1f%%", totalIssues > 0 ? (closedIssues * 100.0 / totalIssues) : 0));
        createStatRow(sheet, workbook, rowNum++, "Average Days Open:", 
                String.format("%.1f days", issues.stream()
                        .mapToLong(i -> java.time.temporal.ChronoUnit.DAYS.between(i.getCreatedAt(), LocalDateTime.now()))
                        .average().orElse(0.0)));
        
        // Issues by department
        rowNum++;
        Row deptHeaderRow = sheet.createRow(rowNum++);
        Cell deptHeaderCell = deptHeaderRow.createCell(0);
        deptHeaderCell.setCellValue("ISSUES BY DEPARTMENT");
        deptHeaderCell.setCellStyle(headerStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 5));
        
        rowNum++;
        Map<String, Long> issuesByDept = issues.stream()
                .collect(Collectors.groupingBy(Issue::getDepartment, Collectors.counting()));
        
        for (Map.Entry<String, Long> entry : issuesByDept.entrySet()) {
            createStatRow(sheet, workbook, rowNum++, entry.getKey() + ":", String.valueOf(entry.getValue()));
        }
        
        // Auto-size columns
        for (int i = 0; i < 6; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000);
        }
    }
    
    private void createIssuesSheet(XSSFWorkbook workbook, List<Issue> issues) {
        XSSFSheet sheet = workbook.createSheet("Issues");
        
        // Create header row
        Row headerRow = sheet.createRow(0);
        CellStyle headerStyle = createTableHeaderStyle(workbook);
        
        String[] headers = {"ID", "Title", "Description", "Status", "Priority", "Severity", "Department", "Reported By", "Assigned To", "Created Date", "Updated Date"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Create data rows
        CellStyle evenRowStyle = createEvenRowStyle(workbook);
        CellStyle oddRowStyle = createOddRowStyle(workbook);
        
        int rowNum = 1;
        for (Issue issue : issues) {
            Row row = sheet.createRow(rowNum);
            CellStyle rowStyle = (rowNum % 2 == 0) ? evenRowStyle : oddRowStyle;
            
            createStyledCell(row, 0, issue.getId().toString(), rowStyle);
            createStyledCell(row, 1, issue.getTitle(), rowStyle);
            createStyledCell(row, 2, issue.getDescription(), rowStyle);
            createStyledCell(row, 3, issue.getStatus().name(), rowStyle);
            createStyledCell(row, 4, issue.getPriority(), rowStyle);
            createStyledCell(row, 5, issue.getSeverity(), rowStyle);
            createStyledCell(row, 6, issue.getDepartment(), rowStyle);
            createStyledCell(row, 7, issue.getReportedBy().getName(), rowStyle);
            createStyledCell(row, 8, issue.getAssignedTo() != null ? issue.getAssignedTo().getName() : "Unassigned", rowStyle);
            createStyledCell(row, 9, issue.getCreatedAt().format(formatter), rowStyle);
            createStyledCell(row, 10, issue.getUpdatedAt().format(formatter), rowStyle);
            
            rowNum++;
        }
        
        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    private void createStatisticsSheet(XSSFWorkbook workbook, List<Issue> issues) {
        XSSFSheet sheet = workbook.createSheet("Statistics");
        
        int rowNum = 0;
        
        // Title
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("DETAILED STATISTICS");
        titleCell.setCellStyle(createTitleStyle(workbook));
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 3));
        
        rowNum++;
        
        // Issues by Status
        createStatisticsTable(sheet, workbook, rowNum, "Issues by Status",
                issues.stream().collect(Collectors.groupingBy(i -> i.getStatus().name(), Collectors.counting())));
        
        rowNum += 10;
        
        // Issues by Priority
        createStatisticsTable(sheet, workbook, rowNum, "Issues by Priority",
                issues.stream().collect(Collectors.groupingBy(Issue::getPriority, Collectors.counting())));
        
        rowNum += 10;
        
        // Issues by Severity
        createStatisticsTable(sheet, workbook, rowNum, "Issues by Severity",
                issues.stream().collect(Collectors.groupingBy(Issue::getSeverity, Collectors.counting())));
        
        // Auto-size columns
        for (int i = 0; i < 4; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    private void createActivityLogSheet(XSSFWorkbook workbook, List<Issue> issues) {
        XSSFSheet sheet = workbook.createSheet("Activity Log");
        
        int rowNum = 0;
        
        // Title
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("ACTIVITY LOG & AUDIT TRAIL");
        titleCell.setCellStyle(createTitleStyle(workbook));
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 8));
        
        // Description
        rowNum++;
        Row descRow = sheet.createRow(rowNum++);
        Cell descCell = descRow.createCell(0);
        descCell.setCellValue("Comprehensive activity tracking for all issues with lifecycle information and audit trail");
        CellStyle descStyle = workbook.createCellStyle();
        Font descFont = workbook.createFont();
        descFont.setItalic(true);
        descFont.setFontHeightInPoints((short) 10);
        descStyle.setFont(descFont);
        descCell.setCellStyle(descStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 8));
        
        rowNum++;
        
        // Header
        Row headerRow = sheet.createRow(rowNum++);
        CellStyle headerStyle = createTableHeaderStyle(workbook);
        
        String[] headers = {"Issue ID", "Title", "Current Action", "Status", "Priority", "Reported By", "Assigned To", "Last Updated", "Days Open"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Data rows with color coding based on status
        CellStyle evenRowStyle = createEvenRowStyle(workbook);
        CellStyle oddRowStyle = createOddRowStyle(workbook);
        CellStyle urgentStyle = createUrgentRowStyle(workbook);
        
        for (Issue issue : issues) {
            Row row = sheet.createRow(rowNum);
            
            // Use urgent style for high priority open issues
            long daysOpen = java.time.temporal.ChronoUnit.DAYS.between(issue.getCreatedAt(), LocalDateTime.now());
            boolean isUrgent = (issue.getStatus() == IssueStatus.OPEN || issue.getStatus() == IssueStatus.IN_PROGRESS) 
                            && daysOpen > 7;
            CellStyle rowStyle = isUrgent ? urgentStyle : ((rowNum % 2 == 0) ? evenRowStyle : oddRowStyle);
            
            createStyledCell(row, 0, issue.getId().toString(), rowStyle);
            createStyledCell(row, 1, issue.getTitle(), rowStyle);
            createStyledCell(row, 2, getActionFromStatus(issue.getStatus()), rowStyle);
            createStyledCell(row, 3, issue.getStatus().name(), rowStyle);
            createStyledCell(row, 4, issue.getPriority(), rowStyle);
            createStyledCell(row, 5, issue.getReportedBy().getName(), rowStyle);
            createStyledCell(row, 6, issue.getAssignedTo() != null ? issue.getAssignedTo().getName() : "Unassigned", rowStyle);
            createStyledCell(row, 7, issue.getUpdatedAt().format(displayFormatter), rowStyle);
            createStyledCell(row, 8, String.valueOf(daysOpen) + " days", rowStyle);
            
            rowNum++;
        }
        
        // Add legend
        rowNum += 2;
        Row legendRow = sheet.createRow(rowNum++);
        Cell legendCell = legendRow.createCell(0);
        legendCell.setCellValue("Legend: Issues open for more than 7 days are highlighted in yellow");
        legendCell.setCellStyle(descStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 8));
        
        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 500);
        }
    }
    
    private void createStatisticsTable(XSSFSheet sheet, XSSFWorkbook workbook, int startRow, String title, Map<String, Long> data) {
        // Title
        Row titleRow = sheet.createRow(startRow);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue(title);
        titleCell.setCellStyle(createHeaderStyle(workbook));
        sheet.addMergedRegion(new CellRangeAddress(startRow, startRow, 0, 1));
        
        // Header
        Row headerRow = sheet.createRow(startRow + 1);
        CellStyle headerStyle = createTableHeaderStyle(workbook);
        Cell header1 = headerRow.createCell(0);
        header1.setCellValue("Category");
        header1.setCellStyle(headerStyle);
        Cell header2 = headerRow.createCell(1);
        header2.setCellValue("Count");
        header2.setCellStyle(headerStyle);
        
        // Data
        int rowNum = startRow + 2;
        CellStyle dataStyle = createOddRowStyle(workbook);
        for (Map.Entry<String, Long> entry : data.entrySet()) {
            Row row = sheet.createRow(rowNum++);
            createStyledCell(row, 0, entry.getKey(), dataStyle);
            createStyledCell(row, 1, entry.getValue().toString(), dataStyle);
        }
    }
    
    // ==================== HELPER METHODS ====================
    
    private List<Issue> getFilteredIssues(String department, String status, LocalDateTime startDate, LocalDateTime endDate) {
        List<Issue> issues = issueRepository.findAll();
        
        // Filter by department
        if (department != null && !department.isEmpty()) {
            issues = issues.stream()
                    .filter(i -> i.getDepartment().equalsIgnoreCase(department))
                    .collect(Collectors.toList());
        }
        
        // Filter by status
        if (status != null && !status.isEmpty()) {
            issues = issues.stream()
                    .filter(i -> i.getStatus().name().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }
        
        // Filter by start date/time with strict comparison (>=)
        // Issues created AT or AFTER the start date/time are included
        if (startDate != null) {
            issues = issues.stream()
                    .filter(i -> {
                        LocalDateTime issueCreatedAt = i.getCreatedAt();
                        // Use isAfter OR isEqual for >= comparison
                        return issueCreatedAt.isAfter(startDate) || issueCreatedAt.isEqual(startDate);
                    })
                    .collect(Collectors.toList());
        }
        
        // Filter by end date/time with strict comparison (<=)
        // Issues created AT or BEFORE the end date/time are included
        if (endDate != null) {
            issues = issues.stream()
                    .filter(i -> {
                        LocalDateTime issueCreatedAt = i.getCreatedAt();
                        // Use isBefore OR isEqual for <= comparison
                        return issueCreatedAt.isBefore(endDate) || issueCreatedAt.isEqual(endDate);
                    })
                    .collect(Collectors.toList());
        }
        
        return issues;
    }
    
    private String getActionFromStatus(IssueStatus status) {
        switch (status) {
            case OPEN: return "Issue Reported";
            case IN_PROGRESS: return "Work In Progress";
            case RESOLVED: return "Issue Resolved";
            case CLOSED: return "Issue Closed";
            default: return "Unknown";
        }
    }
    
    // ==================== EXCEL STYLE HELPERS ====================
    
    private CellStyle createTitleStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        font.setColor(IndexedColors.BLUE.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }
    
    private CellStyle createSubtitleStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }
    
    private CellStyle createHeaderStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }
    
    private CellStyle createTableHeaderStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }
    
    private CellStyle createEvenRowStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }
    
    private CellStyle createOddRowStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }
    
    private CellStyle createUrgentRowStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }
    
    private void createInfoRow(XSSFSheet sheet, XSSFWorkbook workbook, int rowNum, String label, String value) {
        Row row = sheet.createRow(rowNum);
        Cell labelCell = row.createCell(0);
        labelCell.setCellValue(label);
        Font font = workbook.createFont();
        font.setBold(true);
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        labelCell.setCellStyle(style);
        
        Cell valueCell = row.createCell(1);
        valueCell.setCellValue(value);
    }
    
    private void createStatRow(XSSFSheet sheet, XSSFWorkbook workbook, int rowNum, String label, String value) {
        Row row = sheet.createRow(rowNum);
        Cell labelCell = row.createCell(0);
        labelCell.setCellValue(label);
        Font font = workbook.createFont();
        font.setBold(true);
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        labelCell.setCellStyle(style);
        
        Cell valueCell = row.createCell(1);
        valueCell.setCellValue(value);
        CellStyle valueStyle = workbook.createCellStyle();
        Font valueFont = workbook.createFont();
        valueFont.setFontHeightInPoints((short) 12);
        valueStyle.setFont(valueFont);
        valueCell.setCellStyle(valueStyle);
    }
    
    private void createStyledCell(Row row, int column, String value, CellStyle style) {
        Cell cell = row.createCell(column);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }
    
    // ==================== WORD DOCUMENT METHODS ====================
    
    private void createWordTitlePage(XWPFDocument document, User currentUser, String department, String status, LocalDateTime startDate, LocalDateTime endDate) {
        // Title
        XWPFParagraph titlePara = document.createParagraph();
        titlePara.setAlignment(ParagraphAlignment.CENTER);
        titlePara.setSpacingAfter(300);
        
        XWPFRun titleRun = titlePara.createRun();
        titleRun.setBold(true);
        titleRun.setFontSize(24);
        titleRun.setColor("0070C0"); // RRA Blue
        titleRun.setText("RWANDA REVENUE AUTHORITY");
        titleRun.addBreak();
        titleRun.addBreak();
        
        titleRun.setFontSize(18);
        titleRun.setText("Data Quality Issues Management System");
        titleRun.addBreak();
        titleRun.addBreak();
        
        titleRun.setFontSize(16);
        titleRun.setText("COMPREHENSIVE REPORT WITH ACTIVITY LOG");
        titleRun.addBreak();
        titleRun.addBreak();
        titleRun.addBreak();
        
        // Metadata section
        titleRun.setBold(false);
        titleRun.setFontSize(12);
        titleRun.setColor("000000");
        titleRun.setText("REPORT METADATA");
        titleRun.addBreak();
        titleRun.addBreak();
        
        titleRun.setFontSize(11);
        titleRun.setText("Generated: " + LocalDateTime.now().format(displayFormatter));
        titleRun.addBreak();
        titleRun.setText("Generated by: " + (currentUser != null ? currentUser.getName() : "System"));
        titleRun.addBreak();
        titleRun.setText("User Role: " + (currentUser != null ? currentUser.getRole().name() : "ADMIN"));
        titleRun.addBreak();
        titleRun.setText("User Email: " + (currentUser != null ? currentUser.getEmail() : "system@rra.gov.rw"));
        titleRun.addBreak();
        titleRun.addBreak();
        
        // Applied filters
        titleRun.setBold(true);
        titleRun.setText("APPLIED FILTERS");
        titleRun.addBreak();
        titleRun.addBreak();
        
        titleRun.setBold(false);
        titleRun.setText("Department: " + (department != null ? department : "All Departments"));
        titleRun.addBreak();
        titleRun.setText("Status: " + (status != null ? status : "All Statuses"));
        titleRun.addBreak();
        titleRun.setText("Start Date: " + (startDate != null ? startDate.format(displayFormatter) : "Not Applied"));
        titleRun.addBreak();
        titleRun.setText("End Date: " + (endDate != null ? endDate.format(displayFormatter) : "Not Applied"));
        
        // Page break
        titlePara.setPageBreak(true);
    }
    
    private void createWordExecutiveSummary(XWPFDocument document, List<Issue> issues) {
        // Heading
        XWPFParagraph heading = document.createParagraph();
        XWPFRun headingRun = heading.createRun();
        headingRun.setBold(true);
        headingRun.setFontSize(16);
        headingRun.setColor("0070C0");
        headingRun.setText("EXECUTIVE SUMMARY");
        heading.setSpacingAfter(200);
        
        // Content
        XWPFParagraph content = document.createParagraph();
        content.setSpacingAfter(300);
        XWPFRun contentRun = content.createRun();
        contentRun.setFontSize(11);
        contentRun.setText("This report provides a comprehensive overview of data quality issues in the DQIMS system, including detailed statistics, issue listings, and complete activity logs for audit purposes.");
        contentRun.addBreak();
        contentRun.addBreak();
        
        long totalIssues = issues.size();
        long openIssues = issues.stream().filter(i -> i.getStatus() == IssueStatus.OPEN).count();
        long inProgressIssues = issues.stream().filter(i -> i.getStatus() == IssueStatus.IN_PROGRESS).count();
        long resolvedIssues = issues.stream().filter(i -> i.getStatus() == IssueStatus.RESOLVED).count();
        long closedIssues = issues.stream().filter(i -> i.getStatus() == IssueStatus.CLOSED).count();
        
        contentRun.setBold(true);
        contentRun.setText("KEY STATISTICS:");
        contentRun.setBold(false);
        contentRun.addBreak();
        contentRun.setText("• Total Issues: " + totalIssues);
        contentRun.addBreak();
        contentRun.setText("• Open Issues: " + openIssues);
        contentRun.addBreak();
        contentRun.setText("• In Progress: " + inProgressIssues);
        contentRun.addBreak();
        contentRun.setText("• Resolved: " + resolvedIssues);
        contentRun.addBreak();
        contentRun.setText("• Closed: " + closedIssues);
        contentRun.addBreak();
        contentRun.setText("• Completion Rate: " + String.format("%.1f%%", totalIssues > 0 ? (closedIssues * 100.0 / totalIssues) : 0));
        contentRun.addBreak();
        contentRun.setText("• Average Days Open: " + String.format("%.1f days", issues.stream()
                .mapToLong(i -> java.time.temporal.ChronoUnit.DAYS.between(i.getCreatedAt(), LocalDateTime.now()))
                .average().orElse(0.0)));
    }
    
    private void createWordStatisticsSection(XWPFDocument document, List<Issue> issues) {
        // Heading
        XWPFParagraph heading = document.createParagraph();
        heading.setSpacingBefore(300);
        XWPFRun headingRun = heading.createRun();
        headingRun.setBold(true);
        headingRun.setFontSize(14);
        headingRun.setColor("0070C0");
        headingRun.setText("DETAILED STATISTICS");
        heading.setSpacingAfter(200);
        
        // Issues by Status
        createWordStatTable(document, "Issues by Status",
                issues.stream().collect(Collectors.groupingBy(i -> i.getStatus().name(), Collectors.counting())));
        
        // Issues by Priority
        createWordStatTable(document, "Issues by Priority",
                issues.stream().collect(Collectors.groupingBy(Issue::getPriority, Collectors.counting())));
        
        // Issues by Severity
        createWordStatTable(document, "Issues by Severity",
                issues.stream().collect(Collectors.groupingBy(Issue::getSeverity, Collectors.counting())));
        
        // Issues by Department
        createWordStatTable(document, "Issues by Department",
                issues.stream().collect(Collectors.groupingBy(Issue::getDepartment, Collectors.counting())));
    }
    
    private void createWordStatTable(XWPFDocument document, String title, Map<String, Long> data) {
        // Title
        XWPFParagraph titlePara = document.createParagraph();
        titlePara.setSpacingBefore(200);
        XWPFRun titleRun = titlePara.createRun();
        titleRun.setBold(true);
        titleRun.setFontSize(12);
        titleRun.setText(title);
        
        // Table
        XWPFTable table = document.createTable(data.size() + 1, 2);
        table.setWidth("80%");
        
        // Set table borders
        CTTblPr tblPr = table.getCTTbl().getTblPr();
        if (tblPr == null) {
            tblPr = table.getCTTbl().addNewTblPr();
        }
        CTTblBorders borders = tblPr.addNewTblBorders();
        borders.addNewTop().setVal(STBorder.SINGLE);
        borders.addNewBottom().setVal(STBorder.SINGLE);
        borders.addNewLeft().setVal(STBorder.SINGLE);
        borders.addNewRight().setVal(STBorder.SINGLE);
        borders.addNewInsideH().setVal(STBorder.SINGLE);
        borders.addNewInsideV().setVal(STBorder.SINGLE);
        
        // Header row
        XWPFTableRow headerRow = table.getRow(0);
        setWordTableCell(headerRow.getCell(0), "Category", true, "0070C0");
        setWordTableCell(headerRow.getCell(1), "Count", true, "0070C0");
        
        // Data rows
        int rowNum = 1;
        for (Map.Entry<String, Long> entry : data.entrySet()) {
            XWPFTableRow row = table.getRow(rowNum);
            setWordTableCell(row.getCell(0), entry.getKey(), false, "000000");
            setWordTableCell(row.getCell(1), entry.getValue().toString(), false, "000000");
            rowNum++;
        }
    }
    
    private void createWordIssuesTable(XWPFDocument document, List<Issue> issues) {
        // Heading
        XWPFParagraph heading = document.createParagraph();
        heading.setSpacingBefore(300);
        heading.setPageBreak(true);
        XWPFRun headingRun = heading.createRun();
        headingRun.setBold(true);
        headingRun.setFontSize(14);
        headingRun.setColor("0070C0");
        headingRun.setText("DETAILED ISSUES LIST");
        heading.setSpacingAfter(200);
        
        if (issues.isEmpty()) {
            XWPFParagraph noPara = document.createParagraph();
            noPara.createRun().setText("No issues found matching the specified criteria.");
            return;
        }
        
        // Create table
        XWPFTable table = document.createTable(issues.size() + 1, 7);
        table.setWidth("100%");
        
        // Set table borders
        CTTblPr tblPr = table.getCTTbl().getTblPr();
        if (tblPr == null) {
            tblPr = table.getCTTbl().addNewTblPr();
        }
        CTTblBorders borders = tblPr.addNewTblBorders();
        borders.addNewTop().setVal(STBorder.SINGLE);
        borders.addNewBottom().setVal(STBorder.SINGLE);
        borders.addNewLeft().setVal(STBorder.SINGLE);
        borders.addNewRight().setVal(STBorder.SINGLE);
        borders.addNewInsideH().setVal(STBorder.SINGLE);
        borders.addNewInsideV().setVal(STBorder.SINGLE);
        
        // Header row
        XWPFTableRow headerRow = table.getRow(0);
        setWordTableCell(headerRow.getCell(0), "ID", true, "0070C0");
        setWordTableCell(headerRow.getCell(1), "Title", true, "0070C0");
        setWordTableCell(headerRow.getCell(2), "Status", true, "0070C0");
        setWordTableCell(headerRow.getCell(3), "Priority", true, "0070C0");
        setWordTableCell(headerRow.getCell(4), "Department", true, "0070C0");
        setWordTableCell(headerRow.getCell(5), "Assigned To", true, "0070C0");
        setWordTableCell(headerRow.getCell(6), "Created Date", true, "0070C0");
        
        // Data rows
        int rowNum = 1;
        for (Issue issue : issues) {
            XWPFTableRow row = table.getRow(rowNum);
            setWordTableCell(row.getCell(0), issue.getId().toString(), false, "000000");
            setWordTableCell(row.getCell(1), issue.getTitle(), false, "000000");
            setWordTableCell(row.getCell(2), issue.getStatus().name(), false, "000000");
            setWordTableCell(row.getCell(3), issue.getPriority(), false, "000000");
            setWordTableCell(row.getCell(4), issue.getDepartment(), false, "000000");
            setWordTableCell(row.getCell(5), issue.getAssignedTo() != null ? issue.getAssignedTo().getName() : "Unassigned", false, "000000");
            setWordTableCell(row.getCell(6), issue.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")), false, "000000");
            rowNum++;
        }
    }
    
    private void createWordActivityLog(XWPFDocument document, List<Issue> issues) {
        // Heading
        XWPFParagraph heading = document.createParagraph();
        heading.setSpacingBefore(300);
        heading.setPageBreak(true);
        XWPFRun headingRun = heading.createRun();
        headingRun.setBold(true);
        headingRun.setFontSize(14);
        headingRun.setColor("0070C0");
        headingRun.setText("ACTIVITY LOG & AUDIT TRAIL");
        heading.setSpacingAfter(200);
        
        // Description
        XWPFParagraph descPara = document.createParagraph();
        XWPFRun descRun = descPara.createRun();
        descRun.setItalic(true);
        descRun.setFontSize(10);
        descRun.setText("Comprehensive activity tracking for all issues with lifecycle information and audit trail. Issues open for more than 7 days are marked as URGENT.");
        descPara.setSpacingAfter(200);
        
        if (issues.isEmpty()) {
            XWPFParagraph noPara = document.createParagraph();
            noPara.createRun().setText("No activity log entries found.");
            return;
        }
        
        // Create table
        XWPFTable table = document.createTable(issues.size() + 1, 8);
        table.setWidth("100%");
        
        // Set table borders
        CTTblPr tblPr = table.getCTTbl().getTblPr();
        if (tblPr == null) {
            tblPr = table.getCTTbl().addNewTblPr();
        }
        CTTblBorders borders = tblPr.addNewTblBorders();
        borders.addNewTop().setVal(STBorder.SINGLE);
        borders.addNewBottom().setVal(STBorder.SINGLE);
        borders.addNewLeft().setVal(STBorder.SINGLE);
        borders.addNewRight().setVal(STBorder.SINGLE);
        borders.addNewInsideH().setVal(STBorder.SINGLE);
        borders.addNewInsideV().setVal(STBorder.SINGLE);
        
        // Header row
        XWPFTableRow headerRow = table.getRow(0);
        setWordTableCell(headerRow.getCell(0), "ID", true, "0070C0");
        setWordTableCell(headerRow.getCell(1), "Title", true, "0070C0");
        setWordTableCell(headerRow.getCell(2), "Action", true, "0070C0");
        setWordTableCell(headerRow.getCell(3), "Status", true, "0070C0");
        setWordTableCell(headerRow.getCell(4), "Priority", true, "0070C0");
        setWordTableCell(headerRow.getCell(5), "Assigned To", true, "0070C0");
        setWordTableCell(headerRow.getCell(6), "Last Updated", true, "0070C0");
        setWordTableCell(headerRow.getCell(7), "Days Open", true, "0070C0");
        
        // Data rows
        int rowNum = 1;
        for (Issue issue : issues) {
            XWPFTableRow row = table.getRow(rowNum);
            long daysOpen = java.time.temporal.ChronoUnit.DAYS.between(issue.getCreatedAt(), LocalDateTime.now());
            boolean isUrgent = (issue.getStatus() == IssueStatus.OPEN || issue.getStatus() == IssueStatus.IN_PROGRESS) && daysOpen > 7;
            
            setWordTableCell(row.getCell(0), issue.getId().toString(), false, "000000");
            setWordTableCell(row.getCell(1), issue.getTitle(), false, "000000");
            setWordTableCell(row.getCell(2), getActionFromStatus(issue.getStatus()), false, "000000");
            setWordTableCell(row.getCell(3), issue.getStatus().name(), false, "000000");
            setWordTableCell(row.getCell(4), issue.getPriority(), false, "000000");
            setWordTableCell(row.getCell(5), issue.getAssignedTo() != null ? issue.getAssignedTo().getName() : "Unassigned", false, "000000");
            setWordTableCell(row.getCell(6), issue.getUpdatedAt().format(displayFormatter), false, "000000");
            setWordTableCell(row.getCell(7), daysOpen + " days" + (isUrgent ? " [URGENT]" : ""), isUrgent, isUrgent ? "FF0000" : "000000");
            
            // Highlight urgent rows with yellow background
            if (isUrgent) {
                for (int i = 0; i < 8; i++) {
                    CTTcPr tcPr = row.getCell(i).getCTTc().addNewTcPr();
                    CTShd shd = tcPr.addNewShd();
                    shd.setFill("FFFF00"); // Yellow background
                }
            }
            
            rowNum++;
        }
    }
    
    private void createWordFooter(XWPFDocument document) {
        // Add footer text as a paragraph at the end of the document
        XWPFParagraph footerPara = document.createParagraph();
        footerPara.setAlignment(ParagraphAlignment.CENTER);
        footerPara.setSpacingBefore(500);
        footerPara.setBorderTop(Borders.SINGLE);
        
        XWPFRun footerRun = footerPara.createRun();
        footerRun.setFontSize(9);
        footerRun.setColor("808080"); // Gray color
        footerRun.setText("Generated by DQIMS - Rwanda Revenue Authority | " + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy HH:mm")));
        footerRun.addBreak();
        footerRun.setText("This report contains confidential information and activity logs for audit purposes.");
    }
    
    private void setWordTableCell(XWPFTableCell cell, String text, boolean bold, String color) {
        cell.removeParagraph(0); // Remove default paragraph
        XWPFParagraph para = cell.addParagraph();
        para.setAlignment(ParagraphAlignment.LEFT);
        XWPFRun run = para.createRun();
        run.setText(text);
        run.setBold(bold);
        run.setColor(color);
        run.setFontSize(10);
    }
}
