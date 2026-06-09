package rw.rra.dqims.dto.response;

/**
 * Audit Log Response DTO
 * 
 * Contains all information about a logged action:
 * - Who performed the action (user)
 * - What action was performed
 * - When it happened
 * - What entity was affected
 * - Additional details
 * - IP address and user agent for security tracking
 */
public record AuditLogResponse(
        Long id,
        Long userId,
        String userName,
        String userRole,
        String action,
        String entityType,
        Long entityId,
        String details,
        String ipAddress,
        String userAgent,
        String createdAt
) {}
