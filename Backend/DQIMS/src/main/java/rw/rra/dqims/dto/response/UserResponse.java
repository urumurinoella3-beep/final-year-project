package rw.rra.dqims.dto.response;

import rw.rra.dqims.entity.enums.UserRole;

public record UserResponse(Long id, String employeeId, String name, String email, String phone, UserRole role, String department, Boolean isActive, Boolean isFirstLogin) {}
