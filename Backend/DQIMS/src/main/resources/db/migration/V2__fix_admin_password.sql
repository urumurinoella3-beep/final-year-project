-- Default admin login: admin@rra.gov.rw / Admin@123
-- V1 seed used a placeholder bcrypt that did not match any documented password.
UPDATE users
SET password_hash = '$2a$10$PsgEcEqEmQpVfcl32Km9DuVaDW5hoMq5qC5Lyl9OdjymDZA5i2Q5G'
WHERE email = 'admin@rra.gov.rw';
