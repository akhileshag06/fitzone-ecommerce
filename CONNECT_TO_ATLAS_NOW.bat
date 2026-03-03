@echo off
echo ========================================
echo CONNECT TO MONGODB ATLAS
echo ========================================
echo.
echo IMPORTANT: Make sure you are connected to MOBILE HOTSPOT
echo (Your current network blocks MongoDB Atlas)
echo.
pause

echo Testing connection...
cd Backend
node test-atlas-connection.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Connection successful!
    echo.
    echo Now migrating data...
    node migrate-data.js
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo ✅ MIGRATION COMPLETE!
        echo ========================================
        echo.
        echo Your data is now in MongoDB Atlas!
        echo.
        echo Next: Stop your current server (Ctrl+C)
        echo Then restart it to use Atlas
    )
) else (
    echo.
    echo ❌ Still cannot connect
    echo Make sure you are on mobile hotspot!
)

pause
