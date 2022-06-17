# Automation Playwright tests

## Prerequisites

- install npm
- Create a json file `env-data.json` in `/test-data` folder
- Specify enviroment data in the object

```
  "URL": "https://instance.link.com",
  "email": "",
  "password": "",
  "client_user_ID": "",
  "project1_ID": "",
  "project2_ID": ""
```

## Development

- Run `npm init` in the proeject folder
- Run `npm install prettier` to install prettier
- Run `npm install @playwright/test` to install Playwright
- Run `npx playwirght install` to install default browsers for tests

## Run tests

- Run `npm run report` to open report in browser
- Run `npm run debug` to start tests visually
- Run `npm run test` to start tests headless
