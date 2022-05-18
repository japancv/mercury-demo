# Getting Started with Mercury Demo

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm --prefix functions run serve`

start the proxy server for dev purpose

### Deploy Cloud Functions

`npm --prefix functions run deploy`

### Deploy Hosting

The hosting will automatically deployed through github actions

### Env Var

you need two env variable files:

- `.env.local` in the root path
- `.env` in the `functions` folder
