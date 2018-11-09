# WhatsMyFit Write Lambda functions

### Install Serverless CLI
[Serverless CLI doc](https://serverless.com/framework/docs/providers/aws/cli-reference/) might be helpful
```(bash)
$ npm i serverless -g
```

### Run lambda functions locally
[serverless-offline plugin](https://www.npmjs.com/package/serverless-offline) and [serverless-plugin-typescript](https://www.npmjs.com/package/serverless-plugin-typescript) might be helpful
```(bash)
$ sls offline start
```

Open [http://localhost:3000/hello]( http://localhost:3000/hello) in web browser

### TSLint
```(bash)
$ npm run lint
```