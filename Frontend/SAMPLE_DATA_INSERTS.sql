-- =====================================================================
-- DQIMS - SAMPLE DATA FOR TESTING
-- =====================================================================
-- Insert sample data for testing and demonstration
-- =====================================================================

-- =====================================================================
-- 1. INSERT DEPARTMENTS
-- =====================================================================
INSERT INTO departments (dept_code, dept_name, description) VALUES
('IT', 'Information Technology', 'IT Department - manages all technology systems'),
('DT', 'Domestic Tax', 'Domestic Tax Department - handles domestic tax collection'),
('CT', 'Customs & Tax', 'Customs and Excise Department'),
('HR', 'Human Resources', 'Human Resources Department'),
('FIN', 'Finance', 'Finance and Accounting Department'),
('AUDIT', 'Internal Audit', 'Internal Audit Department'),
('LEGAL', 'Legal Affairs', 'Legal Affairs Department'),
('POLICY', 'Policy & Planning', 'Policy and Strategic Planning');

-- =====================================================================
-- 2. INSERT USERS
-- =====================================================================
-- Note: Passwords should be hashed using bcrypt in production
-- These are sample hashes for password "Password123!"

-- ADMIN Users
INSERT INTO users (employee_id, email, password_hash, full_name, role, department_id, phone) VALUES
('EMP001', 'admin@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Jean Paul HABIMANA', 'ADMIN', (SELECT id FROM departments WHERE dept_code = 'IT'), '+250788123456'),
('EMP002', 'admin2@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Marie Claire UWASE', 'ADMIN', (SELECT id FROM departments WHERE dept_code = 'IT'), '+250788123457');

-- HOD (Heads of Department)
INSERT INTO users (employee_id, email, password_hash, full_name, role, department_id, phone) VALUES
('EMP101', 'hod.it@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Patrick MUGABO', 'HOD', (SELECT id FROM departments WHERE dept_code = 'IT'), '+250788234567'),
('EMP102', 'hod.dt@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Grace MUKAMANA', 'HOD', (SELECT id FROM departments WHERE dept_code = 'DT'), '+250788234568'),
('EMP103', 'hod.ct@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'David NKURUNZIZA', 'HOD', (SELECT id FROM departments WHERE dept_code = 'CT'), '+250788234569'),
('EMP104', 'hod.audit@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Alice INGABIRE', 'HOD', (SELECT id FROM departments WHERE dept_code = 'AUDIT'), '+250788234570');

-- Secretaries
INSERT INTO users (employee_id, email, password_hash, full_name, role, department_id, phone) VALUES
('EMP201', 'sec.it@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Sarah MUJAWAMARIYA', 'Secretary', (SELECT id FROM departments WHERE dept_code = 'IT'), '+250788345678'),
('EMP202', 'sec.dt@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Julie UWAMAHORO', 'Secretary', (SELECT id FROM departments WHERE dept_code = 'DT'), '+250788345679'),
('EMP203', 'sec.ct@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Claudine NIRERE', 'Secretary', (SELECT id FROM departments WHERE dept_code = 'CT'), '+250788345680');

-- Members (Regular staff)
INSERT INTO users (employee_id, email, password_hash, full_name, role, department_id, phone) VALUES
('EMP301', 'member1.it@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Eric HABINEZA', 'Member', (SELECT id FROM departments WHERE dept_code = 'IT'), '+250788456789'),
('EMP302', 'member2.it@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Agnes NYIRAHABIMANA', 'Member', (SELECT id FROM departments WHERE dept_code = 'IT'), '+250788456790'),
('EMP303', 'member1.dt@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'James NSHIMIYIMANA', 'Member', (SELECT id FROM departments WHERE dept_code = 'DT'), '+250788456791'),
('EMP304', 'member2.dt@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Diane UMUTONI', 'Member', (SELECT id FROM departments WHERE dept_code = 'DT'), '+250788456792'),
('EMP305', 'member1.ct@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Robert KAYITARE', 'Member', (SELECT id FROM departments WHERE dept_code = 'CT'), '+250788456793'),
('EMP306', 'member2.ct@rra.gov.rw', '$2b$10$rKzQ8VX4qXqJ9kQ8vGxYMuHRhZL3JxGxZ9kQ8vGxYMuHRhZL3JxGx', 'Esther UWIMANA', 'Member', (SELECT id FROM departments WHERE dept_code = 'CT'), '+250788456794');

-- =====================================================================
-- 3. INSERT ISSUE CATEGORIES
-- =====================================================================
INSERT INTO issue_categories (category_code, category_name, description, severity_level, color_code) VALUES
('DATA_QUALITY', 'Data Quality', 'Issues related to data accuracy and completeness', 'High', '#E5BE01'),
('SYSTEM_ERROR', 'System Error', 'Technical system errors and bugs', 'Critical', '#FF0000'),
('INTEGRATION', 'Integration Issue', 'Problems with system integrations', 'High', '#FF6B00'),
('PERFORMANCE', 'Performance', 'System performance and speed issues', 'Medium', '#FFA500'),
('SECURITY', 'Security', 'Security vulnerabilities and access issues', 'Critical', '#DC143C'),
('DATA_MISSING', 'Missing Data', 'Missing or incomplete data records', 'High', '#FFD700'),
('DUPLICATE', 'Duplicate Records', 'Duplicate data entries', 'Medium', '#87CEEB'),
('VALIDATION', 'Validation Failure', 'Data validation rule failures', 'High', '#FF8C00'),
('COMPLIANCE', 'Compliance Issue', 'Regulatory compliance problems', 'Critical', '#8B0000'),
('USER_ACCESS', 'User Access', 'User access and permission issues', 'Medium', '#4169E1');

-- =====================================================================
-- 4. INSERT SAMPLE ISSUES
-- =====================================================================
INSERT INTO issues (
    issue_number, title, description, category_id, severity, priority,
    data_source, affected_records, data_field,
    reported_by, assigned_to, department_id, status, sla_status,
    sla_due_date, tags, created_at
) VALUES
(
    'ISS-2026-0001',
    'Duplicate TIN entries in taxpayer database',
    'Multiple taxpayers found with the same TIN number in the database. This affects tax assessment accuracy.',
    (SELECT id FROM issue_categories WHERE category_code = 'DUPLICATE'),
    'Critical',
    'Critical',
    'Taxpayer Database',
    145,
    'TIN',
    (SELECT id FROM users WHERE employee_id = 'EMP303'),
    (SELECT id FROM users WHERE employee_id = 'EMP304'),
    (SELECT id FROM departments WHERE dept_code = 'DT'),
    'In Progress',
    'At Risk',
    CURRENT_TIMESTAMP + INTERVAL '12 hours',
    ARRAY['data-quality', 'taxpayer', 'urgent'],
    CURRENT_TIMESTAMP - INTERVAL '2 days'
),
(
    'ISS-2026-0002',
    'VAT return validation failing for Q1 2026',
    'VAT return submissions are being rejected due to validation rule changes not properly communicated.',
    (SELECT id FROM issue_categories WHERE category_code = 'VALIDATION'),
    'High',
    'High',
    'VAT Returns System',
    523,
    'VAT_AMOUNT',
    (SELECT id FROM users WHERE employee_id = 'EMP304'),
    (SELECT id FROM users WHERE employee_id = 'EMP303'),
    (SELECT id FROM departments WHERE dept_code = 'DT'),
    'Open',
    'On Track',
    CURRENT_TIMESTAMP + INTERVAL '2 days',
    ARRAY['validation', 'vat', 'quarterly'],
    CURRENT_TIMESTAMP - INTERVAL '5 hours'
),
(
    'ISS-2026-0003',
    'Integration timeout with Customs system',
    'Data synchronization between tax and customs systems timing out during peak hours.',
    (SELECT id FROM issue_categories WHERE category_code = 'INTEGRATION'),
    'High',
    'High',
    'Customs Integration API',
    NULL,
    NULL,
    (SELECT id FROM users WHERE employee_id = 'EMP301'),
    (SELECT id FROM users WHERE employee_id = 'EMP302'),
    (SELECT id FROM departments WHERE dept_code = 'IT'),
    'In Progress',
    'On Track',
    CURRENT_TIMESTAMP + INTERVAL '3 days',
    ARRAY['integration', 'customs', 'api'],
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    'ISS-2026-0004',
    'Missing payment records for January 2026',
    'Payment records for 234 transactions in January are not appearing in the system.',
    (SELECT id FROM issue_categories WHERE category_code = 'DATA_MISSING'),
    'Critical',
    'Critical',
    'Payment Processing System',
    234,
    'PAYMENT_DATE',
    (SELECT id FROM users WHERE employee_id = 'EMP305'),
    (SELECT id FROM users WHERE employee_id = 'EMP306'),
    (SELECT id FROM departments WHERE dept_code = 'CT'),
    'Open',
    'Breached',
    CURRENT_TIMESTAMP - INTERVAL '6 hours',
    ARRAY['critical', 'payments', 'missing-data'],
    CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
    'ISS-2026-0005',
    'Slow report generation for annual tax summary',
    'Annual tax summary reports taking over 15 minutes to generate, affecting user productivity.',
    (SELECT id FROM issue_categories WHERE category_code = 'PERFORMANCE'),
    'Medium',
    'Medium',
    'Reporting Module',
    NULL,
    NULL,
    (SELECT id FROM users WHERE employee_id = 'EMP302'),
    (SELECT id FROM users WHERE employee_id = 'EMP301'),
    (SELECT id FROM departments WHERE dept_code = 'IT'),
    'Pending',
    'On Track',
    CURRENT_TIMESTAMP + INTERVAL '5 days',
    ARRAY['performance', 'reports'],
    CURRENT_TIMESTAMP - INTERVAL '12 hours'
),
(
    'ISS-2026-0006',
    'Incorrect tax calculation for import duties',
    'Import duty calculations showing incorrect amounts for specific HS codes.',
    (SELECT id FROM issue_categories WHERE category_code = 'DATA_QUALITY'),
    'High',
    'High',
    'Import Duty Calculator',
    87,
    'DUTY_AMOUNT',
    (SELECT id FROM users WHERE employee_id = 'EMP305'),
    NULL,
    (SELECT id FROM departments WHERE dept_code = 'CT'),
    'Open',
    'On Track',
    CURRENT_TIMESTAMP + INTERVAL '1 day',
    ARRAY['calculation', 'import-duty'],
    CURRENT_TIMESTAMP - INTERVAL '8 hours'
),
(
    'ISS-2026-0007',
    'User unable to access audit logs',
    'Audit department users reporting access denied errors when trying to view audit logs.',
    (SELECT id FROM issue_categories WHERE category_code = 'USER_ACCESS'),
    'Medium',
    'High',
    'Audit Module',
    NULL,
    NULL,
    (SELECT id FROM users WHERE employee_id = 'EMP104'),
    (SELECT id FROM users WHERE employee_id = 'EMP301'),
    (SELECT id FROM departments WHERE dept_code = 'AUDIT'),
    'Resolved',
    NULL,
    NULL,
    ARRAY['access', 'audit', 'permissions'],
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
    'ISS-2026-0008',
    'Taxpayer address data incomplete',
    'Over 1000 taxpayer records have incomplete or missing address information.',
    (SELECT id FROM issue_categories WHERE category_code = 'DATA_QUALITY'),
    'Medium',
    'Low',
    'Taxpayer Database',
    1247,
    'ADDRESS',
    (SELECT id FROM users WHERE employee_id = 'EMP303'),
    (SELECT id FROM users WHERE employee_id = 'EMP304'),
    (SELECT id FROM departments WHERE dept_code = 'DT'),
    'Open',
    'On Track',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    ARRAY['data-quality', 'address', 'cleanup'],
    CURRENT_TIMESTAMP - INTERVAL '1 day'
);

-- Update one resolved issue
UPDATE issues SET 
    resolved_at = CURRENT_TIMESTAMP - INTERVAL '1 day',
    resolved_by = (SELECT id FROM users WHERE employee_id = 'EMP301'),
    resolution_notes = 'Fixed permission settings in the audit module. Users now have proper read access to audit logs.'
WHERE issue_number = 'ISS-2026-0007';

-- =====================================================================
-- 5. INSERT ISSUE COMMENTS
-- =====================================================================
INSERT INTO issue_comments (issue_id, user_id, comment_text) VALUES
(
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0001'),
    (SELECT id FROM users WHERE employee_id = 'EMP304'),
    'Started investigation. Found that the issue originated from a data migration script that ran on Feb 28th.'
),
(
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0001'),
    (SELECT id FROM users WHERE employee_id = 'EMP102'),
    'This is high priority. Please provide an update by end of day.'
),
(
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0003'),
    (SELECT id FROM users WHERE employee_id = 'EMP302'),
    'Identified that the timeout occurs when processing more than 500 records. Working on batch optimization.'
),
(
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0004'),
    (SELECT id FROM users WHERE employee_id = 'EMP306'),
    'Reviewed the database logs. The missing records appear to be related to a specific payment gateway.'
);

-- =====================================================================
-- 6. INSERT RELATED ISSUES
-- =====================================================================
INSERT INTO related_issues (issue_id, related_issue_id, relationship_type, created_by) VALUES
(
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0002'),
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0008'),
    'Related',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
),
(
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0006'),
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0003'),
    'Related',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
);

-- =====================================================================
-- 7. INSERT DATA VALIDATION RULES
-- =====================================================================
INSERT INTO data_validation_rules (
    rule_code, rule_name, description, data_source, field_name,
    validation_type, rule_logic, severity, created_by
) VALUES
(
    'VAL-TIN-001',
    'TIN Format Validation',
    'Validates that TIN numbers follow the correct 9-digit format',
    'Taxpayer Database',
    'TIN',
    'Format',
    'TIN must be exactly 9 digits and numeric only',
    'High',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
),
(
    'VAL-TIN-002',
    'Duplicate TIN Check',
    'Ensures no duplicate TIN numbers exist in the database',
    'Taxpayer Database',
    'TIN',
    'Uniqueness',
    'SELECT TIN, COUNT(*) FROM taxpayers GROUP BY TIN HAVING COUNT(*) > 1',
    'Critical',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
),
(
    'VAL-VAT-001',
    'VAT Amount Range Check',
    'Validates VAT amounts are within acceptable range',
    'VAT Returns',
    'VAT_AMOUNT',
    'Range',
    'VAT_AMOUNT must be between 0 and 1000000000',
    'High',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
),
(
    'VAL-PAY-001',
    'Payment Date Validation',
    'Ensures payment dates are not in the future',
    'Payment System',
    'PAYMENT_DATE',
    'Business Rule',
    'PAYMENT_DATE must be <= CURRENT_DATE',
    'High',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
),
(
    'VAL-ADDR-001',
    'Address Completeness Check',
    'Validates that required address fields are not null',
    'Taxpayer Database',
    'ADDRESS',
    'Completeness',
    'ADDRESS, CITY, DISTRICT must not be NULL',
    'Medium',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
),
(
    'VAL-REF-001',
    'Referential Integrity - Department',
    'Ensures all taxpayers are linked to valid departments',
    'Taxpayer Database',
    'DEPARTMENT_ID',
    'Referential Integrity',
    'All DEPARTMENT_ID values must exist in departments table',
    'Critical',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
);

-- =====================================================================
-- 8. INSERT DATA VALIDATION EXECUTIONS
-- =====================================================================
INSERT INTO data_validation_executions (
    execution_number, rule_id, executed_by, execution_status,
    total_records_checked, records_passed, records_failed, pass_rate,
    started_at, completed_at, execution_time_seconds
) VALUES
(
    'VAL-2026-0001',
    (SELECT id FROM data_validation_rules WHERE rule_code = 'VAL-TIN-002'),
    (SELECT id FROM users WHERE employee_id = 'EMP301'),
    'Completed',
    15234,
    15089,
    145,
    99.05,
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '45 seconds',
    45
),
(
    'VAL-2026-0002',
    (SELECT id FROM data_validation_rules WHERE rule_code = 'VAL-VAT-001'),
    (SELECT id FROM users WHERE employee_id = 'EMP303'),
    'Completed',
    8934,
    8411,
    523,
    94.15,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '32 seconds',
    32
),
(
    'VAL-2026-0003',
    (SELECT id FROM data_validation_rules WHERE rule_code = 'VAL-ADDR-001'),
    (SELECT id FROM users WHERE employee_id = 'EMP303'),
    'Completed',
    15234,
    13987,
    1247,
    91.82,
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '38 seconds',
    38
),
(
    'VAL-2026-0004',
    (SELECT id FROM data_validation_rules WHERE rule_code = 'VAL-PAY-001'),
    (SELECT id FROM users WHERE employee_id = 'EMP305'),
    'Completed',
    12456,
    12456,
    0,
    100.00,
    CURRENT_TIMESTAMP - INTERVAL '5 hours',
    CURRENT_TIMESTAMP - INTERVAL '5 hours' + INTERVAL '28 seconds',
    28
);

-- =====================================================================
-- 9. INSERT ROOT CAUSE ANALYSIS
-- =====================================================================
INSERT INTO root_cause_analysis (
    issue_id, analysis_method,
    why_1, why_2, why_3, why_4, why_5, root_cause,
    corrective_actions, preventive_actions,
    analyzed_by, status
) VALUES
(
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0001'),
    '5 Whys',
    'Why are there duplicate TIN entries? Because the data migration script didn''t check for duplicates.',
    'Why didn''t the script check for duplicates? Because the validation logic was not included in the migration process.',
    'Why was validation logic not included? Because there was no documented requirement for duplicate checking during migration.',
    'Why was there no requirement? Because the migration was rushed to meet a deadline.',
    'Why was it rushed? Because there was inadequate planning and timeline estimation for the migration project.',
    'Root cause: Inadequate project planning and lack of data validation requirements during system migration.',
    'Immediate: Run deduplication script to merge duplicate TIN records. Notify affected departments.',
    'Long-term: Implement mandatory data validation checkpoints for all future migrations. Create comprehensive migration checklist. Conduct pre-migration data quality assessments.',
    (SELECT id FROM users WHERE employee_id = 'EMP301'),
    'Approved'
),
(
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0003'),
    'Fishbone',
    NULL, NULL, NULL, NULL, NULL,
    'Root cause: Inefficient API query design combined with inadequate connection pool sizing.',
    'Technology: Insufficient database connection pool (current: 10, recommended: 50)',
    'Process: Implement batch processing for data sync. Add retry logic with exponential backoff.',
    'Immediate: Increase connection pool size and optimize SQL queries. Implement batch processing for sync operations.',
    'Long-term: Implement API rate limiting. Set up performance monitoring and alerts. Create integration SLA agreements.',
    (SELECT id FROM users WHERE employee_id = 'EMP302'),
    'Approved'
);

-- =====================================================================
-- 10. INSERT SLA CONFIGURATIONS
-- =====================================================================
INSERT INTO sla_configurations (
    sla_name, severity, priority,
    response_time_hours, resolution_time_hours, warning_threshold_hours
) VALUES
('Critical Issues SLA', 'Critical', 'Critical', 2, 24, 20),
('High Priority SLA', 'High', 'High', 4, 48, 40),
('Medium Priority SLA', 'Medium', 'Medium', 8, 120, 96),
('Low Priority SLA', 'Low', 'Low', 24, 240, 192);

-- =====================================================================
-- 11. INSERT AUDIT LOGS (Sample)
-- =====================================================================
INSERT INTO audit_logs (
    user_id, action_type, module_name, entity_type, entity_id,
    action_description, action_result, ip_address
) VALUES
(
    (SELECT id FROM users WHERE employee_id = 'EMP001'),
    'LOGIN',
    'Authentication',
    NULL,
    NULL,
    'Admin user logged in successfully',
    'Success',
    '192.168.1.100'
),
(
    (SELECT id FROM users WHERE employee_id = 'EMP303'),
    'CREATE',
    'IssueReporting',
    'Issue',
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0001'),
    'Created new issue: Duplicate TIN entries in taxpayer database',
    'Success',
    '192.168.1.105'
),
(
    (SELECT id FROM users WHERE employee_id = 'EMP301'),
    'UPDATE',
    'IssueTracking',
    'Issue',
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0003'),
    'Updated issue status from Open to In Progress',
    'Success',
    '192.168.1.102'
),
(
    (SELECT id FROM users WHERE employee_id = 'EMP303'),
    'EXECUTE',
    'DataValidation',
    'ValidationExecution',
    (SELECT id FROM data_validation_executions WHERE execution_number = 'VAL-2026-0002'),
    'Executed validation rule: VAT Amount Range Check',
    'Success',
    '192.168.1.105'
),
(
    (SELECT id FROM users WHERE employee_id = 'EMP001'),
    'EXPORT',
    'Reporting',
    'Report',
    NULL,
    'Exported department performance report to Excel',
    'Success',
    '192.168.1.100'
);

-- =====================================================================
-- 12. INSERT NOTIFICATIONS
-- =====================================================================
INSERT INTO notifications (
    user_id, notification_type, title, message,
    related_entity_type, related_entity_id, priority
) VALUES
(
    (SELECT id FROM users WHERE employee_id = 'EMP304'),
    'IssueAssigned',
    'New Issue Assigned',
    'You have been assigned issue ISS-2026-0001: Duplicate TIN entries in taxpayer database',
    'Issue',
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0001'),
    'High'
),
(
    (SELECT id FROM users WHERE employee_id = 'EMP306'),
    'SLAWarning',
    'SLA At Risk',
    'Issue ISS-2026-0004 is at risk of breaching SLA. Please prioritize.',
    'Issue',
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0004'),
    'High'
),
(
    (SELECT id FROM users WHERE employee_id = 'EMP102'),
    'IssueUpdated',
    'Issue Status Changed',
    'Issue ISS-2026-0001 status changed to In Progress',
    'Issue',
    (SELECT id FROM issues WHERE issue_number = 'ISS-2026-0001'),
    'Medium'
),
(
    (SELECT id FROM users WHERE employee_id = 'EMP303'),
    'ValidationComplete',
    'Validation Completed',
    'VAL-2026-0002: VAT Amount Range Check completed. Pass rate: 94.15%',
    'ValidationExecution',
    (SELECT id FROM data_validation_executions WHERE execution_number = 'VAL-2026-0002'),
    'Low'
);

-- =====================================================================
-- 13. INSERT DASHBOARD METRICS (Last 7 days)
-- =====================================================================
INSERT INTO dashboard_metrics (
    metric_date, department_id,
    total_issues, open_issues, in_progress_issues, resolved_issues, closed_issues,
    sla_on_track, sla_at_risk, sla_breached,
    critical_issues, high_issues, medium_issues, low_issues,
    validation_pass_rate, total_validations_run, active_users
) VALUES
-- IT Department
(CURRENT_DATE, (SELECT id FROM departments WHERE dept_code = 'IT'), 
 3, 1, 2, 0, 0, 2, 1, 0, 0, 2, 1, 0, 98.50, 2, 4),
-- Domestic Tax
(CURRENT_DATE, (SELECT id FROM departments WHERE dept_code = 'DT'),
 4, 2, 1, 0, 1, 2, 1, 1, 1, 2, 1, 0, 92.50, 3, 3),
-- Customs & Tax
(CURRENT_DATE, (SELECT id FROM departments WHERE dept_code = 'CT'),
 3, 2, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 100.00, 1, 2),
-- System-wide (NULL department)
(CURRENT_DATE, NULL,
 10, 5, 4, 0, 1, 5, 2, 2, 2, 5, 3, 0, 96.25, 6, 15);

-- =====================================================================
-- 14. INSERT INTEGRATIONS
-- =====================================================================
INSERT INTO integrations (
    integration_name, integration_type, description,
    endpoint_url, auth_type, status, created_by
) VALUES
(
    'Customs Data Sync',
    'API',
    'Synchronizes customs and import data with main tax system',
    'https://customs.rra.gov.rw/api/v1/sync',
    'API_KEY',
    'Active',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
),
(
    'Bank Payment Gateway',
    'API',
    'Integrates with banking systems for payment processing',
    'https://bankapi.rra.gov.rw/payments',
    'OAuth',
    'Active',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
),
(
    'LDAP Active Directory',
    'LDAP',
    'User authentication and directory services',
    'ldap://ad.rra.gov.rw:389',
    'Basic',
    'Active',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
),
(
    'External Tax Database',
    'Database',
    'Legacy tax system database connection',
    'jdbc:postgresql://legacy-db.rra.gov.rw:5432/taxdb',
    'Basic',
    'Inactive',
    (SELECT id FROM users WHERE employee_id = 'EMP001')
);

-- =====================================================================
-- 15. INSERT SYSTEM SETTINGS
-- =====================================================================
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) VALUES
('system.name', 'DQIMS - Data Quality Issues Management System', 'String', 'System display name', 'General'),
('system.version', '1.0.0', 'String', 'Current system version', 'General'),
('sla.default_warning_hours', '24', 'Number', 'Default hours before SLA due date to show warning', 'SLA'),
('notifications.email_enabled', 'true', 'Boolean', 'Enable email notifications', 'Notifications'),
('notifications.sms_enabled', 'false', 'Boolean', 'Enable SMS notifications', 'Notifications'),
('security.session_timeout_minutes', '30', 'Number', 'Session timeout in minutes', 'Security'),
('security.password_min_length', '8', 'Number', 'Minimum password length', 'Security'),
('security.password_require_special', 'true', 'Boolean', 'Require special characters in passwords', 'Security'),
('reports.max_export_records', '50000', 'Number', 'Maximum records in export', 'Reporting'),
('validation.auto_create_issues', 'true', 'Boolean', 'Automatically create issues from validation failures', 'DataValidation');

-- =====================================================================
-- END OF SAMPLE DATA
-- =====================================================================

-- Verify data insertion
SELECT 'Departments' as table_name, COUNT(*) as record_count FROM departments
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Issue Categories', COUNT(*) FROM issue_categories
UNION ALL
SELECT 'Issues', COUNT(*) FROM issues
UNION ALL
SELECT 'Issue Comments', COUNT(*) FROM issue_comments
UNION ALL
SELECT 'Data Validation Rules', COUNT(*) FROM data_validation_rules
UNION ALL
SELECT 'Validation Executions', COUNT(*) FROM data_validation_executions
UNION ALL
SELECT 'Root Cause Analysis', COUNT(*) FROM root_cause_analysis
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM audit_logs
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Dashboard Metrics', COUNT(*) FROM dashboard_metrics
UNION ALL
SELECT 'Integrations', COUNT(*) FROM integrations
UNION ALL
SELECT 'System Settings', COUNT(*) FROM system_settings;
