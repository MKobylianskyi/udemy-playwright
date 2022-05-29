#  Automation Playwright tests

## Prerequisites

- install npm
- Create a json file in /test-data folder 
- Specify enviroment data in the object 
[{
    "URL": "",
    "email": "",
    "password": "",
    "clientID": "",
    "expertsTabLink": ""
  }]

## Development

- Run `npm init`  in the proeject folder
- Run `npm install prettier` to install prettier
- Run `npm install @playwright/test` to install Playwright
- Run `npx playwirght install` to install default browsers for tests

- Run `npm run test:BYOE` to start automation testing of BYOE
- All scripts could be found in `package.json` file
