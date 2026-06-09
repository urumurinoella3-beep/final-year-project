package rw.rra.dqims.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rw.rra.dqims.dto.request.CreateUserRequest;
import rw.rra.dqims.dto.request.UpdateUserRequest;
import rw.rra.dqims.dto.response.UserResponse;
import rw.rra.dqims.entity.User;
import rw.rra.dqims.exception.BadRequestException;
import rw.rra.dqims.exception.ResourceNotFoundException;
import rw.rra.dqims.repository.UserRepository;
import rw.rra.dqims.util.PasswordGenerator;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;
    private final EmailService emailService;
    private final rw.rra.dqims.repository.NotificationRepository notificationRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthService authService, AuditLogService auditLogService, CurrentUserService currentUserService, EmailService emailService, rw.rra.dqims.repository.NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
        this.auditLogService = auditLogService;
        this.currentUserService = currentUserService;
        this.emailService = emailService;
        this.notificationRepository = notificationRepository;
    }

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(authService::toUserResponse).toList();
    }

    public List<UserResponse> getByDepartment(String department) {
        return userRepository.findByDepartmentAndIsActiveTrue(department)
                .stream()
                .map(authService::toUserResponse)
                .toList();
    }

    public UserResponse create(CreateUserRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(u -> { throw new BadRequestException("Email already exists"); });
        userRepository.findByEmployeeId(request.employeeId()).ifPresent(u -> { throw new BadRequestException("Employee ID already exists"); });

        // Validate HOD constraint: Only one HOD per department
        if (request.role() == rw.rra.dqims.entity.enums.UserRole.HOD) {
            long existingHodCount = userRepository.countByDepartmentAndRoleAndIsActiveTrue(
                request.department(), 
                rw.rra.dqims.entity.enums.UserRole.HOD
            );
            if (existingHodCount > 0) {
                throw new BadRequestException(
                    "A Head of Department (HOD) already exists for " + request.department() + 
                    " department. Each department can only have one HOD."
                );
            }
        }

        // Generate temporary password
        String tempPassword = PasswordGenerator.generate(12);
        
        User user = User.builder()
                .employeeId(request.employeeId())
                .name(request.name())
                .email(request.email())
                .phone(request.phone())
                .role(request.role())
                .department(request.department())
                .passwordHash(passwordEncoder.encode(tempPassword))
                .isActive(true)
                .isFirstLogin(true)
                .build();

        User savedUser = userRepository.save(user);
        
        // Create in-system notification
        createNotification(savedUser, "ACCOUNT_CREATED", "Welcome to DQIMS!", 
            "Your account has been created. Please check your email for login credentials.");
        
        // Send welcome email with credentials
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getName(), tempPassword);
        
        UserResponse resp = authService.toUserResponse(savedUser);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_USER", "USER", savedUser.getId(), "Created user: " + savedUser.getEmail() + " and sent credentials via email");
        return resp;
    }

    public void delete(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        User deactivatedBy = currentUserService.getCurrentUser();
        user.setIsActive(false);
        userRepository.save(user);
        
        // Create in-system notification
        createNotification(user, "ACCOUNT_DEACTIVATED", "Account Deactivated", 
            "Your account has been deactivated by " + deactivatedBy.getName());
        
        // Send deactivation email
        emailService.notifyAccountDeactivated(user, deactivatedBy);
        
        auditLogService.log(deactivatedBy, "DELETE_USER", "USER", id, "Deactivated user: " + user.getEmail());
    }

    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Validate HOD constraint when updating role to HOD or changing department for a HOD
        if (request.role() == rw.rra.dqims.entity.enums.UserRole.HOD || 
            (user.getRole() == rw.rra.dqims.entity.enums.UserRole.HOD && request.department() != null)) {
            
            String targetDepartment = request.department() != null ? request.department() : user.getDepartment();
            rw.rra.dqims.entity.enums.UserRole targetRole = request.role() != null ? request.role() : user.getRole();
            
            if (targetRole == rw.rra.dqims.entity.enums.UserRole.HOD) {
                long existingHodCount = userRepository.countByDepartmentAndRoleAndIsActiveTrue(
                    targetDepartment, 
                    rw.rra.dqims.entity.enums.UserRole.HOD
                );
                
                // Allow update if the existing HOD is the current user being updated
                boolean isCurrentUserTheExistingHod = user.getRole() == rw.rra.dqims.entity.enums.UserRole.HOD 
                                                       && user.getDepartment().equals(targetDepartment);
                
                if (existingHodCount > 0 && !isCurrentUserTheExistingHod) {
                    throw new BadRequestException(
                        "A Head of Department (HOD) already exists for " + targetDepartment + 
                        " department. Each department can only have one HOD."
                    );
                }
            }
        }
        
        StringBuilder changedFields = new StringBuilder();
        
        if (request.employeeId() != null) {
            user.setEmployeeId(request.employeeId());
            changedFields.append("Employee ID, ");
        }
        if (request.name() != null) {
            user.setName(request.name());
            changedFields.append("Name, ");
        }
        if (request.email() != null) {
            user.setEmail(request.email());
            changedFields.append("Email, ");
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
            changedFields.append("Phone, ");
        }
        if (request.role() != null) {
            user.setRole(request.role());
            changedFields.append("Role, ");
        }
        if (request.department() != null) {
            user.setDepartment(request.department());
            changedFields.append("Department, ");
        }
        if (request.isActive() != null) {
            user.setIsActive(request.isActive());
            changedFields.append("Status, ");
        }
        
        User savedUser = userRepository.save(user);
        
        // Notify user about account updates
        if (changedFields.length() > 0) {
            String fields = changedFields.substring(0, changedFields.length() - 2);
            
            // Create in-system notification
            createNotification(savedUser, "ACCOUNT_UPDATED", "Account Updated", 
                "Your account information has been updated: " + fields);
            
            // Send email notification
            emailService.notifyAccountUpdated(savedUser, fields);
        }
        
        UserResponse resp = authService.toUserResponse(savedUser);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_USER", "USER", id, "Updated user: " + user.getEmail());
        return resp;
    }
    
    /**
     * Create in-system notification for user
     */
    private void createNotification(User user, String type, String title, String message) {
        try {
            rw.rra.dqims.entity.Notification notification = rw.rra.dqims.entity.Notification.builder()
                    .user(user)
                    .type(rw.rra.dqims.entity.enums.NotificationType.valueOf(type))
                    .title(title)
                    .message(message)
                    .issue(null)
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        } catch (Exception e) {
            // Log but don't fail if notification creation fails
            System.err.println("Failed to create notification: " + e.getMessage());
        }
    }
}
