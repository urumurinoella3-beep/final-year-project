package rw.rra.dqims.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.rra.dqims.entity.User;
import rw.rra.dqims.entity.ValidationSession;

import java.util.List;

@Repository
public interface ValidationSessionRepository extends JpaRepository<ValidationSession, Long> {
    List<ValidationSession> findByUserOrderByCreatedAtDesc(User user);
    Page<ValidationSession> findByUser(User user, Pageable pageable);
    Page<ValidationSession> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
