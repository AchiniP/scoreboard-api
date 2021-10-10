# scoreboard-api

An Node JS based Rest API which will provide high score board for a game
### Prerequisites

- NodeJS (V16)
- mongoDB

### Exposed Ports

| S/N | Application | Exposed Port |
|-----|-------------|--------------|
| 1 | database | 27017 |
| 2 | applicaiton | 8000 |

### To Start the app In Local

#### start the backend

- npm install
- npm start

All the commands should be ran in root directory
<br/>

#### To set up data in mongo DB collection

- you can either import the collection I have provided in
  resources folder or,
-  can use this utility endpoint which I have provided.

![img.png](resources/img2.png)

#### To start the frontend

Kindly follow https://github.com/AchiniP/game-scoreboard-ui#readme

### To Sanity check whether your app is running

You Should be able to call (GET) following endpoint and it will return 200 OK message

`http://localhost:8000/v1/healthcheck
`
### API docs

- Once the app is started API doc can be found in 
  
`http://localhost:8000/api-docs/#/`

All the request and Response Models can be found in api-docs

### Available Endpoints

![img.png](resources/img.png)

### Other Utility Endpoints

In case you need to generate some user skill documents in mongo DB, I have added one admin function to create n number 
of documents in mongo DB

### Design Assumptions

- This application is designed to display leaderboard.

#### Database Design

Format of a sample userSkill Model as follows.
Where each User skill document consists of 2 main attribute.
<br/>
<br/>
`{
userId: String,
skills: [ array of objects {category, level, score ]
}`
<br/>
<br/>
![img.png](resources/img3.png)


