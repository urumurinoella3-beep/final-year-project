package rw.rra.dqims.dto.response;

import java.util.List;

public record NotificationResponse(List<Item> notifications, long unreadCount) {
    public record Item(Long id, String type, String title, String message, Long issueId, boolean read, String createdAt) {}
}
