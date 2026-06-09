package rw.rra.dqims.dto.request;

import jakarta.validation.constraints.*;
import rw.rra.dqims.entity.enums.UserRole;

public record CreateUserRequest(
        @NotBlank String employeeId,
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank String phone,
        @NotNull UserRole role,
        @NotBlank String department
) {}
