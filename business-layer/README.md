# Business Layer
This layer hosts the front end through our API, handles calls, as well as holding our business logic, and data access object

## How to run:
`node start`
MariaDB version: >= 14.4.4

**Are you getting a 'no session' error?** \
For now...this will change when the frontend works. (then you'll need to login)
Go to: http://localhost:8080/v1/session/login 



### Must have a .env file to run
Include:
```
DB_USER="username"
DB_PASSWORD="password"
SESSION_SECRET="the7musketeers"
```

## Layer Information

### Service Layer
This hosts all the express, server, and API stuff. Everything in this folder should pertain to that. It will reference public files from other parts of the business layer

All of our calls will be in specific files in the routes folder that group the calls by 

### Business Layer
This holds all the business logic. **All public accessible files must be in the 'public' folder**

### Data Layer
This holds all code interacting with the database, including ALL SQL queries. **All public accessible files must be in the 'public' folder**


