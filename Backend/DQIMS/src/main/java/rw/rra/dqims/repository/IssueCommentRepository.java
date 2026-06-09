package rw.rra.dqims.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.rra.dqims.entity.*;
import java.util.List;

public interface IssueCommentRepository extends JpaRepository<IssueComment, Long> {
    List<IssueComment> findByIssueOrderByCreatedAtAsc(Issue issue);
}
