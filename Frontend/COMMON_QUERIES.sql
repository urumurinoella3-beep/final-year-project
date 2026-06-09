-- =====================================================================
-- DQIMS - COMMON QUERIES FOR APPLICATION
-- =====================================================================
-- Frequently used queries for the DQIMS application modules
-- =====================================================================

-- =====================================================================
-- AUTHENTICATION & USER MANAGEMENT QUERIES
-- =====================================================================

-- 1. User Login Authentication
-- Used by: LoginScreen component
SELECT 
    u.id,
    u.employee_id,
    u.email,
    u.full_name,
    u.role,
    u.department_id,
    d.dept_code,
    d.dept_name,
    u.is_active
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
WHERE u.email = $1  -- Replace with user input
  AND u.is_active = true;
-- Note: Verify password_hash separately using bcrypt.compare()

-- 2. Update Last Login Time
UPDATE users 
SET last_login = CURRENT_TIMESTAMP 
WHERE id = $1;

-- 3. Get All Active Users (for User Management module)
SELECT 
    u.id,
    u.employee_id,
    u.email,
    u.full_name,
    u.role,
    d.dept_name as department,
    u.phone,
    u.is_active,
    u.last_login,
    u.created_at
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
ORDER BY u.created_at DESC;

-- 4. Get Users by Department (for HOD assignment)
SELECT 
    u.id,
    u.full_name,
    u.role,
    u.employee_id,
    u.email
FROM users u
WHERE u.department_id = $1
  AND u.is_active = true
  AND u.role IN ('Member', 'Secretary')
ORDER BY u.full_name;

-- 5. Get Users by Role
SELECT 
    u.id,
    u.full_name,
    u.employee_id,
    u.email,
    d.dept_name as department
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
WHERE u.role = $1
  AND u.is_active = true
ORDER BY u.full_name;

-- =====================================================================
-- DASHBOARD QUERIES
-- =====================================================================

-- 6. Dashboard Summary Metrics (Overall - for ADMIN)
SELECT 
    COUNT(*) as total_issues,
    COUNT(CASE WHEN status = 'Open' THEN 1 END) as open_issues,
    COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_issues,
    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_issues,
    COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved_issues,
    COUNT(CASE WHEN status = 'Closed' THEN 1 END) as closed_issues,
    COUNT(CASE WHEN severity = 'Critical' THEN 1 END) as critical_issues,
    COUNT(CASE WHEN severity = 'High' THEN 1 END) as high_issues,
    COUNT(CASE WHEN severity = 'Medium' THEN 1 END) as medium_issues,
    COUNT(CASE WHEN severity = 'Low' THEN 1 END) as low_issues,
    COUNT(CASE WHEN sla_status = 'Breached' THEN 1 END) as sla_breached,
    COUNT(CASE WHEN sla_status = 'At Risk' THEN 1 END) as sla_at_risk,
    COUNT(CASE WHEN sla_status = 'On Track' THEN 1 END) as sla_on_track
FROM issues;

-- 7. Dashboard Summary Metrics (Department-specific)
SELECT 
    COUNT(*) as total_issues,
    COUNT(CASE WHEN status = 'Open' THEN 1 END) as open_issues,
    COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_issues,
    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_issues,
    COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved_issues,
    COUNT(CASE WHEN status = 'Closed' THEN 1 END) as closed_issues,
    COUNT(CASE WHEN severity = 'Critical' THEN 1 END) as critical_issues,
    COUNT(CASE WHEN severity = 'High' THEN 1 END) as high_issues,
    COUNT(CASE WHEN severity = 'Medium' THEN 1 END) as medium_issues,
    COUNT(CASE WHEN severity = 'Low' THEN 1 END) as low_issues,
    COUNT(CASE WHEN sla_status = 'Breached' THEN 1 END) as sla_breached,
    COUNT(CASE WHEN sla_status = 'At Risk' THEN 1 END) as sla_at_risk,
    COUNT(CASE WHEN sla_status = 'On Track' THEN 1 END) as sla_on_track
FROM issues
WHERE department_id = $1;

-- 8. Recent Issues for Dashboard (Last 10)
SELECT 
    i.id,
    i.issue_number,
    i.title,
    i.severity,
    i.priority,
    i.status,
    i.sla_status,
    ic.category_name,
    d.dept_name as department,
    u.full_name as reported_by,
    i.created_at
FROM issues i
LEFT JOIN issue_categories ic ON i.category_id = ic.id
LEFT JOIN departments d ON i.department_id = d.id
LEFT JOIN users u ON i.reported_by = u.id
WHERE i.department_id = $1  -- Remove this line for ADMIN view
ORDER BY i.created_at DESC
LIMIT 10;

-- 9. Issues by Status (for Dashboard charts)
SELECT 
    status,
    COUNT(*) as count
FROM issues
WHERE department_id = $1  -- Remove for ADMIN
GROUP BY status
ORDER BY count DESC;

-- 10. Issues by Severity (for Dashboard charts)
SELECT 
    severity,
    COUNT(*) as count
FROM issues
WHERE department_id = $1  -- Remove for ADMIN
GROUP BY severity
ORDER BY 
    CASE severity
        WHEN 'Critical' THEN 1
        WHEN 'High' THEN 2
        WHEN 'Medium' THEN 3
        WHEN 'Low' THEN 4
    END;

-- 11. Issues Trend (Last 30 days)
SELECT 
    DATE(created_at) as issue_date,
    COUNT(*) as count,
    COUNT(CASE WHEN severity = 'Critical' THEN 1 END) as critical_count,
    COUNT(CASE WHEN severity = 'High' THEN 1 END) as high_count
FROM issues
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND (department_id = $1 OR $1 IS NULL)  -- NULL for ADMIN
GROUP BY DATE(created_at)
ORDER BY issue_date;

-- =====================================================================
-- ISSUE REPORTING & TRACKING QUERIES
-- =====================================================================

-- 12. Get All Issues with Full Details
SELECT 
    i.id,
    i.issue_number,
    i.title,
    i.description,
    i.severity,
    i.priority,
    i.status,
    i.sla_status,
    i.sla_due_date,
    i.data_source,
    i.affected_records,
    i.data_field,
    ic.category_name,
    ic.category_code,
    d.dept_name as department,
    d.dept_code,
    reporter.full_name as reported_by_name,
    reporter.employee_id as reported_by_emp_id,
    assignee.full_name as assigned_to_name,
    assignee.employee_id as assigned_to_emp_id,
    i.tags,
    i.is_duplicate,
    dup_issue.issue_number as duplicate_of_number,
    i.created_at,
    i.updated_at,
    i.resolved_at,
    i.resolution_notes,
    EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at))/3600 as age_hours
FROM issues i
LEFT JOIN issue_categories ic ON i.category_id = ic.id
LEFT JOIN departments d ON i.department_id = d.id
LEFT JOIN users reporter ON i.reported_by = reporter.id
LEFT JOIN users assignee ON i.assigned_to = assignee.id
LEFT JOIN issues dup_issue ON i.duplicate_of = dup_issue.id
WHERE (i.department_id = $1 OR $1 IS NULL)  -- Department filter
ORDER BY i.created_at DESC;

-- 13. Get Single Issue Details
SELECT 
    i.id,
    i.issue_number,
    i.title,
    i.description,
    i.severity,
    i.priority,
    i.status,
    i.sla_status,
    i.sla_due_date,
    i.data_source,
    i.affected_records,
    i.data_field,
    i.category_id,
    ic.category_name,
    i.department_id,
    d.dept_name as department,
    i.reported_by,
    reporter.full_name as reported_by_name,
    i.assigned_to,
    assignee.full_name as assigned_to_name,
    i.tags,
    i.is_duplicate,
    i.duplicate_of,
    dup_issue.issue_number as duplicate_of_number,
    i.attachments,
    i.created_at,
    i.updated_at,
    i.resolved_at,
    i.resolved_by,
    resolver.full_name as resolved_by_name,
    i.resolution_notes
FROM issues i
LEFT JOIN issue_categories ic ON i.category_id = ic.id
LEFT JOIN departments d ON i.department_id = d.id
LEFT JOIN users reporter ON i.reported_by = reporter.id
LEFT JOIN users assignee ON i.assigned_to = assignee.id
LEFT JOIN users resolver ON i.resolved_by = resolver.id
LEFT JOIN issues dup_issue ON i.duplicate_of = dup_issue.id
WHERE i.id = $1;

-- 14. Create New Issue
INSERT INTO issues (
    issue_number,
    title,
    description,
    category_id,
    severity,
    priority,
    data_source,
    affected_records,
    data_field,
    reported_by,
    department_id,
    status,
    sla_due_date,
    tags
) VALUES (
    generate_issue_number(),  -- Use the function created in schema
    $1,  -- title
    $2,  -- description
    $3,  -- category_id
    $4,  -- severity
    $5,  -- priority
    $6,  -- data_source
    $7,  -- affected_records
    $8,  -- data_field
    $9,  -- reported_by (user_id)
    $10, -- department_id
    'Open',
    CURRENT_TIMESTAMP + (
        SELECT INTERVAL '1 hour' * resolution_time_hours 
        FROM sla_configurations 
        WHERE severity = $4 
          AND priority = $5 
        LIMIT 1
    ),
    $11  -- tags array
) RETURNING id, issue_number;

-- 15. Update Issue Status
UPDATE issues 
SET 
    status = $1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING *;

-- 16. Assign Issue to User
UPDATE issues 
SET 
    assigned_to = $1,
    status = CASE WHEN status = 'Open' THEN 'In Progress' ELSE status END,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING *;

-- 17. Resolve Issue
UPDATE issues 
SET 
    status = 'Resolved',
    resolved_at = CURRENT_TIMESTAMP,
    resolved_by = $1,
    resolution_notes = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING *;

-- 18. Check for Duplicate Issues (by title similarity)
SELECT 
    i.id,
    i.issue_number,
    i.title,
    i.severity,
    i.status,
    i.created_at,
    similarity(i.title, $1) as title_similarity
FROM issues i
WHERE similarity(i.title, $1) > 0.5  -- 50% similarity threshold
  AND i.status NOT IN ('Closed', 'Rejected')
  AND i.id != $2  -- Exclude current issue
ORDER BY title_similarity DESC
LIMIT 10;
-- Note: Requires pg_trgm extension: CREATE EXTENSION pg_trgm;

-- 19. Get Issue Comments
SELECT 
    ic.id,
    ic.comment_text,
    ic.is_internal,
    ic.created_at,
    u.full_name as user_name,
    u.role,
    u.employee_id
FROM issue_comments ic
JOIN users u ON ic.user_id = u.id
WHERE ic.issue_id = $1
ORDER BY ic.created_at ASC;

-- 20. Add Issue Comment
INSERT INTO issue_comments (
    issue_id,
    user_id,
    comment_text,
    is_internal
) VALUES ($1, $2, $3, $4)
RETURNING id, created_at;

-- 21. Get Related Issues
SELECT 
    ri.id,
    ri.relationship_type,
    ri.notes,
    i.id as related_issue_id,
    i.issue_number,
    i.title,
    i.severity,
    i.status,
    i.created_at
FROM related_issues ri
JOIN issues i ON ri.related_issue_id = i.id
WHERE ri.issue_id = $1;

-- 22. Link Related Issues
INSERT INTO related_issues (
    issue_id,
    related_issue_id,
    relationship_type,
    notes,
    created_by
) VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (issue_id, related_issue_id, relationship_type) DO NOTHING
RETURNING id;

-- =====================================================================
-- DATA VALIDATION QUERIES
-- =====================================================================

-- 23. Get All Validation Rules
SELECT 
    vr.id,
    vr.rule_code,
    vr.rule_name,
    vr.description,
    vr.data_source,
    vr.field_name,
    vr.validation_type,
    vr.severity,
    vr.is_active,
    u.full_name as created_by_name,
    vr.created_at,
    COUNT(ve.id) as execution_count,
    MAX(ve.completed_at) as last_execution
FROM data_validation_rules vr
LEFT JOIN users u ON vr.created_by = u.id
LEFT JOIN data_validation_executions ve ON vr.id = ve.rule_id
GROUP BY vr.id, vr.rule_code, vr.rule_name, vr.description, vr.data_source, 
         vr.field_name, vr.validation_type, vr.severity, vr.is_active, 
         u.full_name, vr.created_at
ORDER BY vr.created_at DESC;

-- 24. Get Validation Executions with Results
SELECT 
    ve.id,
    ve.execution_number,
    ve.execution_status,
    ve.total_records_checked,
    ve.records_passed,
    ve.records_failed,
    ve.pass_rate,
    ve.started_at,
    ve.completed_at,
    ve.execution_time_seconds,
    vr.rule_name,
    vr.rule_code,
    vr.data_source,
    u.full_name as executed_by_name
FROM data_validation_executions ve
JOIN data_validation_rules vr ON ve.rule_id = vr.id
JOIN users u ON ve.executed_by = u.id
ORDER BY ve.started_at DESC
LIMIT 50;

-- 25. Execute Validation Rule (Create execution record)
INSERT INTO data_validation_executions (
    execution_number,
    rule_id,
    executed_by,
    execution_status,
    started_at
) VALUES (
    generate_validation_number(),
    $1,  -- rule_id
    $2,  -- executed_by (user_id)
    'Running',
    CURRENT_TIMESTAMP
) RETURNING id, execution_number;

-- 26. Update Validation Execution Results
UPDATE data_validation_executions
SET 
    execution_status = 'Completed',
    total_records_checked = $1,
    records_passed = $2,
    records_failed = $3,
    pass_rate = ROUND(($2::DECIMAL / NULLIF($1, 0)) * 100, 2),
    completed_at = CURRENT_TIMESTAMP,
    execution_time_seconds = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at))::INTEGER
WHERE id = $4
RETURNING *;

-- 27. Get Validation Failures
SELECT 
    vf.id,
    vf.record_identifier,
    vf.field_name,
    vf.actual_value,
    vf.expected_value,
    vf.failure_reason,
    vf.issue_created,
    i.issue_number,
    vf.created_at
FROM data_validation_failures vf
LEFT JOIN issues i ON vf.issue_id = i.id
WHERE vf.execution_id = $1
ORDER BY vf.created_at DESC;

-- =====================================================================
-- ISSUE CLASSIFICATION QUERIES
-- =====================================================================

-- 28. Get All Issue Categories
SELECT 
    id,
    category_code,
    category_name,
    description,
    severity_level,
    color_code,
    is_active
FROM issue_categories
WHERE is_active = true
ORDER BY category_name;

-- 29. Get Issues by Category
SELECT 
    ic.category_name,
    COUNT(i.id) as issue_count,
    COUNT(CASE WHEN i.status = 'Open' THEN 1 END) as open_count,
    COUNT(CASE WHEN i.status = 'Resolved' THEN 1 END) as resolved_count,
    COUNT(CASE WHEN i.severity = 'Critical' THEN 1 END) as critical_count
FROM issue_categories ic
LEFT JOIN issues i ON ic.id = i.category_id
WHERE ic.is_active = true
GROUP BY ic.id, ic.category_name
ORDER BY issue_count DESC;

-- =====================================================================
-- ROOT CAUSE ANALYSIS QUERIES
-- =====================================================================

-- 30. Get Root Cause Analysis for Issue
SELECT 
    rca.id,
    rca.issue_id,
    rca.analysis_method,
    rca.why_1,
    rca.why_2,
    rca.why_3,
    rca.why_4,
    rca.why_5,
    rca.root_cause,
    rca.people_factors,
    rca.process_factors,
    rca.technology_factors,
    rca.environment_factors,
    rca.material_factors,
    rca.measurement_factors,
    rca.corrective_actions,
    rca.preventive_actions,
    rca.status,
    analyzer.full_name as analyzed_by_name,
    rca.analyzed_at,
    reviewer.full_name as reviewed_by_name,
    rca.reviewed_at
FROM root_cause_analysis rca
LEFT JOIN users analyzer ON rca.analyzed_by = analyzer.id
LEFT JOIN users reviewer ON rca.reviewed_by = reviewer.id
WHERE rca.issue_id = $1;

-- 31. Create Root Cause Analysis
INSERT INTO root_cause_analysis (
    issue_id,
    analysis_method,
    why_1, why_2, why_3, why_4, why_5,
    root_cause,
    corrective_actions,
    preventive_actions,
    analyzed_by,
    status
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Draft'
) RETURNING id;

-- 32. Get All Root Cause Analyses
SELECT 
    rca.id,
    i.issue_number,
    i.title as issue_title,
    rca.analysis_method,
    rca.root_cause,
    rca.status,
    u.full_name as analyzed_by,
    rca.analyzed_at
FROM root_cause_analysis rca
JOIN issues i ON rca.issue_id = i.id
JOIN users u ON rca.analyzed_by = u.id
WHERE (i.department_id = $1 OR $1 IS NULL)
ORDER BY rca.analyzed_at DESC;

-- =====================================================================
-- MONITORING & SLA QUERIES
-- =====================================================================

-- 33. Get SLA Status Overview
SELECT 
    COUNT(*) as total_with_sla,
    COUNT(CASE WHEN sla_status = 'On Track' THEN 1 END) as on_track,
    COUNT(CASE WHEN sla_status = 'At Risk' THEN 1 END) as at_risk,
    COUNT(CASE WHEN sla_status = 'Breached' THEN 1 END) as breached,
    ROUND(AVG(EXTRACT(EPOCH FROM (sla_due_date - CURRENT_TIMESTAMP))/3600), 2) as avg_hours_remaining
FROM issues
WHERE sla_due_date IS NOT NULL
  AND status NOT IN ('Closed', 'Rejected')
  AND (department_id = $1 OR $1 IS NULL);

-- 34. Get Issues Approaching SLA Breach
SELECT 
    i.id,
    i.issue_number,
    i.title,
    i.severity,
    i.priority,
    i.sla_due_date,
    i.sla_status,
    EXTRACT(EPOCH FROM (i.sla_due_date - CURRENT_TIMESTAMP))/3600 as hours_remaining,
    d.dept_name as department,
    assignee.full_name as assigned_to
FROM issues i
LEFT JOIN departments d ON i.department_id = d.id
LEFT JOIN users assignee ON i.assigned_to = assignee.id
WHERE i.sla_status IN ('At Risk', 'Breached')
  AND i.status NOT IN ('Closed', 'Rejected')
  AND (i.department_id = $1 OR $1 IS NULL)
ORDER BY i.sla_due_date ASC;

-- 35. Update SLA Status (Run periodically)
UPDATE issues
SET sla_status = calculate_sla_status(id)
WHERE sla_due_date IS NOT NULL
  AND status NOT IN ('Closed', 'Rejected');

-- =====================================================================
-- REPORTING & ANALYTICS QUERIES
-- =====================================================================

-- 36. Department Performance Report
SELECT 
    d.dept_name,
    COUNT(i.id) as total_issues,
    COUNT(CASE WHEN i.status = 'Open' THEN 1 END) as open_issues,
    COUNT(CASE WHEN i.status = 'Resolved' THEN 1 END) as resolved_issues,
    COUNT(CASE WHEN i.status = 'Closed' THEN 1 END) as closed_issues,
    COUNT(CASE WHEN i.sla_status = 'Breached' THEN 1 END) as sla_breached,
    ROUND(AVG(EXTRACT(EPOCH FROM (i.resolved_at - i.created_at))/3600), 2) as avg_resolution_hours,
    COUNT(CASE WHEN i.severity = 'Critical' THEN 1 END) as critical_count
FROM departments d
LEFT JOIN issues i ON d.id = i.department_id
WHERE i.created_at >= $1  -- Start date
  AND i.created_at <= $2  -- End date
GROUP BY d.id, d.dept_name
ORDER BY total_issues DESC;

-- 37. Issue Trend Analysis (by week)
SELECT 
    DATE_TRUNC('week', created_at) as week_start,
    COUNT(*) as total_issues,
    COUNT(CASE WHEN severity = 'Critical' THEN 1 END) as critical_issues,
    COUNT(CASE WHEN severity = 'High' THEN 1 END) as high_issues,
    COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved_issues
FROM issues
WHERE created_at >= CURRENT_DATE - INTERVAL '12 weeks'
  AND (department_id = $1 OR $1 IS NULL)
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week_start;

-- 38. Top Categories by Issue Count
SELECT 
    ic.category_name,
    COUNT(i.id) as issue_count,
    ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(i.resolved_at, CURRENT_TIMESTAMP) - i.created_at))/3600), 2) as avg_age_hours
FROM issue_categories ic
LEFT JOIN issues i ON ic.id = i.category_id
WHERE i.created_at >= $1  -- Date range
  AND (i.department_id = $2 OR $2 IS NULL)
GROUP BY ic.id, ic.category_name
HAVING COUNT(i.id) > 0
ORDER BY issue_count DESC
LIMIT 10;

-- 39. User Activity Report
SELECT 
    u.full_name,
    u.role,
    d.dept_name as department,
    COUNT(DISTINCT reported.id) as issues_reported,
    COUNT(DISTINCT assigned.id) as issues_assigned,
    COUNT(DISTINCT resolved.id) as issues_resolved,
    COUNT(DISTINCT comments.id) as comments_made
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN issues reported ON u.id = reported.reported_by
LEFT JOIN issues assigned ON u.id = assigned.assigned_to
LEFT JOIN issues resolved ON u.id = resolved.resolved_by
LEFT JOIN issue_comments comments ON u.id = comments.user_id
WHERE u.is_active = true
  AND (u.department_id = $1 OR $1 IS NULL)
GROUP BY u.id, u.full_name, u.role, d.dept_name
ORDER BY issues_reported DESC;

-- 40. Data Quality Metrics Report
SELECT 
    vr.data_source,
    COUNT(DISTINCT vr.id) as total_rules,
    COUNT(ve.id) as total_executions,
    ROUND(AVG(ve.pass_rate), 2) as avg_pass_rate,
    SUM(ve.records_failed) as total_failures
FROM data_validation_rules vr
LEFT JOIN data_validation_executions ve ON vr.id = ve.rule_id
WHERE ve.completed_at >= $1  -- Date range
  AND vr.is_active = true
GROUP BY vr.data_source
ORDER BY avg_pass_rate ASC;

-- =====================================================================
-- AUDIT & COMPLIANCE QUERIES
-- =====================================================================

-- 41. Get Audit Logs
SELECT 
    al.id,
    al.action_type,
    al.module_name,
    al.entity_type,
    al.action_description,
    al.action_result,
    al.created_at,
    u.full_name as user_name,
    u.employee_id,
    al.ip_address
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.created_at >= $1  -- Start date
  AND al.created_at <= $2  -- End date
  AND (u.department_id = $3 OR $3 IS NULL)  -- Department filter
ORDER BY al.created_at DESC
LIMIT 100;

-- 42. Create Audit Log Entry
INSERT INTO audit_logs (
    user_id,
    action_type,
    module_name,
    entity_type,
    entity_id,
    action_description,
    old_values,
    new_values,
    ip_address,
    user_agent,
    action_result
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Success'
);

-- 43. Get Issue Change History
SELECT 
    ih.id,
    ih.change_type,
    ih.field_name,
    ih.old_value,
    ih.new_value,
    ih.change_description,
    ih.created_at,
    u.full_name as changed_by
FROM issue_history ih
JOIN users u ON ih.changed_by = u.id
WHERE ih.issue_id = $1
ORDER BY ih.created_at DESC;

-- =====================================================================
-- NOTIFICATION QUERIES
-- =====================================================================

-- 44. Get User Notifications
SELECT 
    n.id,
    n.notification_type,
    n.title,
    n.message,
    n.priority,
    n.is_read,
    n.created_at,
    n.related_entity_type,
    n.related_entity_id
FROM notifications n
WHERE n.user_id = $1
ORDER BY n.is_read ASC, n.created_at DESC
LIMIT 50;

-- 45. Mark Notification as Read
UPDATE notifications
SET is_read = true, read_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- 46. Create Notification
INSERT INTO notifications (
    user_id,
    notification_type,
    title,
    message,
    related_entity_type,
    related_entity_id,
    priority
) VALUES ($1, $2, $3, $4, $5, $6, $7);

-- 47. Get Unread Notification Count
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = $1 AND is_read = false;

-- =====================================================================
-- INTEGRATION QUERIES
-- =====================================================================

-- 48. Get Active Integrations
SELECT 
    i.id,
    i.integration_name,
    i.integration_type,
    i.status,
    i.last_sync_at,
    i.next_sync_at,
    i.last_error
FROM integrations i
WHERE i.is_active = true
ORDER BY i.integration_name;

-- 49. Get Integration Logs
SELECT 
    il.id,
    i.integration_name,
    il.sync_status,
    il.started_at,
    il.completed_at,
    il.records_processed,
    il.records_success,
    il.records_failed,
    il.error_message
FROM integration_logs il
JOIN integrations i ON il.integration_id = i.id
WHERE il.integration_id = $1
ORDER BY il.started_at DESC
LIMIT 50;

-- =====================================================================
-- SYSTEM SETTINGS QUERIES
-- =====================================================================

-- 50. Get System Settings
SELECT 
    setting_key,
    setting_value,
    setting_type,
    description,
    category
FROM system_settings
WHERE is_editable = true
ORDER BY category, setting_key;

-- 51. Update System Setting
UPDATE system_settings
SET 
    setting_value = $1,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = $2
WHERE setting_key = $3;

-- =====================================================================
-- UTILITY QUERIES
-- =====================================================================

-- 52. Get All Departments
SELECT id, dept_code, dept_name, description
FROM departments
WHERE is_active = true
ORDER BY dept_name;

-- 53. Search Issues (Full-text search)
SELECT 
    i.id,
    i.issue_number,
    i.title,
    i.severity,
    i.status,
    ic.category_name,
    d.dept_name,
    ts_rank(
        to_tsvector('english', i.title || ' ' || i.description),
        plainto_tsquery('english', $1)
    ) as relevance
FROM issues i
LEFT JOIN issue_categories ic ON i.category_id = ic.id
LEFT JOIN departments d ON i.department_id = d.id
WHERE to_tsvector('english', i.title || ' ' || i.description) @@ plainto_tsquery('english', $1)
  AND (i.department_id = $2 OR $2 IS NULL)
ORDER BY relevance DESC
LIMIT 20;

-- 54. Export Issues to CSV Format
COPY (
    SELECT 
        i.issue_number,
        i.title,
        i.severity,
        i.priority,
        i.status,
        ic.category_name,
        d.dept_name,
        u.full_name as reported_by,
        i.created_at,
        i.resolved_at
    FROM issues i
    LEFT JOIN issue_categories ic ON i.category_id = ic.id
    LEFT JOIN departments d ON i.department_id = d.id
    LEFT JOIN users u ON i.reported_by = u.id
    WHERE i.department_id = $1  -- Your department filter
) TO '/tmp/issues_export.csv' WITH CSV HEADER;

-- =====================================================================
-- PERFORMANCE OPTIMIZATION QUERIES
-- =====================================================================

-- 55. Analyze Query Performance
EXPLAIN ANALYZE
SELECT 
    i.issue_number,
    i.title,
    i.status
FROM issues i
WHERE i.department_id = $1
  AND i.created_at >= CURRENT_DATE - INTERVAL '30 days';

-- 56. Vacuum and Analyze Tables (Maintenance)
VACUUM ANALYZE issues;
VACUUM ANALYZE data_validation_executions;
VACUUM ANALYZE audit_logs;

-- =====================================================================
-- END OF COMMON QUERIES
-- =====================================================================
