# The 7 Musketeers 
The active membership tracker requested by the DIO, WiC, and COMS. Read more about it [here](https://www.notion.so/Project-Definition-13872d93e9d18088acfade585ccba52e).

**Developers:**\
Maija Philip\
Max Stein\
Kasim O'Meally\
Divna Mijić\
Joseph Henry\
Gabriella Alvarez-McLeod\
Alexandria Eddings


## How to Run
Node version: v20.17.0

**Before try to run the app, run `npm i` to install any dependencies from other people's changes**

If this is your **first time running** or you made **changes to the front end**:
```
cd ./frontend-layer
npm run build
cd ../business-layer
node server.js
```

Otherwise:
```
cd ./business-layer
node server.js
```

LINK: http://localhost:8080/ 

**Are you getting a 'no session' error?** \
For now...this will change when the frontend works. (then you'll need to login)
Go to: http://localhost:8080/v1/session/login 


Our server gives our React based front end
