package rw.rra.dqims.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.rra.dqims.entity.ValidationError;
import rw.rra.dqims.entity.ValidationSession;

import java.util.List;

@Repository
public interface ValidationErrorRepository extends JpaRepository<ValidationError, Long> {
    List<ValidationError> findBySessionOrderByRowNumberAsc(ValidationSession session);
    Long countBySession(ValidationSession session);
}
