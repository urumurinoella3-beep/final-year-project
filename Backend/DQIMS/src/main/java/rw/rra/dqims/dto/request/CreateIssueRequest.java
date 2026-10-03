package rw.rra.dqims.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateIssueRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String source,
        @NotBlank String issueType,
        @NotBlank String priority,
        @NotBlank String department,
        Long assignedTo
) {}
