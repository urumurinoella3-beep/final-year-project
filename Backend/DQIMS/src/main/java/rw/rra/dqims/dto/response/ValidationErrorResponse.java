package rw.rra.dqims.dto.response;

public record ValidationErrorResponse(
    Long id,
    Integer row,
    String errorType,
    String field,
    String description,
    String value
) {}
