package rw.rra.dqims.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AddCommentRequest(@NotBlank String content) {}
