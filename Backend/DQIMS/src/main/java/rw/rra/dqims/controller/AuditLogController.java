package rw.rra.dqims.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.rra.dqims.dto.response.AuditLogResponse;
import rw.rra.dqims.service.AuditLogService;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Audit Log Controller
 * 
 * Provides endpoints for viewing system audit logs.
 * Admin can see all logs, other users see only their own logs.
 * 
 * Features:
 * - View all audit logs
 * - Filter by user
 * - Filter by action type
 * - Filter by date range
 * - Filter by entity type
 */
@RestController
@RequestMapping("/api/v1/audit-logs")
public class AuditLogController {
    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    /**
     * Get all audit logs (with optional filters)
     * 
     * Query Parameters:
     * - userId: Filter by specific user
     * - action: Filter by action type (LOGIN, ISSUE_CREATED, etc.)
     * - entityType: Filter by entity (Issue, User, Department)
     * - startDate: Filter from date (ISO format)
     * - endDate: Filter to date (ISO format)
     * 
     * Admin sees all logs, others see only their own
     */
    @GetMapping
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return ResponseEntity.ok(auditLogService.getAuditLogs(userId, action, entityType, startDate, endDate));
    }

    /**
     * Get audit logs for a specific issue
     */
    @GetMapping("/issue/{issueId}")
    public ResponseEntity<List<AuditLogResponse>> getIssueAuditLogs(@PathVariable Long issueId) {
        return ResponseEntity.ok(auditLogService.getIssueAuditLogs(issueId));
    }

    /**
     * Get audit logs for a specific user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogResponse>> getUserAuditLogs(@PathVariable Long userId) {
        return ResponseEntity.ok(auditLogService.getUserAuditLogs(userId));
    }

    /**
     * Get available action types for filtering
     */
    @GetMapping("/actions")
    public ResponseEntity<List<String>> getActionTypes() {
        return ResponseEntity.ok(auditLogService.getDistinctActions());
    }

    /**
     * Get available entity types for filtering
     */
    @GetMapping("/entity-types")
    public ResponseEntity<List<String>> getEntityTypes() {
        return ResponseEntity.ok(auditLogService.getDistinctEntityTypes());
    }
}
