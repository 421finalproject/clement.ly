# clement.ly
A planner app that allows users to track their tasks!

## Local testing w/ Docker compose
- Build
   ```docker compose build```
- Start
   ```docker compose up```

## Manual Local testing instructions:
- Clone repo and `cd` into project directory

- Install packages  
   ```pip install -r requirements.txt```

- Run the server on port 8080
    ```uvicorn app.main:app --reload```