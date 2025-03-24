@echo off
echo Starting test script...
ping 127.0.0.1 -n 6 >nul 2>&1
echo Test script completed! > output.txt
echo Test script completed!
exit /b 0
