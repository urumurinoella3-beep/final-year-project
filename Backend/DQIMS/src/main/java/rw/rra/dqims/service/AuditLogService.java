package rw.rra.dqims.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import rw.rra.dqims.dto.response.AuditLogResponse;
import rw.rra.dqims.entity.AuditLog;
import rw.rra.dqims.entity.User;
import rw.rra.dqims.entity.enums.UserRole;
import rw.rra.dqims.exception.ResourceNotFoundException;
import rw.rra.dqims.repository.AuditLogRepository;
import rw.rra.dqims.repository.UserRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Audit Log Service
 * 
 * Handles all audit logging functionality:
 * - Recording user actions
 * - Retrieving audit logs with filters
 * - Tracking system activities
 * 
 * Every important action in the system creates an audit log entry.
 */
@Service
public class AuditLogService {
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public AuditLogService(AuditLogRepository auditLogRepository, 
                          UserRepository userRepository,
                          CurrentUserService currentUserService) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    /**
     * Get audit logs with optional filters
     * Admin sees all logs, others see only their own
     */
    public List<AuditLogResponse> getAuditLogs(Long userId, String action, String entityType, 
                                               LocalDateTime startDate, LocalDateTime endDate) {
        User currentUser = currentUserService.getCurrentUser();
        List<AuditLog> logs;

        // Admin can see all logs, others only their own
        if (currentUser.getRole() == UserRole.ADMIN) {
            logs = auditLogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        } else {
            logs = auditLogRepository.findByUserOrderByCreatedAtDesc(currentUser);
        }

        // Apply filters
        if (userId != null && currentUser.getRole() == UserRole.ADMIN) {
            logs = logs.stream()
                    .filter(log -> log.getUser().getId().equals(userId))
                    .collect(Collectors.toList());
        }

        if (action != null && !action.isEmpty()) {
            logs = logs.stream()
                    .filter(log -> log.getAction().equalsIgnoreCase(action))
                    .collect(Collectors.toList());
        }

        if (entityType != null && !entityType.isEmpty()) {
            logs = logs.stream()
                    .filter(log -> entityType.equalsIgnoreCase(log.getEntityType()))
                    .collect(Collectors.toList());
        }

        if (startDate != null) {
            logs = logs.stream()
                    .filter(log -> log.getCreatedAt().isAfter(startDate) || log.getCreatedAt().isEqual(startDate))
                    .collect(Collectors.toList());
        }

        if (endDate != null) {
            logs = logs.stream()
                    .filter(log -> log.getCreatedAt().isBefore(endDate) || log.getCreatedAt().isEqual(endDate))
                    .collect(Collectors.toList());
        }

        return logs.stream().map(this::toResponse).toList();
    }

    /**
     * Get audit logs for a specific issue (entity type stored as ISSUE)
     */
    public List<AuditLogResponse> getIssueAuditLogs(Long issueId) {
        return auditLogRepository
                .findByEntityTypeIgnoreCaseAndEntityIdOrderByCreatedAtDesc("ISSUE", issueId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Get audit logs for a specific user
     */
    public List<AuditLogResponse> getUserAuditLogs(Long userId) {
        User currentUser = currentUserService.getCurrentUser();
        
        // Only admin can view other users' logs
        if (currentUser.getRole() != UserRole.ADMIN && !currentUser.getId().equals(userId)) {
            throw new ResourceNotFoundException("Not authorized to view this user's audit logs");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return auditLogRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Get distinct action types for filtering
     */
    public List<String> getDistinctActions() {
        return auditLogRepository.findAll()
                .stream()
                .map(AuditLog::getAction)
                .distinct()
                .sorted()
                .toList();
    }

    /**
     * Get distinct entity types for filtering
     */
    public List<String> getDistinctEntityTypes() {
        return auditLogRepository.findAll()
                .stream()
                .map(AuditLog::getEntityType)
                .filter(type -> type != null && !type.isEmpty())
                .distinct()
                .sorted()
                .toList();
    }

    /**
     * Records an audit log entry
     * Called from other services when important actions occur
     * 
     * @param user The user who performed the action
     * @param action The action type (LOGIN, ISSUE_CREATED, STATUS_CHANGED, etc.)
     * @param entityType The type of entity affected (Issue, User, Department, etc.)
     * @param entityId The ID of the affected entity
     * @param details Additional details in JSON format
     */
    public void log(User user, String action, String entityType, Long entityId, String details) {
        AuditLog entry = AuditLog.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .ipAddress(getCurrentIpAddress())
                .userAgent(getCurrentUserAgent())
                .build();
        auditLogRepository.save(entry);
    }

    /**
     * Simplified log method without entity details
     */
    public void log(User user, String action, String details) {
        log(user, action, null, null, details);
    }

    /**
     * Log with entity type and ID
     */
    public void log(User user, String action, String entityType, Long entityId) {
        log(user, action, entityType, entityId, null);
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getUser().getId(),
                log.getUser().getName(),
                log.getUser().getRole().name(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getDetails(),
                log.getIpAddress(),
                log.getUserAgent(),
                log.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
    }

    /**
     * Get current user's IP address (placeholder - implement based on your setup)
     */
    private String getCurrentIpAddress() {
        // TODO: Implement actual IP address retrieval from HttpServletRequest
        return "127.0.0.1";
    }

    /**
     * Get current user's user agent (placeholder - implement based on your setup)
     */
    private String getCurrentUserAgent() {
        // TODO: Implement actual user agent retrieval from HttpServletRequest
        return "Mozilla/5.0";
    }
}
