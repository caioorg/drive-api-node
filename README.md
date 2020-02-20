NodeJS - GoogleDrive API
======================================

This project developed as a form of study using some libraries.

- FS support via [fs](https://www.npmjs.com/package/fs)
- GoogleDrive API [googleapis] (https://www.npmjs.com/package/googleapis)
- ReadLine by - [readline] (https://www.npmjs.com/package/readline)

## Functional requirements:

For the application to work it is necessary to create a client secret and client id of the application itself. To do this, follow these steps:

- Visit: [web](https://developers.google.com/drive/api/v3/quickstart/nodejs)
- Click: Enable the Drive API
- Download the credential file and insert the downloaded file at the root of the project with the name credentials.json
- Run the Project

## Getting Started

```sh
# clone it
  git clone https://github.com/caioorg/drive-api-node
  cd drive-api-node

# Make it your own
  rm -rf .git && git init
  
# Install dependencies
  npm install

# Start project development
  node .

```

## Comments:

In the first run, an access link will appear on your terminal so that you can generate the specific token of your application, follow the steps and at the end everything will work normally.

## License

MIT
