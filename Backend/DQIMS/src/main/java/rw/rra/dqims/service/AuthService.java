package rw.rra.dqims.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.rra.dqims.dto.request.ChangePasswordRequest;
import rw.rra.dqims.dto.request.ForgotPasswordRequest;
import rw.rra.dqims.dto.request.LoginRequest;
import rw.rra.dqims.dto.request.ResetPasswordRequest;
import rw.rra.dqims.dto.response.LoginResponse;
import rw.rra.dqims.dto.response.UserResponse;
import rw.rra.dqims.entity.PasswordHistory;
import rw.rra.dqims.entity.User;
import rw.rra.dqims.exception.BadRequestException;
import rw.rra.dqims.exception.ResourceNotFoundException;
import rw.rra.dqims.repository.PasswordHistoryRepository;
import rw.rra.dqims.repository.UserRepository;
import rw.rra.dqims.security.JwtTokenProvider;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordHistoryRepository passwordHistoryRepository;
    private final CurrentUserService currentUserService;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, PasswordHistoryRepository passwordHistoryRepository, CurrentUserService currentUserService, AuditLogService auditLogService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordHistoryRepository = passwordHistoryRepository;
        this.currentUserService = currentUserService;
        this.auditLogService = auditLogService;
        this.emailService = emailService;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!Boolean.TRUE.equals(user.getIsActive()) || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid credentials");
        }
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        auditLogService.log(user, "LOGIN", "USER", user.getId(), "User logged in: " + user.getEmail());
        return new LoginResponse(token, toUserResponse(user));
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = currentUserService.getCurrentUser();
        if (!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }
        String newHash = passwordEncoder.encode(request.newPassword());
        passwordHistoryRepository.save(PasswordHistory.builder().user(user).passwordHash(user.getPasswordHash()).build());
        user.setPasswordHash(newHash);
        user.setIsFirstLogin(false);
        userRepository.save(user);
        
        // Send password change confirmation email
        emailService.notifyPasswordChanged(user);
        
        auditLogService.log(user, "CHANGE_PASSWORD", "USER", user.getId(), "Password changed successfully");
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String resetToken = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        
        // Send password reset email with token
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetToken);
        
        auditLogService.log(user, "FORGOT_PASSWORD", "USER", user.getId(), "Password reset token generated and sent via email");
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findAll().stream()
                .filter(u -> request.token().equals(u.getPasswordResetToken()))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Invalid token"));
        if (user.getPasswordResetExpiry() == null || user.getPasswordResetExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token expired");
        }
        passwordHistoryRepository.save(PasswordHistory.builder().user(user).passwordHash(user.getPasswordHash()).build());
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiry(null);
        user.setIsFirstLogin(false);
        userRepository.save(user);
        
        // Send password change confirmation email
        emailService.notifyPasswordChanged(user);
        
        auditLogService.log(user, "RESET_PASSWORD", "USER", user.getId(), "Password reset successfully using token");
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getEmployeeId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole(), user.getDepartment(), user.getIsActive(), user.getIsFirstLogin());
    }

    public UserResponse me() {
        return toUserResponse(currentUserService.getCurrentUser());
    }
}
