# MeanStackProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.1.

## Development server - Frontend

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Development server - Backend
Open another terminal and Run `npm run start:server` for a backend server.

Create `.env` file inside `backend` folder and set below values
`NODE_ENV=production`

create json file inside `config` folder based on your requirements. Like, `development.json`, `production.json` or `test.json` and set below configuration:
```json
{
    "port": "<port>", // 3000 to run your backend server 
    "database": {
        "host": "<db-host>", // "localhost"
        "port": "<db-port>", // 27017
        "user": "<db-username>",
        "password": "<db-password>",
        "name": "<db-name>"
    }
}
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
