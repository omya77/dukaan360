@echo off
echo ===================================================
echo             Starting DUKAAN360 POS
echo ===================================================

echo [1/2] Starting Python Backend Server...
cd Dukaan360_Backend
start cmd /k "python -m uvicorn main:app --reload --port 8000"
cd ..

echo [2/2] Starting React Frontend Server...
cd Dukaan360_Frontend
start cmd /k "npm run dev"
cd ..

echo ===================================================
echo Dukaan360 is starting up!
echo Please wait 5-10 seconds for the servers to load.
echo.
echo Opening browser to http://localhost:5173...
echo ===================================================

timeout /t 5 /nobreak
start http://localhost:5173
