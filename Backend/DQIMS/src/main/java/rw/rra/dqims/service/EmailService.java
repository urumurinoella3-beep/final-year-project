package rw.rra.dqims.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import rw.rra.dqims.entity.Issue;
import rw.rra.dqims.entity.User;

import java.time.format.DateTimeFormatter;

/**
 * Comprehensive Email Notification Service
 * Sends HTML emails for all system events
 */
@Service
public class EmailService {
    
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
    
    private final JavaMailSender mailSender;
    
    @Value("${app.mail.from:urumurinoella3@gmail.com}")
    private String fromEmail;
    
    @Value("${app.mail.from-name:DQIMS - RRA}")
    private String fromName;
    
    @Value("${app.notification.email.enabled:true}")
    private boolean emailEnabled;
    
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    /**
     * Send email asynchronously to avoid blocking main application flow
     */
    @Async
    public void sendEmailAsync(String to, String subject, String htmlContent) {
        if (!emailEnabled) {
            log.info("Email notifications disabled. Skipping email to: {}", to);
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML
            
            mailSender.send(message);
            log.info("✅ Email sent successfully to: {} | Subject: {}", to, subject);
            
        } catch (MessagingException e) {
            log.error("❌ Failed to send email to: {} | Error: {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("❌ Unexpected error sending email to: {} | Error: {}", to, e.getMessage());
        }
    }
    
    // ========== ISSUE NOTIFICATIONS ==========
    
    /**
     * Notify user when a new issue is created
     */
    public void notifyIssueCreated(User recipient, Issue issue, User creator) {
        String subject = "New Issue Created: " + issue.getTitle();
        String html = buildIssueCreatedEmail(issue, creator);
        sendEmailAsync(recipient.getEmail(), subject, html);
    }
    
    /**
     * Notify user when issue is assigned to them
     */
    public void notifyIssueAssigned(User assignee, Issue issue, User assigner) {
        String subject = "Issue Assigned to You: " + issue.getTitle();
        String html = buildIssueAssignedEmail(issue, assignee, assigner);
        sendEmailAsync(assignee.getEmail(), subject, html);
    }
    
    /**
     * Notify relevant parties when issue status changes
     */
    public void notifyIssueStatusChanged(User recipient, Issue issue, String oldStatus, String newStatus, User updater) {
        String subject = "Issue Status Updated: " + issue.getTitle();
        String html = buildIssueStatusChangedEmail(issue, oldStatus, newStatus, updater);
        sendEmailAsync(recipient.getEmail(), subject, html);
    }
    
    /**
     * Notify relevant parties when issue priority changes
     */
    public void notifyIssuePriorityChanged(User recipient, Issue issue, String oldPriority, String newPriority, User updater) {
        String subject = "Issue Priority Changed: " + issue.getTitle();
        String html = buildIssuePriorityChangedEmail(issue, oldPriority, newPriority, updater);
        sendEmailAsync(recipient.getEmail(), subject, html);
    }
    
    /**
     * Notify when a comment is added to an issue
     */
    public void notifyCommentAdded(User recipient, Issue issue, User commenter, String comment) {
        String subject = "New Comment on Issue: " + issue.getTitle();
        String html = buildCommentAddedEmail(issue, commenter, comment);
        sendEmailAsync(recipient.getEmail(), subject, html);
    }
    
    /**
     * Notify when issue is resolved
     */
    public void notifyIssueResolved(User recipient, Issue issue, User resolver) {
        String subject = "Issue Resolved: " + issue.getTitle();
        String html = buildIssueResolvedEmail(issue, resolver);
        sendEmailAsync(recipient.getEmail(), subject, html);
    }
    
    /**
     * Notify when issue is closed
     */
    public void notifyIssueClosed(User recipient, Issue issue, User closer) {
        String subject = "Issue Closed: " + issue.getTitle();
        String html = buildIssueClosedEmail(issue, closer);
        sendEmailAsync(recipient.getEmail(), subject, html);
    }
    
    // ========== USER MANAGEMENT NOTIFICATIONS ==========
    
    /**
     * Send welcome email to newly created user
     */
    public void sendWelcomeEmail(String email, String name, String temporaryPassword) {
        String subject = "Welcome to DQIMS - Your Account Has Been Created";
        String html = buildWelcomeEmail(email, name, temporaryPassword);
        sendEmailAsync(email, subject, html);
    }
    
    private String buildWelcomeEmail(String email, String name, String temporaryPassword) {
        return buildEmailTemplate(
            "Welcome to DQIMS!",
            String.format("Hello %s,<br><br>Your account has been created in the <strong>Data Quality Issues Management System (DQIMS)</strong>.", name),
            String.format("""
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #20603D; margin-top: 0;">Your Account Details</h3>
                    <table style="width: 100%%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Name:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                    </table>
                </div>
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                    <p style="margin: 0; color: #856404;"><strong>⚠️ Temporary Password:</strong> %s</p>
                    <p style="margin: 10px 0 0 0; color: #856404; font-size: 13px;">Please change your password immediately after your first login.</p>
                </div>
                <p style="color: #666;">Login to DQIMS using your email and temporary password to get started.</p>
                """,
                escapeHtml(name),
                escapeHtml(email),
                temporaryPassword
            )
        );
    }
    
    /**
     * Notify user when their account is updated
     */
    public void notifyAccountUpdated(User user, String changedFields) {
        String subject = "Your Account Has Been Updated";
        String html = buildAccountUpdatedEmail(user, changedFields);
        sendEmailAsync(user.getEmail(), subject, html);
    }
    
    /**
     * Notify user when their account is deactivated
     */
    public void notifyAccountDeactivated(User user, User deactivatedBy) {
        String subject = "Your Account Has Been Deactivated";
        String html = buildAccountDeactivatedEmail(user, deactivatedBy);
        sendEmailAsync(user.getEmail(), subject, html);
    }
    
    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String email, String name, String resetToken) {
        String subject = "Password Reset Request - DQIMS";
        String html = buildPasswordResetEmail(name, resetToken);
        sendEmailAsync(email, subject, html);
    }
    
    /**
     * Notify user when password is changed successfully
     */
    public void notifyPasswordChanged(User user) {
        String subject = "Password Changed Successfully";
        String html = buildPasswordChangedEmail(user);
        sendEmailAsync(user.getEmail(), subject, html);
    }
    
    // ========== HTML EMAIL TEMPLATES ==========
    
    private String buildIssueCreatedEmail(Issue issue, User creator) {
        return buildEmailTemplate(
            "New Issue Created",
            "A new data quality issue has been reported in the system.",
            String.format("""
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #20603D; margin-top: 0;">Issue Details</h3>
                    <table style="width: 100%%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Issue ID:</strong></td>
                            <td style="padding: 8px 0;">#%d</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Title:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Description:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Department:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Priority:</strong></td>
                            <td style="padding: 8px 0;"><span style="background: %s; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">%s</span></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                            <td style="padding: 8px 0;"><span style="background: #dc3545; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">OPEN</span></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Reported By:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Created:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                    </table>
                </div>
                """,
                issue.getId(),
                escapeHtml(issue.getTitle()),
                escapeHtml(issue.getDescription()),
                escapeHtml(issue.getDepartment()),
                getPriorityColor(issue.getPriority()),
                issue.getPriority(),
                escapeHtml(creator.getName()),
                issue.getCreatedAt().format(DATE_FORMATTER)
            )
        );
    }
    
    private String buildIssueAssignedEmail(Issue issue, User assignee, User assigner) {
        return buildEmailTemplate(
            "Issue Assigned to You",
            String.format("Hello %s,<br><br>A data quality issue has been assigned to you by <strong>%s</strong>.", 
                assignee.getName(), assigner.getName()),
            String.format("""
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #20603D; margin-top: 0;">Issue Details</h3>
                    <table style="width: 100%%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Issue ID:</strong></td>
                            <td style="padding: 8px 0;">#%d</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Title:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Description:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Priority:</strong></td>
                            <td style="padding: 8px 0;"><span style="background: %s; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">%s</span></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;"><strong>Assigned By:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                    </table>
                </div>
                <p style="color: #666; margin-top: 20px;">Please login to DQIMS to view full details and take action on this issue.</p>
                """,
                issue.getId(),
                escapeHtml(issue.getTitle()),
                escapeHtml(issue.getDescription()),
                getPriorityColor(issue.getPriority()),
                issue.getPriority(),
                escapeHtml(assigner.getName())
            )
        );
    }
    
    private String buildIssueStatusChangedEmail(Issue issue, String oldStatus, String newStatus, User updater) {
        return buildEmailTemplate(
            "Issue Status Updated",
            String.format("The status of issue <strong>#%d - %s</strong> has been updated.", issue.getId(), escapeHtml(issue.getTitle())),
            String.format("""
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #20603D; margin-top: 0;">Status Change</h3>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="background: %s; color: white; padding: 8px 16px; border-radius: 12px;">%s</span>
                        <span style="font-size: 20px;">→</span>
                        <span style="background: %s; color: white; padding: 8px 16px; border-radius: 12px;">%s</span>
                    </div>
                    <p style="margin-top: 15px; color: #666;">Updated by: <strong>%s</strong></p>
                </div>
                """,
                getStatusColor(oldStatus),
                oldStatus.replace("_", " "),
                getStatusColor(newStatus),
                newStatus.replace("_", " "),
                escapeHtml(updater.getName())
            )
        );
    }
    
    private String buildIssuePriorityChangedEmail(Issue issue, String oldPriority, String newPriority, User updater) {
        return buildEmailTemplate(
            "Issue Priority Changed",
            String.format("The priority of issue <strong>#%d - %s</strong> has been updated.", issue.getId(), escapeHtml(issue.getTitle())),
            String.format("""
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #20603D; margin-top: 0;">Priority Change</h3>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="background: %s; color: white; padding: 8px 16px; border-radius: 12px;">%s</span>
                        <span style="font-size: 20px;">→</span>
                        <span style="background: %s; color: white; padding: 8px 16px; border-radius: 12px;">%s</span>
                    </div>
                    <p style="margin-top: 15px; color: #666;">Updated by: <strong>%s</strong></p>
                </div>
                """,
                getPriorityColor(oldPriority),
                oldPriority,
                getPriorityColor(newPriority),
                newPriority,
                escapeHtml(updater.getName())
            )
        );
    }
    
    private String buildCommentAddedEmail(Issue issue, User commenter, String comment) {
        return buildEmailTemplate(
            "New Comment Added",
            String.format("<strong>%s</strong> added a comment to issue <strong>#%d - %s</strong>", 
                escapeHtml(commenter.getName()), issue.getId(), escapeHtml(issue.getTitle())),
            String.format("""
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #20603D;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <div style="width: 40px; height: 40px; background: #20603D; color: white; border-radius: 50%%; display: flex; align-items: center; justify-content: center; font-weight: bold;">%s</div>
                        <div>
                            <div style="font-weight: bold; color: #333;">%s</div>
                            <div style="font-size: 12px; color: #666;">%s</div>
                        </div>
                    </div>
                    <p style="color: #333; margin: 15px 0 0 0; line-height: 1.6;">%s</p>
                </div>
                """,
                commenter.getName().substring(0, 1).toUpperCase(),
                escapeHtml(commenter.getName()),
                commenter.getRole().name(),
                escapeHtml(comment)
            )
        );
    }
    
    private String buildIssueResolvedEmail(Issue issue, User resolver) {
        return buildEmailTemplate(
            "Issue Resolved",
            String.format("✅ Issue <strong>#%d - %s</strong> has been marked as resolved.", issue.getId(), escapeHtml(issue.getTitle())),
            String.format("""
                <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="color: #155724; margin-top: 0;">✅ Resolution Details</h3>
                    <p style="color: #155724;"><strong>Resolved By:</strong> %s</p>
                    <p style="color: #155724;"><strong>Resolved At:</strong> %s</p>
                    <p style="color: #666; margin-top: 15px;">The issue has been successfully resolved. You can now review and close the issue if no further action is needed.</p>
                </div>
                """,
                escapeHtml(resolver.getName()),
                issue.getResolvedAt() != null ? issue.getResolvedAt().format(DATE_FORMATTER) : "N/A"
            )
        );
    }
    
    private String buildIssueClosedEmail(Issue issue, User closer) {
        return buildEmailTemplate(
            "Issue Closed",
            String.format("🔒 Issue <strong>#%d - %s</strong> has been closed.", issue.getId(), escapeHtml(issue.getTitle())),
            String.format("""
                <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
                    <h3 style="color: #0c5460; margin-top: 0;">🔒 Issue Closed</h3>
                    <p style="color: #0c5460;"><strong>Closed By:</strong> %s</p>
                    <p style="color: #0c5460;"><strong>Closed At:</strong> %s</p>
                    <p style="color: #666; margin-top: 15px;">This issue has been closed and archived. No further action is required.</p>
                </div>
                """,
                escapeHtml(closer.getName()),
                issue.getClosedAt() != null ? issue.getClosedAt().format(DATE_FORMATTER) : "N/A"
            )
        );
    }
    
    private String buildAccountUpdatedEmail(User user, String changedFields) {
        return buildEmailTemplate(
            "Account Updated",
            String.format("Hello %s,<br><br>Your account information has been updated.", user.getName()),
            String.format("""
                <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
                    <h3 style="color: #0c5460; margin-top: 0;">Updated Fields</h3>
                    <p style="color: #0c5460;">%s</p>
                </div>
                <p style="color: #666;">If you did not request these changes, please contact your system administrator immediately.</p>
                """,
                escapeHtml(changedFields)
            )
        );
    }
    
    private String buildAccountDeactivatedEmail(User user, User deactivatedBy) {
        return buildEmailTemplate(
            "Account Deactivated",
            String.format("Hello %s,<br><br>Your DQIMS account has been deactivated.", user.getName()),
            String.format("""
                <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                    <h3 style="color: #721c24; margin-top: 0;">Account Status: Deactivated</h3>
                    <p style="color: #721c24;">Deactivated by: <strong>%s</strong></p>
                    <p style="color: #721c24;">You will no longer be able to access the DQIMS system.</p>
                </div>
                <p style="color: #666;">If you believe this is an error, please contact your system administrator.</p>
                """,
                escapeHtml(deactivatedBy.getName())
            )
        );
    }
    
    private String buildPasswordResetEmail(String name, String resetToken) {
        return buildEmailTemplate(
            "Password Reset Request",
            String.format("Hello %s,<br><br>We received a request to reset your DQIMS password.", name),
            String.format("""
                <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h3 style="color: #856404; margin-top: 0;">Password Reset Code</h3>
                    <p style="color: #856404; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 15px 0;">%s</p>
                    <p style="color: #856404; font-size: 13px;">This code will expire in 15 minutes.</p>
                </div>
                <p style="color: #666;">If you did not request a password reset, please ignore this email and ensure your account is secure.</p>
                """,
                resetToken
            )
        );
    }
    
    private String buildPasswordChangedEmail(User user) {
        return buildEmailTemplate(
            "Password Changed Successfully",
            String.format("Hello %s,<br><br>Your DQIMS password has been changed successfully.", user.getName()),
            String.format("""
                <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="color: #155724; margin-top: 0;">✅ Password Updated</h3>
                    <p style="color: #155724;">Your password was changed on %s</p>
                </div>
                <p style="color: #666;">If you did not make this change, please contact your system administrator immediately.</p>
                """,
                java.time.LocalDateTime.now().format(DATE_FORMATTER)
            )
        );
    }
    
    // ========== HELPER METHODS ==========
    
    private String buildEmailTemplate(String title, String greeting, String content) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>%s</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f4;">
                <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #20603D 0%%, #00A1DE 100%%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">DQIMS</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Data Quality Issues Management System</p>
                        <p style="color: rgba(255,255,255,0.8); margin: 3px 0 0 0; font-size: 12px;">Rwanda Revenue Authority</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px;">
                        <h2 style="color: #20603D; margin-top: 0;">%s</h2>
                        <p style="color: #333; line-height: 1.6;">%s</p>
                        %s
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.6;">
                            This is an automated email from DQIMS. Please do not reply to this email.<br>
                            For support, contact your system administrator.
                        </p>
                        <p style="margin: 15px 0 0 0; color: #999; font-size: 11px;">
                            &copy; 2026 Rwanda Revenue Authority. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, title, title, greeting, content);
    }
    
    private String getPriorityColor(String priority) {
        return switch (priority) {
            case "HIGH" -> "#dc3545";
            case "MEDIUM" -> "#ffc107";
            case "LOW" -> "#28a745";
            default -> "#6c757d";
        };
    }
    
    private String getStatusColor(String status) {
        return switch (status) {
            case "OPEN" -> "#dc3545";
            case "IN_PROGRESS" -> "#ffc107";
            case "RESOLVED" -> "#28a745";
            case "CLOSED" -> "#6c757d";
            default -> "#6c757d";
        };
    }
    
    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
}
