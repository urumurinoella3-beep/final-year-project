package rw.rra.dqims.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import rw.rra.dqims.entity.Issue;
import rw.rra.dqims.entity.User;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    Page<Issue> findByDepartment(String department, Pageable pageable);
    Page<Issue> findByAssignedTo(User user, Pageable pageable);
}
