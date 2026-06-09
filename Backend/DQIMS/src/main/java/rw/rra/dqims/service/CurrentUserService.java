package rw.rra.dqims.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import rw.rra.dqims.entity.User;
import rw.rra.dqims.exception.UnauthorizedException;

@Service
public class CurrentUserService {
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication() == null ? null : SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user;
        }
        throw new UnauthorizedException("Unauthorized");
    }
}
