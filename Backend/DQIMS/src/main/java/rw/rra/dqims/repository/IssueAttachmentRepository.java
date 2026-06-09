package rw.rra.dqims.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.rra.dqims.entity.*;
import java.util.List;

public interface IssueAttachmentRepository extends JpaRepository<IssueAttachment, Long> {
    List<IssueAttachment> findByIssue(Issue issue);
}
