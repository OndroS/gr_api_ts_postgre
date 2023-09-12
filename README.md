# Fitness app - assignment

### Requirements

- node.js ^12.14.0
- postgres ^11.5
- favourite IDE
- git

### How to start

- fork or download this repository
- install dependencies with `npm i`
- create .env file with following values:
```
SECRET_KEY = sdd786asd212ntz67x
DB_URI = postgresql://localhost:5432/fitness_app
```

- create db schema and populate db with `npm run seed`
- run express server with `npm start`

***

## Task 1

✔️ Done by implementing JWT tokens with secret in .env 

### POST localhost:8000/auth/register

```
Body {
    "name": "John",
    "surname": "Doe",
    "nickName": "johnny",
    "email": "doe@example.com",
    "age": 30,
    "role": "USER",
    "password": "securePassword123"
}
```
```
Response {
    "message": "User registered successfully",
    "userId": "1"
}
```
### POST localhost:8000/auth/login
```
Body {
    "email": "doe@example.com",
    "password": "securePassword123"
}
```
```
Response {
    "message": "Logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY5NDUxMjAxNCwiZXhwIjoxNjk0NTE1NjE0fQ.QilIIBtEh2BPKmoI8VVuk8-Xt8ZJYA0kxu8acqIBmV0",
    "role": "USER"
}
```

***

## Task 2

Create private API for user with role [ADMIN]

✔️ Done

GET, POST, PUT, DELETE Create, update or delete exercises

Examples below:
### POST localhost:8000/exercises
```
Body {
    "difficulty": "HARD",
    "name": "test 2",
    "programID": 1
}
```
```
Response {
    "exercise": {
        "id": "8",
        "difficulty": "HARD",
        "name": "test 2",
        "programID": "1",
        "updatedAt": "2023-09-12T09:37:47.387Z",
        "createdAt": "2023-09-12T09:37:47.387Z",
        "deletedAt": null
    },
    "message": "Exercise created"
}
```
### Only admin - GET localhost:8000/user
```
Response {
    [
        {
            "id": "1",
            "name": "John",
            "surname": "Doe",
            "nickName": "johnny",
            "email": "john.doe@example.com",
            "age": 30,
            "role": "USER",
            "password": "U2FsdGVkX19RuoN/mrOwtenGdBo+lMRctTcrrQyZSwU+UgElPHxfiMuxXW+oM7Qh",
            "createdAt": "2023-09-11T08:43:31.364Z",
            "updatedAt": "2023-09-11T08:43:31.364Z",
            "deletedAt": null
        },
        {
            "id": "2",
            "name": "John",
            "surname": "Doe",
            "nickName": "johnny",
            "email": "john2.doe@example.com",
            "age": 30,
            "role": "ADMIN",
            "password": "U2FsdGVkX18UU680tIVnioXd6t6P80jb9SWb3udjrMjG0tQG9kfETo1D4Y50dV0B",
            "createdAt": "2023-09-11T09:12:02.861Z",
            "updatedAt": "2023-09-11T09:12:02.861Z",
            "deletedAt": null
        }
    ]
}
```

## Task 3

Create private API for user with role [USER]

✔️ Done

### GET localhost:8000/user/users/all
```
Response [
    {
        "id": "1",
        "nickName": "johnny"
    },
    {
        "id": "2",
        "nickName": "johnny"
    },
    {
        "id": "3",
        "nickName": "johnny"
    }
]
```

### GET localhost:8000/user/users/profile
```
Response {
    "name": "John",
    "surname": "Doe",
    "age": 30,
    "nickName": "johnny"
}
```

### POST localhost:8000/exercises/track-exercise
```
Body {
    "exerciseId": 4,
    "duration": 800
}
```
```
Response {
    "id": "3",
    "userId": "2",
    "exerciseId": "4",
    "duration": 800,
    "datetime": "2023-09-11T15:13:25.908Z",
    "updatedAt": "2023-09-11T15:13:25.908Z",
    "createdAt": "2023-09-11T15:13:25.908Z",
    "deletedAt": null
}
```

### GET, DELETE localhost:8000/exercises/completed-exercises
```
Response [
    {
        "id": "2",
        "userId": "2",
        "exerciseId": "3",
        "datetime": "2023-09-11T15:13:06.342Z",
        "duration": 600,
        "createdAt": "2023-09-11T15:13:06.342Z",
        "updatedAt": "2023-09-11T15:13:06.342Z",
        "deletedAt": null,
        "exercise": {
            "id": "3",
            "difficulty": "MEDIUM",
            "name": "Exercise 3",
            "createdAt": "2023-09-08T13:13:05.934Z",
            "updatedAt": "2023-09-08T13:13:05.934Z",
            "deletedAt": null,
            "programID": "1"
        }
    }
]
```

***

## Bonus task 1 - pagination, filter, search

✔️ Done - Implemented only for "GET all exercises" endpoint

***

## Bonus task 2 - validation

✔️ Done - Implemented only for "GET all exercises" and "registration" endpoints

***

## Bonus task 3 - localization

✔️ Done by implementing i18n

***

## Bonus task 4 - error handling

✔️ Done by implementing express native error handling middleware

## ADDITIONAL TASK - swagger

✔️ To demonstrate my skills and experience I've implemented swagger (only for auth endpoints)
```
http://localhost:8000/api-docs/#/
```

