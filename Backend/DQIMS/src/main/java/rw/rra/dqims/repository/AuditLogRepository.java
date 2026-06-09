package rw.rra.dqims.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.rra.dqims.entity.AuditLog;
import rw.rra.dqims.entity.User;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserOrderByCreatedAtDesc(User user);

    List<AuditLog> findByEntityTypeIgnoreCaseAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);
}
