@echo off
echo ========================================
echo FIX DNS AND CONNECT TO ATLAS
echo ========================================
echo.
echo This will change your DNS to Google DNS (8.8.8.8)
echo to fix MongoDB Atlas connection issue
echo.
echo IMPORTANT: Run this as Administrator!
echo (Right-click and select "Run as administrator")
echo.
pause

echo.
echo Setting DNS to Google DNS...
netsh interface ip set dns "Wi-Fi" static 8.8.8.8 primary
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2

echo.
echo Flushing DNS cache...
ipconfig /flushdns

echo.
echo Waiting 5 seconds for DNS to update...
timeout /t 5 /nobreak

echo.
echo Testing Atlas connection...
cd Backend
node test-atlas-connection.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ CONNECTION SUCCESSFUL!
    echo ========================================
    echo.
    echo Now migrating data to Atlas...
    node migrate-data.js
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo ✅✅✅ MIGRATION COMPLETE! ✅✅✅
        echo ========================================
        echo.
        echo Your data is now in MongoDB Atlas!
        echo.
        echo Next steps:
        echo 1. Stop your current server (Ctrl+C in the other terminal)
        echo 2. Restart: node server.js
        echo 3. Your app will now use MongoDB Atlas!
    )
) else (
    echo.
    echo ❌ Connection still failed
    echo.
    echo Restoring DNS to automatic...
    netsh interface ip set dns "Wi-Fi" dhcp
    echo.
    echo Please try:
    echo 1. Use mobile hotspot
    echo 2. Use VPN
    echo 3. Contact your ISP about DNS issues
)

echo.
pause
