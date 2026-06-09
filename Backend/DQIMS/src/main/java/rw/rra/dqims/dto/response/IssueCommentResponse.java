package rw.rra.dqims.dto.response;

import java.time.LocalDateTime;

public record IssueCommentResponse(
        Long id,
        Long issueId,
        Long userId,
        String userName,
        String userRole,
        String content,
        Boolean isEdited,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
