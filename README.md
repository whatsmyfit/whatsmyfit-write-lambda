# WhatsMyFit Write Lambda functions

### Install Serverless CLI
[Serverless CLI doc](https://serverless.com/framework/docs/providers/aws/cli-reference/) might be helpful
```(bash)
$ npm i serverless -g
```

### Run lambda functions locally
[serverless-offline plugin](https://www.npmjs.com/package/serverless-offline) and [serverless-plugin-typescript](https://www.npmjs.com/package/serverless-plugin-typescript) might be helpful
```(bash)
$ yarn install
$ sls offline start
```

Open [http://localhost:3000/hello]( http://localhost:3000/hello) in web browser

### TSLint
```(bash)
$ npm run lint
```

### AWS Account
- To deploy lambda function to AWS you need an AWS account and an IAM user that has following permissions:
  - `AWSLambdaFullAccess`
  - `IAMFullAccess` (it might be possible to narrow access rights)
  - AWS Api Gateway full access (create inline policy)
  - AWS Cloud Formation full access (create inline policy)
- Make sure to install [AWS CLI](https://aws.amazon.com/cli/) on your machine
