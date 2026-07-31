@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "NAME=GrooveCore"
rem ============================================================
rem  EDIT ME if this is not your repo URL:
set "REMOTE_URL=https://github.com/henricksmedia/groovecore.git"
rem ============================================================
set "BRANCH=main"

rem ----- Banner -----
if exist "assets\groovecore-banner.txt" (
    type "assets\groovecore-banner.txt"
) else (
    echo =========================================
    echo   %NAME% -- Web-based TR-808 drum machine
    echo =========================================
)
echo.
echo   Remote : %REMOTE_URL%
echo   Branch : %BRANCH%
echo   Root   : %CD%
echo.

rem ----- Require git -----
where git >nul 2>nul
if errorlevel 1 (
    echo [ERROR] git was not found on PATH.
    echo         Install Git from https://git-scm.com/ and try again.
    pause
    exit /b 1
)

rem ----- Init repo if needed -----
if not exist ".git" (
    echo No .git folder found -- initializing repository on branch %BRANCH%...
    git init -b %BRANCH%
)

rem ----- Ensure origin points at the right URL -----
git remote get-url origin >nul 2>nul
if errorlevel 1 (
    git remote add origin "%REMOTE_URL%"
) else (
    git remote set-url origin "%REMOTE_URL%"
)

rem ----- Status + stage everything -----
echo.
git status -sb
echo.
git add -A

rem ----- Commit only if something is staged -----
git diff --cached --quiet
if errorlevel 1 goto do_commit
echo Nothing new to commit -- pushing existing history only.
goto do_push

:do_commit
set "MSG="
set /p "MSG=Commit message (Enter for dated default): "
if defined MSG goto have_msg
for /f "delims=" %%D in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm'"') do set "MSG=Update site - %%D"
:have_msg
git commit -m "%MSG%"
if errorlevel 1 (
    echo [ERROR] Commit failed. See output above.
    pause
    exit /b 1
)

:do_push
echo.
echo Pushing to origin %BRANCH%...
git push -u origin HEAD:%BRANCH%
if errorlevel 1 (
    echo.
    echo [ERROR] Push failed. If the remote has commits you do not have locally,
    echo         run:  git pull --rebase origin %BRANCH%   and then try again.
    echo         (This script never force-pushes.)
    pause
    exit /b 1
)

echo.
echo [OK] Pushed successfully to %REMOTE_URL%
echo.
pause
exit /b 0
