nvm use 24.15.0

timeout /t 1 

 
cls && ng serve -c development --ssl true  --proxy-config proxy.config.json  --live-reload --port 5200
