-- =====================================================================
-- DQIMS (Data Quality Issues Management System)
-- Database Schema for Rwanda Revenue Authority (RRA)
-- =====================================================================
-- Database: PostgreSQL (Can be adapted for MySQL/MariaDB)
-- Author: AUCA Final Year Project
-- =====================================================================

-- Create Database
CREATE DATABASE dqims_rra;

-- Connect to the database
\c dqims_rra;

-- Enable UUID extension (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- TABLE 1: DEPARTMENTS
-- Stores all departments within RRA
-- =====================================================================
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dept_code VARCHAR(20) UNIQUE NOT NULL,
    dept_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 2: USERS
-- Stores all system users with role-based access
-- =====================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'HOD', 'Secretary', 'Member')),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- =====================================================================
-- TABLE 3: ISSUE_CATEGORIES
-- Stores predefined issue categories for classification
-- =====================================================================
CREATE TABLE issue_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(20) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    severity_level VARCHAR(20) CHECK (severity_level IN ('Low', 'Medium', 'High', 'Critical')),
    color_code VARCHAR(7), -- Hex color for UI display
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 4: ISSUES
-- Main table for storing all reported issues
-- =====================================================================
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_number VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated: ISS-2026-0001
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    -- Classification
    category_id UUID REFERENCES issue_categories(id),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    
    -- Data source information
    data_source VARCHAR(100),
    affected_records INTEGER,
    data_field VARCHAR(100),
    
    -- Assignment and tracking
    reported_by UUID NOT NULL REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    
    -- Status tracking
    status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Rejected')),
    
    -- SLA tracking
    sla_due_date TIMESTAMP,
    sla_status VARCHAR(20) CHECK (sla_status IN ('On Track', 'At Risk', 'Breached')),
    
    -- Resolution
    resolution_notes TEXT,
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),
    
    -- Metadata
    is_duplicate BOOLEAN DEFAULT false,
    duplicate_of UUID REFERENCES issues(id),
    attachments JSONB, -- Array of file metadata
    tags TEXT[], -- Array of tags
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 5: ISSUE_COMMENTS
-- Stores comments and discussion threads for issues
-- =====================================================================
CREATE TABLE issue_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    comment_text TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- Internal notes vs public comments
    attachments JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 6: RELATED_ISSUES
-- Tracks relationships between related issues
-- =====================================================================
CREATE TABLE related_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    related_issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN ('Duplicate', 'Related', 'Blocks', 'Blocked By', 'Caused By', 'Causes')),
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(issue_id, related_issue_id, relationship_type)
);

-- =====================================================================
-- TABLE 7: DATA_VALIDATION_RULES
-- Stores validation rules for different data sources
-- =====================================================================
CREATE TABLE data_validation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_code VARCHAR(20) UNIQUE NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    description TEXT,
    data_source VARCHAR(100) NOT NULL,
    field_name VARCHAR(100),
    validation_type VARCHAR(50) NOT NULL CHECK (validation_type IN ('Format', 'Range', 'Consistency', 'Completeness', 'Uniqueness', 'Referential Integrity', 'Business Rule')),
    rule_logic TEXT NOT NULL, -- SQL or business logic description
    severity VARCHAR(20) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 8: DATA_VALIDATION_EXECUTIONS
-- Records each execution of validation rules
-- =====================================================================
CREATE TABLE data_validation_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_number VARCHAR(50) UNIQUE NOT NULL, -- VAL-2026-0001
    rule_id UUID NOT NULL REFERENCES data_validation_rules(id),
    executed_by UUID NOT NULL REFERENCES users(id),
    execution_status VARCHAR(20) CHECK (execution_status IN ('Running', 'Completed', 'Failed')),
    
    -- Results
    total_records_checked INTEGER,
    records_passed INTEGER,
    records_failed INTEGER,
    pass_rate DECIMAL(5,2), -- Percentage
    
    -- Execution details
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    execution_time_seconds INTEGER,
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 9: DATA_VALIDATION_FAILURES
-- Stores individual validation failures (failed records)
-- =====================================================================
CREATE TABLE data_validation_failures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES data_validation_executions(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES data_validation_rules(id),
    
    -- Failed record details
    record_identifier VARCHAR(100), -- Primary key or unique identifier of failed record
    field_name VARCHAR(100),
    actual_value TEXT,
    expected_value TEXT,
    failure_reason TEXT,
    
    -- Issue creation
    issue_created BOOLEAN DEFAULT false,
    issue_id UUID REFERENCES issues(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 10: ROOT_CAUSE_ANALYSIS
-- Stores root cause analysis for issues
-- =====================================================================
CREATE TABLE root_cause_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    analysis_method VARCHAR(50) CHECK (analysis_method IN ('5 Whys', 'Fishbone', 'Pareto', 'Fault Tree')),
    
    -- 5 Whys
    why_1 TEXT,
    why_2 TEXT,
    why_3 TEXT,
    why_4 TEXT,
    why_5 TEXT,
    root_cause TEXT,
    
    -- Fishbone categories
    people_factors TEXT,
    process_factors TEXT,
    technology_factors TEXT,
    environment_factors TEXT,
    material_factors TEXT,
    measurement_factors TEXT,
    
    -- Corrective actions
    corrective_actions TEXT,
    preventive_actions TEXT,
    
    -- Metadata
    analyzed_by UUID NOT NULL REFERENCES users(id),
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('Draft', 'Pending Review', 'Approved', 'Rejected')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 11: AUDIT_LOGS
-- Comprehensive audit trail for all system activities
-- =====================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, VIEW, LOGIN, LOGOUT, EXPORT, etc.
    module_name VARCHAR(50) NOT NULL, -- Dashboard, IssueReporting, DataValidation, etc.
    entity_type VARCHAR(50), -- Issue, User, ValidationRule, etc.
    entity_id UUID, -- ID of the affected entity
    
    -- Details
    action_description TEXT,
    old_values JSONB, -- Previous state
    new_values JSONB, -- New state
    
    -- System info
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),
    
    -- Results
    action_result VARCHAR(20) CHECK (action_result IN ('Success', 'Failed', 'Partial')),
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 12: NOTIFICATIONS
-- Stores user notifications
-- =====================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- IssueAssigned, IssueUpdated, SLAWarning, etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50), -- Issue, User, Validation, etc.
    related_entity_id UUID,
    priority VARCHAR(20) CHECK (priority IN ('Low', 'Medium', 'High')),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 13: REPORTS
-- Stores generated reports and analytics
-- =====================================================================
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_number VARCHAR(50) UNIQUE NOT NULL, -- REP-2026-0001
    report_name VARCHAR(200) NOT NULL,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('Issue Summary', 'Department Performance', 'SLA Compliance', 'Data Quality Trends', 'User Activity', 'Custom')),
    description TEXT,
    
    -- Filters and parameters
    parameters JSONB, -- Store filter criteria
    
    -- Generated data
    generated_by UUID NOT NULL REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Report content
    report_data JSONB, -- Aggregated data
    file_url TEXT, -- If exported as PDF/Excel
    file_format VARCHAR(20), -- PDF, Excel, CSV
    
    -- Access
    department_id UUID REFERENCES departments(id), -- NULL for admin reports
    is_public BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 14: DASHBOARD_METRICS
-- Stores calculated metrics for dashboard (cached/snapshot data)
-- =====================================================================
CREATE TABLE dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE NOT NULL,
    department_id UUID REFERENCES departments(id), -- NULL for system-wide metrics
    
    -- Issue metrics
    total_issues INTEGER DEFAULT 0,
    open_issues INTEGER DEFAULT 0,
    in_progress_issues INTEGER DEFAULT 0,
    resolved_issues INTEGER DEFAULT 0,
    closed_issues INTEGER DEFAULT 0,
    
    -- SLA metrics
    sla_on_track INTEGER DEFAULT 0,
    sla_at_risk INTEGER DEFAULT 0,
    sla_breached INTEGER DEFAULT 0,
    
    -- Severity distribution
    critical_issues INTEGER DEFAULT 0,
    high_issues INTEGER DEFAULT 0,
    medium_issues INTEGER DEFAULT 0,
    low_issues INTEGER DEFAULT 0,
    
    -- Data quality metrics
    validation_pass_rate DECIMAL(5,2),
    total_validations_run INTEGER DEFAULT 0,
    
    -- User activity
    active_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(metric_date, department_id)
);

-- =====================================================================
-- TABLE 15: INTEGRATIONS
-- Stores external system integrations configuration
-- =====================================================================
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_name VARCHAR(100) NOT NULL,
    integration_type VARCHAR(50) NOT NULL, -- API, Database, File, LDAP, etc.
    description TEXT,
    
    -- Connection details (encrypted in production)
    endpoint_url TEXT,
    auth_type VARCHAR(50), -- API_KEY, OAuth, Basic, etc.
    credentials JSONB, -- Encrypted credentials
    
    -- Configuration
    config_parameters JSONB,
    sync_frequency VARCHAR(50), -- Real-time, Hourly, Daily, etc.
    last_sync_at TIMESTAMP,
    next_sync_at TIMESTAMP,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    status VARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Error', 'Testing')),
    last_error TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 16: INTEGRATION_LOGS
-- Logs for integration sync activities
-- =====================================================================
CREATE TABLE integration_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    sync_status VARCHAR(20) CHECK (sync_status IN ('Started', 'Success', 'Failed', 'Partial')),
    
    -- Sync details
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    records_processed INTEGER,
    records_success INTEGER,
    records_failed INTEGER,
    
    error_message TEXT,
    sync_details JSONB, -- Additional metadata
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 17: SLA_CONFIGURATIONS
-- Stores SLA configuration rules
-- =====================================================================
CREATE TABLE sla_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sla_name VARCHAR(100) NOT NULL,
    
    -- Applicability
    severity VARCHAR(20) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    priority VARCHAR(20) CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    category_id UUID REFERENCES issue_categories(id),
    department_id UUID REFERENCES departments(id),
    
    -- Time limits (in hours)
    response_time_hours INTEGER NOT NULL,
    resolution_time_hours INTEGER NOT NULL,
    warning_threshold_hours INTEGER, -- When to show "At Risk"
    
    -- Business hours
    use_business_hours_only BOOLEAN DEFAULT true,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 18: ISSUE_HISTORY
-- Tracks all changes to issues for complete audit trail
-- =====================================================================
CREATE TABLE issue_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL REFERENCES users(id),
    change_type VARCHAR(50) NOT NULL, -- StatusChange, Assignment, Update, etc.
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    change_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 19: ATTACHMENTS
-- Stores file attachments metadata
-- =====================================================================
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- Issue, Comment, RCA, etc.
    entity_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER, -- in bytes
    file_path TEXT NOT NULL, -- Storage path or URL
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- TABLE 20: SYSTEM_SETTINGS
-- Stores system-wide configuration settings
-- =====================================================================
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50), -- String, Number, Boolean, JSON
    description TEXT,
    category VARCHAR(50), -- General, Security, Notifications, etc.
    is_editable BOOLEAN DEFAULT true,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_role ON users(role);

-- Issues indexes
CREATE INDEX idx_issues_number ON issues(issue_number);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_priority ON issues(priority);
CREATE INDEX idx_issues_department ON issues(department_id);
CREATE INDEX idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX idx_issues_reported_by ON issues(reported_by);
CREATE INDEX idx_issues_category ON issues(category_id);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_issues_sla_status ON issues(sla_status);

-- Issue comments indexes
CREATE INDEX idx_comments_issue ON issue_comments(issue_id);
CREATE INDEX idx_comments_user ON issue_comments(user_id);

-- Validation executions indexes
CREATE INDEX idx_val_exec_rule ON data_validation_executions(rule_id);
CREATE INDEX idx_val_exec_user ON data_validation_executions(executed_by);
CREATE INDEX idx_val_exec_status ON data_validation_executions(execution_status);

-- Audit logs indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action_type);
CREATE INDEX idx_audit_module ON audit_logs(module_name);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- Notifications indexes
CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_notif_read ON notifications(is_read);
CREATE INDEX idx_notif_created ON notifications(created_at DESC);

-- Dashboard metrics indexes
CREATE INDEX idx_metrics_date ON dashboard_metrics(metric_date DESC);
CREATE INDEX idx_metrics_dept ON dashboard_metrics(department_id);

-- =====================================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================================

-- View: Active Issues Summary
CREATE VIEW vw_active_issues AS
SELECT 
    i.id,
    i.issue_number,
    i.title,
    i.severity,
    i.priority,
    i.status,
    i.sla_status,
    i.sla_due_date,
    ic.category_name,
    d.dept_name as department,
    reporter.full_name as reported_by_name,
    assignee.full_name as assigned_to_name,
    i.created_at,
    i.updated_at,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - i.created_at))/3600 as age_hours
FROM issues i
LEFT JOIN issue_categories ic ON i.category_id = ic.id
LEFT JOIN departments d ON i.department_id = d.id
LEFT JOIN users reporter ON i.reported_by = reporter.id
LEFT JOIN users assignee ON i.assigned_to = assignee.id
WHERE i.status NOT IN ('Closed', 'Rejected');

-- View: Department Performance
CREATE VIEW vw_department_performance AS
SELECT 
    d.id as department_id,
    d.dept_name,
    COUNT(i.id) as total_issues,
    COUNT(CASE WHEN i.status = 'Open' THEN 1 END) as open_issues,
    COUNT(CASE WHEN i.status = 'In Progress' THEN 1 END) as in_progress_issues,
    COUNT(CASE WHEN i.status = 'Resolved' THEN 1 END) as resolved_issues,
    COUNT(CASE WHEN i.status = 'Closed' THEN 1 END) as closed_issues,
    COUNT(CASE WHEN i.sla_status = 'Breached' THEN 1 END) as sla_breached,
    ROUND(AVG(EXTRACT(EPOCH FROM (i.resolved_at - i.created_at))/3600), 2) as avg_resolution_time_hours
FROM departments d
LEFT JOIN issues i ON d.id = i.department_id
GROUP BY d.id, d.dept_name;

-- View: Validation Results Summary
CREATE VIEW vw_validation_summary AS
SELECT 
    vr.id as rule_id,
    vr.rule_name,
    vr.data_source,
    vr.validation_type,
    COUNT(ve.id) as total_executions,
    COUNT(CASE WHEN ve.execution_status = 'Completed' THEN 1 END) as successful_executions,
    COUNT(CASE WHEN ve.execution_status = 'Failed' THEN 1 END) as failed_executions,
    ROUND(AVG(ve.pass_rate), 2) as avg_pass_rate,
    MAX(ve.completed_at) as last_execution
FROM data_validation_rules vr
LEFT JOIN data_validation_executions ve ON vr.id = ve.rule_id
WHERE vr.is_active = true
GROUP BY vr.id, vr.rule_name, vr.data_source, vr.validation_type;

-- View: User Activity Summary
CREATE VIEW vw_user_activity AS
SELECT 
    u.id,
    u.full_name,
    u.role,
    d.dept_name as department,
    COUNT(DISTINCT i.id) as issues_reported,
    COUNT(DISTINCT ia.id) as issues_assigned,
    COUNT(DISTINCT al.id) as total_actions,
    u.last_login
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN issues i ON u.id = i.reported_by
LEFT JOIN issues ia ON u.id = ia.assigned_to
LEFT JOIN audit_logs al ON u.id = al.user_id
WHERE u.is_active = true
GROUP BY u.id, u.full_name, u.role, d.dept_name, u.last_login;

-- =====================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================================

-- Trigger: Update timestamp on record modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_validation_rules_updated_at BEFORE UPDATE ON data_validation_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rca_updated_at BEFORE UPDATE ON root_cause_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Create audit log on issue changes
CREATE OR REPLACE FUNCTION log_issue_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Log status changes
        IF OLD.status != NEW.status THEN
            INSERT INTO issue_history (issue_id, changed_by, change_type, field_name, old_value, new_value)
            VALUES (NEW.id, NEW.updated_by, 'StatusChange', 'status', OLD.status, NEW.status);
        END IF;
        
        -- Log assignment changes
        IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
            INSERT INTO issue_history (issue_id, changed_by, change_type, field_name, old_value, new_value)
            VALUES (NEW.id, NEW.updated_by, 'Assignment', 'assigned_to', 
                    COALESCE(OLD.assigned_to::text, 'NULL'), 
                    COALESCE(NEW.assigned_to::text, 'NULL'));
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: You'll need to add an updated_by field to issues table to use this trigger
-- CREATE TRIGGER track_issue_changes AFTER UPDATE ON issues
--     FOR EACH ROW EXECUTE FUNCTION log_issue_changes();

-- =====================================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================================

-- Function: Generate next issue number
CREATE OR REPLACE FUNCTION generate_issue_number()
RETURNS TEXT AS $$
DECLARE
    next_num INTEGER;
    issue_num TEXT;
BEGIN
    SELECT COUNT(*) + 1 INTO next_num FROM issues WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_TIMESTAMP);
    issue_num := 'ISS-' || EXTRACT(YEAR FROM CURRENT_TIMESTAMP) || '-' || LPAD(next_num::TEXT, 4, '0');
    RETURN issue_num;
END;
$$ LANGUAGE plpgsql;

-- Function: Generate next validation execution number
CREATE OR REPLACE FUNCTION generate_validation_number()
RETURNS TEXT AS $$
DECLARE
    next_num INTEGER;
    val_num TEXT;
BEGIN
    SELECT COUNT(*) + 1 INTO next_num FROM data_validation_executions WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_TIMESTAMP);
    val_num := 'VAL-' || EXTRACT(YEAR FROM CURRENT_TIMESTAMP) || '-' || LPAD(next_num::TEXT, 4, '0');
    RETURN val_num;
END;
$$ LANGUAGE plpgsql;

-- Function: Generate next report number
CREATE OR REPLACE FUNCTION generate_report_number()
RETURNS TEXT AS $$
DECLARE
    next_num INTEGER;
    rep_num TEXT;
BEGIN
    SELECT COUNT(*) + 1 INTO next_num FROM reports WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_TIMESTAMP);
    rep_num := 'REP-' || EXTRACT(YEAR FROM CURRENT_TIMESTAMP) || '-' || LPAD(next_num::TEXT, 4, '0');
    RETURN rep_num;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate SLA status
CREATE OR REPLACE FUNCTION calculate_sla_status(
    p_issue_id UUID
)
RETURNS VARCHAR AS $$
DECLARE
    v_sla_due_date TIMESTAMP;
    v_hours_remaining NUMERIC;
    v_warning_hours INTEGER;
BEGIN
    SELECT sla_due_date INTO v_sla_due_date FROM issues WHERE id = p_issue_id;
    
    IF v_sla_due_date IS NULL THEN
        RETURN NULL;
    END IF;
    
    v_hours_remaining := EXTRACT(EPOCH FROM (v_sla_due_date - CURRENT_TIMESTAMP)) / 3600;
    v_warning_hours := 24; -- Default warning threshold
    
    IF v_hours_remaining < 0 THEN
        RETURN 'Breached';
    ELSIF v_hours_remaining < v_warning_hours THEN
        RETURN 'At Risk';
    ELSE
        RETURN 'On Track';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
-- Note: Enable RLS for production deployment with proper authentication

-- Enable RLS on sensitive tables
-- ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only see issues from their department (unless ADMIN)
-- CREATE POLICY dept_issues_policy ON issues
--     FOR SELECT
--     USING (
--         department_id IN (
--             SELECT department_id FROM users WHERE id = current_user_id()
--         )
--         OR
--         EXISTS (
--             SELECT 1 FROM users WHERE id = current_user_id() AND role = 'ADMIN'
--         )
--     );

-- =====================================================================
-- END OF SCHEMA
-- =====================================================================
