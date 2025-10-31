@echo off
echo ====================================
echo GitHub Push Helper
echo ====================================
echo.
echo This will push your changes to GitHub.
echo You'll need to enter your GitHub credentials when prompted.
echo.
pause

cd /d "%~dp0"

echo.
echo Pushing to GitHub...
echo.

git push https://github.com/TailoredTechSolutions/boilerroom.git main

echo.
echo ====================================
echo Done! Check the output above.
echo ====================================
echo.
pause
