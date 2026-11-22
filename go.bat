nvm use 24.15.0

timeout /t 1 

echo "ng serve -c development --ssl true  --proxy-config proxy.config.json  --live-reload --port 5200"
 
 
 ng serve -c development --ssl true  --proxy-config proxy.config.json  --live-reload --port 5200
