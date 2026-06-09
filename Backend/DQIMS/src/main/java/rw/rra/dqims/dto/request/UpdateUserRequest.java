package rw.rra.dqims.dto.request;

import rw.rra.dqims.entity.enums.UserRole;

public record UpdateUserRequest(
        String employeeId,
        String name,
        String email,
        String phone,
        UserRole role,
        String department,
        Boolean isActive
) {}
