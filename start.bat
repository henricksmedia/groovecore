@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "NAME=GrooveCore"
rem Port derived from seed "groovecore":
rem   PORT = 8000 + (sum(ord(c) for c in "groovecore") %% 1000)
rem        = 8000 + (1083 %% 1000) = 8083
set "PORT=8083"
set "URL=http://127.0.0.1:%PORT%/"

rem ----- Banner -----
if exist "assets\groovecore-banner.txt" (
    type "assets\groovecore-banner.txt"
) else (
    echo =========================================
    echo   %NAME% -- Web-based TR-808 drum machine
    echo =========================================
)
echo.
echo   Mode : static HTML (python -m http.server)
echo   Port : %PORT%
echo   Root : %CD%
echo.

rem ----- Require python -----
where python >nul 2>nul
if errorlevel 1 (
    echo [ERROR] python was not found on PATH.
    echo         Install Python from https://www.python.org/ and try again.
    pause
    exit /b 1
)

rem ----- Free the port if something is already listening -----
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /c:"LISTENING" ^| findstr /c:":%PORT% "') do (
    echo Port %PORT% is in use by PID %%P -- stopping it...
    taskkill /f /pid %%P >nul 2>nul
)
netstat -ano | findstr /c:"LISTENING" | findstr /c:":%PORT% " >nul 2>nul
if not errorlevel 1 (
    echo [ERROR] Port %PORT% is still in use and could not be freed.
    pause
    exit /b 1
)

rem ----- Start the server in a minimized companion window -----
echo Starting server on port %PORT%...
start "%NAME% :%PORT%" /min python -m http.server %PORT% --bind 127.0.0.1

rem ----- Wait until the server actually responds (max ~40s) -----
set /a TRIES=0
:waitloop
powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing -Uri '%URL%' -TimeoutSec 2 | Out-Null; exit 0 } catch { if ($_.Exception.Response) { exit 0 } else { exit 1 } }" >nul 2>nul
if not errorlevel 1 goto ready
set /a TRIES+=1
if %TRIES% geq 40 (
    echo [ERROR] Server did not respond on %URL% after ~40 seconds.
    echo         Check the minimized "%NAME% :%PORT%" window for errors.
    pause
    exit /b 1
)
timeout /t 1 /nobreak >nul
goto waitloop

:ready
echo Server is up. Opening %URL% ...
start "" "%URL%"
echo.
echo The server is running in the minimized window titled "%NAME% :%PORT%".
echo To stop it, close that window (or press Ctrl+C inside it).
echo.
pause
exit /b 0
