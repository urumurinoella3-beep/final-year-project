package rw.rra.dqims.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateDepartmentRequest(
        @NotBlank String name,
        String description
) {}
