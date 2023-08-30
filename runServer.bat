@echo off
REM Navigate to the desired directory
cd D:\zsh\graduation\grad_env_take_2\Scripts

REM Activate the virtual environment
call activate.bat

REM Navigate back to the main repository
cd D:\zsh\graduation\Graduation-project-domain-shift-image-2-image

REM Run the Python HTTP server
python -m http.server

pause