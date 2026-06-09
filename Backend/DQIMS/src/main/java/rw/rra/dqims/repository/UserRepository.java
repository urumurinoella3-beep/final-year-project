package rw.rra.dqims.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.rra.dqims.entity.*;
import java.util.*;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmployeeId(String employeeId);
    long countByDepartmentAndRoleAndIsActiveTrue(String department, rw.rra.dqims.entity.enums.UserRole role);
    List<User> findByDepartmentAndIsActiveTrue(String department);
    List<User> findByDepartmentAndRole(String department, rw.rra.dqims.entity.enums.UserRole role);
}
