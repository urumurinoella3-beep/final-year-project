package rw.rra.dqims.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.rra.dqims.entity.PasswordHistory;
import rw.rra.dqims.entity.User;
import java.util.List;

public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory, Long> {
    List<PasswordHistory> findTop5ByUserOrderByCreatedAtDesc(User user);
}
