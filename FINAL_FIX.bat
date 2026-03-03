@echo off
echo ========================================
echo FINAL FIX - CHANGE DNS TO GOOGLE
echo ========================================
echo.
echo This MUST be run as Administrator!
echo Right-click this file and select "Run as administrator"
echo.
pause

echo Changing DNS to Google DNS (8.8.8.8)...
netsh interface ip set dns "Wi-Fi" static 8.8.8.8
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2

echo.
echo Flushing DNS cache...
ipconfig /flushdns

echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak

echo.
echo ========================================
echo DNS CHANGED! Now restart your server:
echo ========================================
echo.
echo cd Backend
echo node server.js
echo.
echo It should connect to MongoDB Atlas now!
echo.
pause
