package rw.rra.dqims.service;

import org.springframework.stereotype.Service;
import rw.rra.dqims.dto.response.NotificationResponse;
import rw.rra.dqims.entity.Notification;
import rw.rra.dqims.entity.User;
import rw.rra.dqims.repository.NotificationRepository;

import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final CurrentUserService currentUserService;

    public NotificationService(NotificationRepository notificationRepository, CurrentUserService currentUserService) {
        this.notificationRepository = notificationRepository;
        this.currentUserService = currentUserService;
    }

    public NotificationResponse getMyNotifications() {
        User user = currentUserService.getCurrentUser();
        var list = notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toItem)
                .toList();
        return new NotificationResponse(list, notificationRepository.countByUserAndIsReadFalse(user));
    }

    public void markAsRead(Long id) {
        User user = currentUserService.getCurrentUser();
        Notification n = notificationRepository.findById(id).orElseThrow(() -> new rw.rra.dqims.exception.ResourceNotFoundException("Notification not found"));
        if (!n.getUser().getId().equals(user.getId())) {
            throw new rw.rra.dqims.exception.UnauthorizedException("Not allowed");
        }
        n.setIsRead(true);
        n.setReadAt(LocalDateTime.now());
        notificationRepository.save(n);
    }

    public void markAllAsRead() {
        User user = currentUserService.getCurrentUser();
        var list = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        list.forEach(n -> {
            n.setIsRead(true);
            if (n.getReadAt() == null) {
                n.setReadAt(LocalDateTime.now());
            }
        });
        notificationRepository.saveAll(list);
    }

    private NotificationResponse.Item toItem(Notification n) {
        return new NotificationResponse.Item(n.getId(), n.getType().name(), n.getTitle(), n.getMessage(), n.getIssue() == null ? null : n.getIssue().getId(), Boolean.TRUE.equals(n.getIsRead()), n.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
    }
}
