@echo off
echo ========================================
echo Starting DQIMS Backend Server
echo ========================================
echo.

cd Backend\DQIMS

echo Checking if PostgreSQL is accessible...
echo.

echo Starting Spring Boot application...
echo Server will be available at: http://localhost:8080
echo Health check: http://localhost:8080/actuator/health
echo.

call mvnw.cmd spring-boot:run

pause
