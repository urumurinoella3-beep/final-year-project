package rw.rra.dqims.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateIssueRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String source,
        @NotBlank String dataElement,
        @NotBlank String issueType,
        @NotBlank String severity,
        @NotBlank String priority,
        @NotBlank String department,
        Long assignedTo
) {}
