package rw.rra.dqims.dto.response;

import java.time.LocalDateTime;

public record IssueResponse(Long id, String title, String description, String source, String dataElement, String issueType, String severity, String priority, String status, String department, Long reportedBy, String reportedByName, Long assignedTo, String assignedToName, Boolean isDelegated, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime resolvedAt, LocalDateTime closedAt) {}
