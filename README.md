# WhatsMyFit Write Lambda functions

### Install Serverless CLI and Serverless DynamoDB local
[Serverless CLI doc](https://serverless.com/framework/docs/providers/aws/cli-reference/) might be helpful
```(bash)
$ npm i serverless -g
$ sls dynamodb install
```

### Run lambda functions locally
[serverless-offline plugin](https://www.npmjs.com/package/serverless-offline) and [serverless-plugin-typescript](https://www.npmjs.com/package/serverless-plugin-typescript) might be helpful
```(bash)
$ yarn install
$ sls offline start
```

Open [http://localhost:3000]( http://localhost:3000) in web browser

### Serverless workflow
Read [Workflow](https://serverless.com/framework/docs/providers/aws/guide/workflow/) for recommendation on CI/CD workflow

### TSLint
```(bash)
$ yarn run lint
```

### Unit tests
```(bash)
$ yarn run test
```

### Start local DynamoDB when running serverless offline
- We use [serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local) plugin to run DynamoDB locally. See also example [serverless-react-boilerplate](https://github.com/99xt/serverless-react-boilerplate)
- When you run `sls offline start` to start DynamoDB will be started locally and seeded according to the serverless.yml configuration. Visit DynamoDB Shell at http://localhost:8000/shell

### Debug with serverless-offline in Intellij
- Set breakpoints in Typescript code
- Setup new `Node.js` run configuration with **Application Parameters**: `/usr/local/bin/sls offline start`
- Press the Debug-button


### Swagger doc for APIs
We use [serverless-aws-documentation](https://github.com/deliveryhero/serverless-aws-documentation#readme) plugin for documenting API Gateway endpoint.

### Add/modify secrets
We use [serverless-aws-secrets](https://github.com/serverless/serverless-secrets-plugin) for adding secrets as encrypted values in environment variables.

- NOTE 1! **Only encrypted secret files shall be commited to GIT**
- NOTE 2! **You need to make sure that you have decrypted secret file locally before deploying the service to AWS**

```(bash)
# Decrypt secrets and add/modify variables/secrets
$ serverless decrypt --stage dev --password '<insert encryption password>'

# Encrypt secrets
$ serverless encrypt --stage dev --password '<insert encryption password>'
```

### AWS Account
- To deploy lambda function to AWS you need an AWS account and an IAM user that has following permissions:
  - `AWSLambdaFullAccess`
  - `IAMFullAccess` (it might be possible to narrow access rights)
  - AWS Api Gateway full access (create inline policy)
  - AWS Cloud Formation full access (create inline policy)
- Make sure to install [AWS CLI](https://aws.amazon.com/cli/) on your machine

### Check outdated NPM dependencies
```(bash)
$ npm outdated
```