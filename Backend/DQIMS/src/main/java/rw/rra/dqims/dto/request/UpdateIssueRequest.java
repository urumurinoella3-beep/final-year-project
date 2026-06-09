package rw.rra.dqims.dto.request;

public record UpdateIssueRequest(
        String title,
        String description,
        String priority,
        String status,
        Long assignedTo
) {}
