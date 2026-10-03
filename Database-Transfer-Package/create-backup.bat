@echo off
REM =====================================================
REM DQIMS Database Backup Script
REM Creates a timestamped backup of the dqims_db database
REM =====================================================

echo.
echo ========================================
echo   DQIMS Database Backup Creator
echo ========================================
echo.

REM Set variables
set PGPASSWORD=noella@090
set DB_NAME=dqims_db
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

REM Create timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%%datetime:~10,2%%datetime:~12,2%

REM Set backup filename
set BACKUP_FILE=dqims_backup_%TIMESTAMP%.sql

echo Creating backup of database: %DB_NAME%
echo Backup file: %BACKUP_FILE%
echo.
echo Please wait...
echo.

REM Create the backup
pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f %BACKUP_FILE%

REM Check if backup was successful
if %ERRORLEVEL% == 0 (
    echo.
    echo ========================================
    echo   Backup Created Successfully!
    echo ========================================
    echo.
    echo File: %BACKUP_FILE%
    echo Location: %CD%
    echo.
    echo To restore this backup, use:
    echo psql -U postgres -d dqims_db -f %BACKUP_FILE%
    echo.
) else (
    echo.
    echo ========================================
    echo   Backup Failed!
    echo ========================================
    echo.
    echo Please check:
    echo 1. PostgreSQL is installed and running
    echo 2. Database 'dqims_db' exists
    echo 3. Username and password are correct
    echo 4. pg_dump is in your PATH
    echo.
)

REM Clear password from memory
set PGPASSWORD=

echo.
pause
