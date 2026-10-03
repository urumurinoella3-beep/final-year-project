package rw.rra.dqims.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record ValidationSessionResponse(
    Long id,
    String fileName,
    Integer totalRecords,
    Integer passedRecords,
    Integer failedRecords,
    LocalDateTime createdAt,
    List<ValidationErrorResponse> errors,
    List<PreviewDataResponse> previewData
) {}
