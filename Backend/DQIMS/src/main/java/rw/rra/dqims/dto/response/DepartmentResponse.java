package rw.rra.dqims.dto.response;

public record DepartmentResponse(
        Long id,
        String name,
        String description,
        Boolean isActive
) {}
