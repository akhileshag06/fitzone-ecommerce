@echo off
echo ========================================
echo FIX DNS AND MIGRATE TO ATLAS
echo ========================================
echo.
echo This will temporarily use Google DNS (8.8.8.8) to connect to MongoDB Atlas
echo.
pause

echo Setting DNS to Google DNS...
netsh interface ip set dns "Wi-Fi" static 8.8.8.8
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2

echo.
echo Flushing DNS cache...
ipconfig /flushdns

echo.
echo Testing Atlas connection...
cd Backend
node test-atlas-connection.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Connection successful! Running migration...
    node migrate-data.js
) else (
    echo.
    echo ❌ Connection still failed
    echo Try running this script as Administrator
)

echo.
echo Restoring DNS to automatic...
netsh interface ip set dns "Wi-Fi" dhcp

pause
