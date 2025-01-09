# Scrabble counter

A web app to make Scrabble point counting faster and easier.

## Features

- **Counter**: Insert the word and the app automatically calculates the points.
- **Stats**: Get interesting insights of players and see a list of their best words.
- **Rankings**: See who comes out on top!

## Setting up

1. Clone the repository
  ```bash
  git clone https://github.com/jaakkomaenpaa/scrabble-counter.git
  ```
2. Navigate to server
  ```bash
  cd server
  ```
3. Install dependencies
  ```bash
  npm install
  ``` 
4. Run server in "production" mode
  ```bash
  npm run dev:prod
  ```
5. Navigate to client in a new console window
  ```bash
  cd client
  ```
6. Install dependencies
  ```bash
  npm install
  ```
7. Add .env and fill according to .env.example. Set url to http://localhost:3001/api (default server address), or wherever the server is running.
   
8. Run client
  ```bash
  npm start
  ```

Note that some dependencies are deprecated.

Server will start in http://localhost:3001 and client in http://localhost:3000 by default.

## UI

Game start screen:
![Screenshot 2025-01-09 212611](https://github.com/user-attachments/assets/fb1e2634-d6bd-4cef-a157-24907d402060)

Playing screen:
![Screenshot 2025-01-09 214811](https://github.com/user-attachments/assets/f689d8cb-7044-4acd-9747-d72193f00b0b)
