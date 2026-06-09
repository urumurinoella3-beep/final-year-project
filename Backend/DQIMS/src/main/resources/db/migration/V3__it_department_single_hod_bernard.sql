-- IT department: exactly one HOD — Bernard Ngabo (bernard.ngabo@rra.gov.rw).
-- Legacy Marie Uwase IT HOD becomes Bernard; any other IT HOD row is demoted to staff.

UPDATE users
SET name = 'Bernard Ngabo',
    email = 'bernard.ngabo@rra.gov.rw',
    employee_id = 'EMP102'
WHERE department = 'IT'
  AND role = 'HOD'
  AND LOWER(TRIM(email)) = 'marie.uwase@rra.gov.rw';

UPDATE users
SET role = 'STAFF'
WHERE department = 'IT'
  AND role = 'HOD'
  AND LOWER(TRIM(COALESCE(email, ''))) <> 'bernard.ngabo@rra.gov.rw';
