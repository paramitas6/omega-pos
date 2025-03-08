@echo off
:: Kill all existing Brave browser instances
echo Killing existing Brave browser processes...
taskkill /F /IM brave.exe /T

:: Kill all existing Node.js processes
echo Killing existing Node.js processes...
taskkill /F /IM node.exe /T
 
:: Change directory to the Next.js app and start it
echo Starting Next.js app...
start /MIN cmd /k "npm start"
 
:: Change directory to ticket-printer and start the servers
cd /d "%~dp0\ticket-printer"
echo Starting ticket-printer servers...
start /MIN cmd /k "node server.js"
start /MIN cmd /k "node index.js"
 
:: Delay to allow servers to start (adjust if needed)
timeout /t 5
 
:: Open localhost:3000/cashier and localhost:3000/manager in Firefox
echo Opening cashier and manager pages in Firefox...
start "" "C:\Program Files\Mozilla Firefox\firefox.exe" "http://localhost:3000/cashier"
start "" "C:\Program Files\Mozilla Firefox\firefox.exe" "http://localhost:3000/manager"
 
:: Open customer-side page in Brave on the extended monitor (assuming it's launched fullscreen)
echo Opening customer-side in Brave on the extended monitor...
start "" "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" --new-window "http://localhost:3000/customer-facing" --start-fullscreen --window-position=1920,0
 
echo All processes started successfully.
exit
