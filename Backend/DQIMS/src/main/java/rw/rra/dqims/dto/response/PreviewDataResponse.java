package rw.rra.dqims.dto.response;

import java.util.Map;

public record PreviewDataResponse(
    Integer row,
    Map<String, String> data
) {}
