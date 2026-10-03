-- =====================================================
-- DQIMS - Seed Data (Initial Data)
-- Purpose: Populate database with initial system data
-- Run this AFTER creating the schema
-- Default Password for all users: "password"
-- =====================================================

-- =====================================================
-- 1. SEED DEPARTMENTS
-- =====================================================

INSERT INTO departments (name, description, is_active) VALUES
('VAT', 'Value Added Tax Department - Manages VAT collection and compliance', TRUE),
('CUSTOMS', 'Customs Department - Handles import/export duties and border control', TRUE),
('DOMESTIC TAX', 'Domestic Tax Department - Manages domestic revenue collection', TRUE),
('IT', 'Information Technology Department - System support and development', TRUE),
('TAX INVESTIGATIONS', 'Tax Investigations Department - Investigates tax fraud and evasion', TRUE),
('HR', 'Human Resources Department - Employee management and development', TRUE),
('FINANCE', 'Finance Department - Financial management and budgeting', TRUE),
('DATA MANAGEMENT', 'Data Management Department - Data quality and governance', TRUE)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 2. SEED ADMIN USER
-- =====================================================
-- Email: admin@rra.gov.rw
-- Password: password (BCrypt hash below)
-- =====================================================

INSERT INTO users (employee_id, name, email, phone, password_hash, role, department, is_first_login, is_active)
VALUES (
    'EMP001',
    'System Administrator',
    'admin@rra.gov.rw',
    '+250788000001',
    '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx',  -- password: "password"
    'ADMIN',
    'IT',
    FALSE,
    TRUE
)
ON CONFLICT (employee_id) DO UPDATE SET
    password_hash = '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx',
    is_active = TRUE;

-- =====================================================
-- 3. SEED HOD (HEAD OF DEPARTMENT) USERS
-- =====================================================
-- One HOD per department
-- Password for all: "password"
-- =====================================================

INSERT INTO users (employee_id, name, email, phone, password_hash, role, department, is_first_login) VALUES
('EMP101', 'Alice Mukamana', 'alice.mukamana@rra.gov.rw', '+250788000101', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'HOD', 'VAT', FALSE),
('EMP102', 'Bernard Ngabo', 'bernard.ngabo@rra.gov.rw', '+250788000102', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'HOD', 'IT', FALSE),
('EMP103', 'Christine Uwera', 'christine.uwera@rra.gov.rw', '+250788000103', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'HOD', 'CUSTOMS', FALSE),
('EMP104', 'David Habimana', 'david.habimana@rra.gov.rw', '+250788000104', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'HOD', 'DOMESTIC TAX', FALSE),
('EMP105', 'Emmanuel Nsengimana', 'emmanuel.nsengimana@rra.gov.rw', '+250788000105', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'HOD', 'TAX INVESTIGATIONS', FALSE),
('EMP106', 'Francine Mukamazimpaka', 'francine.mukamazimpaka@rra.gov.rw', '+250788000106', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'HOD', 'HR', FALSE),
('EMP107', 'George Uwimana', 'george.uwimana@rra.gov.rw', '+250788000107', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'HOD', 'FINANCE', FALSE),
('EMP108', 'Henriette Mukandori', 'henriette.mukandori@rra.gov.rw', '+250788000108', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'HOD', 'DATA MANAGEMENT', FALSE)
ON CONFLICT (employee_id) DO NOTHING;

-- =====================================================
-- 4. SEED STAFF USERS (3-4 per department)
-- =====================================================
-- Password for all: "password"
-- =====================================================

INSERT INTO users (employee_id, name, email, phone, password_hash, role, department, is_first_login) VALUES
-- VAT Department Staff
('EMP201', 'John Mugabo', 'john.mugabo@rra.gov.rw', '+250788000201', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'VAT', FALSE),
('EMP202', 'Grace Uwase', 'grace.uwase@rra.gov.rw', '+250788000202', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'VAT', FALSE),
('EMP203', 'Kevin Mutabazi', 'kevin.mutabazi@rra.gov.rw', '+250788000203', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'VAT', FALSE),

-- IT Department Staff
('EMP204', 'Linda Uwimana', 'linda.uwimana@rra.gov.rw', '+250788000204', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'IT', FALSE),
('EMP205', 'Frank Nshuti', 'frank.nshuti@rra.gov.rw', '+250788000205', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'IT', FALSE),
('EMP206', 'Betty Mukandori', 'betty.mukandori@rra.gov.rw', '+250788000206', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'IT', FALSE),

-- CUSTOMS Department Staff
('EMP207', 'James Niyonzima', 'james.niyonzima@rra.gov.rw', '+250788000207', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'CUSTOMS', FALSE),
('EMP208', 'Rose Nyiramana', 'rose.nyiramana@rra.gov.rw', '+250788000208', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'CUSTOMS', FALSE),
('EMP209', 'Peter Mugabo', 'peter.mugabo@rra.gov.rw', '+250788000209', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'CUSTOMS', FALSE),

-- DOMESTIC TAX Department Staff
('EMP210', 'Claire Mukeshimana', 'claire.mukeshimana@rra.gov.rw', '+250788000210', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'DOMESTIC TAX', FALSE),
('EMP211', 'Joseph Uwizeyimana', 'joseph.uwizeyimana@rra.gov.rw', '+250788000211', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'DOMESTIC TAX', FALSE),
('EMP212', 'Agnes Mukamazimpaka', 'agnes.mukamazimpaka@rra.gov.rw', '+250788000212', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'DOMESTIC TAX', FALSE),

-- TAX INVESTIGATIONS Department Staff
('EMP213', 'Robert Nsengimana', 'robert.nsengimana@rra.gov.rw', '+250788000213', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'TAX INVESTIGATIONS', FALSE),
('EMP214', 'Christine Uwamahoro', 'christine.uwamahoro@rra.gov.rw', '+250788000214', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'TAX INVESTIGATIONS', FALSE),
('EMP215', 'Daniel Hakizimana', 'daniel.hakizimana@rra.gov.rw', '+250788000215', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'TAX INVESTIGATIONS', FALSE),

-- HR Department Staff
('EMP216', 'Florence Mukamugema', 'florence.mukamugema@rra.gov.rw', '+250788000216', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'HR', FALSE),
('EMP217', 'Samuel Mugisha', 'samuel.mugisha@rra.gov.rw', '+250788000217', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'HR', FALSE),
('EMP218', 'Jacqueline Uwase', 'jacqueline.uwase@rra.gov.rw', '+250788000218', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'HR', FALSE),

-- FINANCE Department Staff
('EMP219', 'Michael Nkubito', 'michael.nkubito@rra.gov.rw', '+250788000219', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'FINANCE', FALSE),
('EMP220', 'Esther Mukandayisenga', 'esther.mukandayisenga@rra.gov.rw', '+250788000220', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'FINANCE', FALSE),
('EMP221', 'Vincent Habiyambere', 'vincent.habiyambere@rra.gov.rw', '+250788000221', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'FINANCE', FALSE),

-- DATA MANAGEMENT Department Staff
('EMP222', 'Patricia Uwamahoro', 'patricia.uwamahoro@rra.gov.rw', '+250788000222', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'DATA MANAGEMENT', FALSE),
('EMP223', 'Eric Niyonsenga', 'eric.niyonsenga@rra.gov.rw', '+250788000223', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'DATA MANAGEMENT', FALSE),
('EMP224', 'Diane Mukamana', 'diane.mukamana@rra.gov.rw', '+250788000224', '$2a$10$rN7Jw.3K5Y5kX7LxHqWZ4uB9YbqM5rGjYVkZ9nJ.QJZ8K5Y5kX7Lx', 'STAFF', 'DATA MANAGEMENT', FALSE)
ON CONFLICT (employee_id) DO NOTHING;

-- =====================================================
-- SEED DATA SUMMARY
-- =====================================================
-- Departments: 8
-- Admin Users: 1
-- HOD Users: 8 (one per department)
-- Staff Users: 24 (3 per department)
-- Total Users: 33
--
-- Default Password: "password"
-- Admin Email: admin@rra.gov.rw
-- =====================================================

-- Query to verify seeded data
SELECT 
    role,
    department,
    COUNT(*) as user_count
FROM users
GROUP BY role, department
ORDER BY role, department;

-- =====================================================
-- END OF SEED DATA
-- =====================================================
