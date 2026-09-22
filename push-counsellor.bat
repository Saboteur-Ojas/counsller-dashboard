@echo off
echo ====================================================
echo  VeerSetu Counsellor Portal - GitHub Push Script
echo ====================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL for Counsellor Frontend: "
if "%REPO_URL%"=="" (
  echo No repository URL provided. Aborting.
  pause
  exit /b 1
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo ====================================================
echo  Code successfully pushed to GitHub!
echo ====================================================
pause
