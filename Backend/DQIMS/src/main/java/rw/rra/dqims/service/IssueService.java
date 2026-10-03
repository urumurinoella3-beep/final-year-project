package rw.rra.dqims.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.rra.dqims.dto.request.CreateIssueRequest;
import rw.rra.dqims.dto.request.UpdateIssueRequest;
import rw.rra.dqims.dto.response.IssueCommentResponse;
import rw.rra.dqims.dto.response.IssueResponse;
import rw.rra.dqims.entity.Issue;
import rw.rra.dqims.entity.IssueComment;
import rw.rra.dqims.entity.Notification;
import rw.rra.dqims.entity.User;
import rw.rra.dqims.entity.enums.IssueStatus;
import rw.rra.dqims.entity.enums.NotificationType;
import rw.rra.dqims.entity.enums.UserRole;
import rw.rra.dqims.exception.ResourceNotFoundException;
import rw.rra.dqims.repository.IssueCommentRepository;
import rw.rra.dqims.repository.IssueRepository;
import rw.rra.dqims.repository.NotificationRepository;
import rw.rra.dqims.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IssueService {
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final IssueCommentRepository issueCommentRepository;
    private final AuditLogService auditLogService;
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public IssueService(IssueRepository issueRepository, UserRepository userRepository, CurrentUserService currentUserService, IssueCommentRepository issueCommentRepository, AuditLogService auditLogService, NotificationRepository notificationRepository, EmailService emailService) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.issueCommentRepository = issueCommentRepository;
        this.auditLogService = auditLogService;
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    public Page<IssueResponse> getIssues(Pageable pageable) {
        User me = currentUserService.getCurrentUser();
        Page<Issue> page;
        if (me.getRole() == UserRole.ADMIN) {
            page = issueRepository.findAll(pageable);
        } else if (me.getRole() == UserRole.HOD) {
            page = issueRepository.findByDepartment(me.getDepartment(), pageable);
        } else {
            // STAFF: Show issues they are assigned to OR issues they reported
            page = issueRepository.findByAssignedToOrReportedBy(me, me, pageable);
        }
        return page.map(this::toResponse);
    }

    @Transactional
    public IssueResponse create(CreateIssueRequest req) {
        User me = currentUserService.getCurrentUser();
        User assigned = req.assignedTo() == null ? null : userRepository.findById(req.assignedTo()).orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

        Issue issue = Issue.builder()
                .title(req.title())
                .description(req.description())
                .source(req.source())
                .dataElement("N/A")  // Default value since field removed from form
                .issueType(req.issueType())
                .severity("MEDIUM")  // Default value since field removed from form
                .priority(req.priority())
                .department(req.department())
                .status(IssueStatus.OPEN)
                .reportedBy(me)
                .assignedTo(assigned)
                .isDelegated(false)
                .build();
        Issue savedIssue = issueRepository.save(issue);
        
        // Create in-system notification for assigned user
        if (assigned != null) {
            createNotification(assigned, "ISSUE_ASSIGNED", "New Issue Assigned", 
                "You have been assigned to issue: " + issue.getTitle(), savedIssue);
            // Send email notification
            emailService.notifyIssueAssigned(assigned, savedIssue, me);
        }
        
        // Create in-system notification for reporter (confirmation)
        createNotification(me, "ISSUE_CREATED", "Issue Created Successfully", 
            "Your issue '" + issue.getTitle() + "' has been created successfully", savedIssue);
        
        // Notify HOD of the department about new issue
        notifyDepartmentHOD(savedIssue, me, "New Issue Created in Your Department");
        
        IssueResponse resp = toResponse(savedIssue);
        auditLogService.log(me, "CREATE_ISSUE", "ISSUE", savedIssue.getId(), "Created issue: " + savedIssue.getTitle());
        return resp;
    }

    @Transactional
    public IssueResponse update(Long id, UpdateIssueRequest req) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        User me = currentUserService.getCurrentUser();
        User oldAssignee = issue.getAssignedTo();
        String oldStatus = issue.getStatus().name();
        String oldPriority = issue.getPriority();
        
        if (req.title() != null) issue.setTitle(req.title());
        if (req.description() != null) issue.setDescription(req.description());
        
        // Handle priority change
        if (req.priority() != null && !req.priority().equals(oldPriority)) {
            issue.setPriority(req.priority());
            
            // Create in-system notification for assigned user about priority change
            if (issue.getAssignedTo() != null && !issue.getAssignedTo().getId().equals(me.getId())) {
                createNotification(issue.getAssignedTo(), "ISSUE_PRIORITY_CHANGED", "Issue Priority Changed", 
                    "Priority changed from " + oldPriority + " to " + req.priority() + " for issue: " + issue.getTitle(), issue);
                emailService.notifyIssuePriorityChanged(issue.getAssignedTo(), issue, oldPriority, req.priority(), me);
            }
            
            // Notify reporter about priority change
            if (!issue.getReportedBy().getId().equals(me.getId())) {
                createNotification(issue.getReportedBy(), "ISSUE_PRIORITY_CHANGED", "Issue Priority Changed", 
                    "Priority changed from " + oldPriority + " to " + req.priority() + " for your issue: " + issue.getTitle(), issue);
                emailService.notifyIssuePriorityChanged(issue.getReportedBy(), issue, oldPriority, req.priority(), me);
            }
        }
        
        // Handle status change
        if (req.status() != null) {
            IssueStatus newStatus = IssueStatus.valueOf(req.status());
            issue.setStatus(newStatus);
            
            if (IssueStatus.RESOLVED.name().equals(req.status())) {
                issue.setResolvedAt(LocalDateTime.now());
                
                // Create in-system notification for reporter about resolution
                createNotification(issue.getReportedBy(), "ISSUE_RESOLVED", "Issue Resolved", 
                    "Your issue '" + issue.getTitle() + "' has been marked as resolved", issue);
                emailService.notifyIssueResolved(issue.getReportedBy(), issue, me);
                
                // Notify HOD
                notifyDepartmentHOD(issue, me, "Issue Resolved");
            }
            
            if (IssueStatus.CLOSED.name().equals(req.status())) {
                issue.setClosedAt(LocalDateTime.now());
                
                // Create in-system notification for reporter about closure
                createNotification(issue.getReportedBy(), "ISSUE_CLOSED", "Issue Closed", 
                    "Your issue '" + issue.getTitle() + "' has been closed", issue);
                emailService.notifyIssueClosed(issue.getReportedBy(), issue, me);
                
                // Notify assignee about closure
                if (issue.getAssignedTo() != null && !issue.getAssignedTo().getId().equals(issue.getReportedBy().getId())) {
                    createNotification(issue.getAssignedTo(), "ISSUE_CLOSED", "Issue Closed", 
                        "Issue '" + issue.getTitle() + "' has been closed", issue);
                    emailService.notifyIssueClosed(issue.getAssignedTo(), issue, me);
                }
            }
            
            // Notify about general status change
            if (!oldStatus.equals(req.status())) {
                if (issue.getAssignedTo() != null && !issue.getAssignedTo().getId().equals(me.getId())) {
                    createNotification(issue.getAssignedTo(), "ISSUE_STATUS_CHANGED", "Issue Status Updated", 
                        "Status changed from " + oldStatus + " to " + req.status() + " for issue: " + issue.getTitle(), issue);
                    emailService.notifyIssueStatusChanged(issue.getAssignedTo(), issue, oldStatus, req.status(), me);
                }
                if (!issue.getReportedBy().getId().equals(me.getId())) {
                    createNotification(issue.getReportedBy(), "ISSUE_STATUS_CHANGED", "Issue Status Updated", 
                        "Status changed from " + oldStatus + " to " + req.status() + " for your issue: " + issue.getTitle(), issue);
                    emailService.notifyIssueStatusChanged(issue.getReportedBy(), issue, oldStatus, req.status(), me);
                }
            }
        }
        
        // Handle assignee change
        if (req.assignedTo() != null) {
            User assigned = userRepository.findById(req.assignedTo()).orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));
            issue.setAssignedTo(assigned);
            
            // Send notification if assignee changed
            if (oldAssignee == null || !oldAssignee.getId().equals(assigned.getId())) {
                createNotification(assigned, "ISSUE_ASSIGNED", "Issue Assigned to You", 
                    "You have been assigned to issue: " + issue.getTitle(), issue);
                emailService.notifyIssueAssigned(assigned, issue, me);
                
                // Notify old assignee if exists
                if (oldAssignee != null) {
                    createNotification(oldAssignee, "ISSUE_REASSIGNED", "Issue Reassigned", 
                        "Issue '" + issue.getTitle() + "' has been reassigned to " + assigned.getName(), issue);
                }
            }
        }
        
        Issue savedIssue = issueRepository.save(issue);
        IssueResponse resp = toResponse(savedIssue);
        StringBuilder auditDetail = new StringBuilder("Updated issue #").append(id);
        if (req.status() != null) {
            auditDetail.append(" — Status: ").append(req.status());
        }
        auditLogService.log(me, "UPDATE_ISSUE", "ISSUE", id, auditDetail.toString());
        return resp;
    }

    @Transactional
    public IssueResponse close(Long id) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        User me = currentUserService.getCurrentUser();
        issue.setStatus(IssueStatus.CLOSED);
        issue.setClosedAt(LocalDateTime.now());
        issue.setClosedBy(me);
        Issue savedIssue = issueRepository.save(issue);
        
        // Create in-system notifications for all relevant parties
        createNotification(issue.getReportedBy(), "ISSUE_CLOSED", "Issue Closed", 
            "Your issue '" + issue.getTitle() + "' has been closed", savedIssue);
        emailService.notifyIssueClosed(issue.getReportedBy(), savedIssue, me);
        
        if (issue.getAssignedTo() != null && !issue.getAssignedTo().getId().equals(issue.getReportedBy().getId())) {
            createNotification(issue.getAssignedTo(), "ISSUE_CLOSED", "Issue Closed", 
                "Issue '" + issue.getTitle() + "' has been closed", savedIssue);
            emailService.notifyIssueClosed(issue.getAssignedTo(), savedIssue, me);
        }
        
        IssueResponse resp = toResponse(savedIssue);
        auditLogService.log(me, "CLOSE_ISSUE", "ISSUE", id, "Closed issue: " + issue.getTitle());
        return resp;
    }

    @Transactional
    public void addComment(Long issueId, String content) {
        Issue issue = issueRepository.findById(issueId).orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        User me = currentUserService.getCurrentUser();
        IssueComment c = IssueComment.builder().issue(issue).user(me).content(content).build();
        issueCommentRepository.save(c);
        
        String safe = content == null ? "" : content.trim();
        
        // Create in-system notification for reporter if commenter is not the reporter
        if (!issue.getReportedBy().getId().equals(me.getId())) {
            createNotification(issue.getReportedBy(), "COMMENT_ADDED", "New Comment on Your Issue", 
                me.getName() + " commented on '" + issue.getTitle() + "'", issue);
            emailService.notifyCommentAdded(issue.getReportedBy(), issue, me, safe);
        }
        
        // Create in-system notification for assignee if commenter is not the assignee
        if (issue.getAssignedTo() != null && !issue.getAssignedTo().getId().equals(me.getId())) {
            createNotification(issue.getAssignedTo(), "COMMENT_ADDED", "New Comment on Issue", 
                me.getName() + " commented on '" + issue.getTitle() + "'", issue);
            emailService.notifyCommentAdded(issue.getAssignedTo(), issue, me, safe);
        }
        
        // Notify HOD if commenter is not the HOD
        notifyDepartmentHOD(issue, me, "New Comment on Issue");
        
        String detail = me.getName() + " commented: " + safe;
        auditLogService.log(me, "ADD_COMMENT", "ISSUE", issueId, detail);
    }

    public List<IssueCommentResponse> getComments(Long issueId) {
        Issue issue = issueRepository.findById(issueId).orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        return issueCommentRepository.findByIssueOrderByCreatedAtAsc(issue).stream()
                .map(c -> new IssueCommentResponse(
                        c.getId(),
                        issueId,
                        c.getUser().getId(),
                        c.getUser().getName(),
                        c.getUser().getRole().name(),
                        c.getContent(),
                        c.getIsEdited(),
                        c.getCreatedAt(),
                        c.getUpdatedAt()))
                .toList();
    }

    private IssueResponse toResponse(Issue i) {
        return new IssueResponse(i.getId(), i.getTitle(), i.getDescription(), i.getSource(), i.getDataElement(), i.getIssueType(), i.getSeverity(), i.getPriority(), i.getStatus().name(), i.getDepartment(), i.getReportedBy().getId(), i.getReportedBy().getName(), i.getAssignedTo() == null ? null : i.getAssignedTo().getId(), i.getAssignedTo() == null ? null : i.getAssignedTo().getName(), i.getIsDelegated(), i.getCreatedAt(), i.getUpdatedAt(), i.getResolvedAt(), i.getClosedAt());
    }
    
    private void createNotification(User user, String type, String title, String message, Issue issue) {
        Notification notification = Notification.builder()
                .user(user)
                .type(NotificationType.valueOf(type))
                .title(title)
                .message(message)
                .issue(issue)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
    
    /**
     * Notify HOD of the department about issue events
     */
    private void notifyDepartmentHOD(Issue issue, User actor, String eventType) {
        try {
            // Find HOD of the issue's department
            List<User> hods = userRepository.findByDepartmentAndRole(issue.getDepartment(), UserRole.HOD);
            for (User hod : hods) {
                // Don't notify HOD if they are the actor
                if (!hod.getId().equals(actor.getId())) {
                    // Create in-system notification for HOD
                    createNotification(hod, "ISSUE_DEPARTMENT_UPDATE", eventType, 
                        eventType + " in " + issue.getDepartment() + " department: " + issue.getTitle(), issue);
                    
                    // Send email notification
                    emailService.notifyIssueCreated(hod, issue, actor);
                }
            }
        } catch (Exception e) {
            // Log but don't fail if HOD notification fails
            System.err.println("Failed to notify HOD: " + e.getMessage());
        }
    }
}
