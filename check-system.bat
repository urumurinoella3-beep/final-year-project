@echo off
echo ========================================
echo DQIMS System Check
echo ========================================
echo.

echo [1/5] Checking Java...
java -version 2>&1 | findstr "version"
if %errorlevel% neq 0 (
    echo ❌ Java not found! Please install Java 17 or higher.
) else (
    echo ✅ Java is installed
)
echo.

echo [2/5] Checking Maven...
cd Backend\DQIMS
call mvnw.cmd --version 2>&1 | findstr "Maven"
if %errorlevel% neq 0 (
    echo ❌ Maven not available
) else (
    echo ✅ Maven is available
)
cd ..\..
echo.

echo [3/5] Checking PostgreSQL...
psql --version 2>&1 | findstr "psql"
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL command not found (might still be installed)
    echo    Check Services to see if PostgreSQL is running
) else (
    echo ✅ PostgreSQL is installed
)
echo.

echo [4/5] Checking Node.js...
node --version 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js
) else (
    echo ✅ Node.js is installed
)
echo.

echo [5/5] Checking if Backend is running...
curl -s http://localhost:8080/actuator/health 2>nul
if %errorlevel% neq 0 (
    echo ❌ Backend is NOT running
    echo    Run: start-backend.bat
) else (
    echo ✅ Backend is running!
)
echo.

echo ========================================
echo Check complete!
echo ========================================
echo.
echo Next steps:
echo 1. Ensure PostgreSQL service is running
echo 2. Run: start-backend.bat
echo 3. Run: start-frontend.bat
echo 4. Login at http://localhost:5173
echo.

pause
